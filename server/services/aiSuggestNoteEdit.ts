/**
 * Suggest a note edit (whole body or selection) via configured AI provider.
 * Never writes the note — caller reviews and applies.
 */
import { getSettingBool, SETTING_KEYS } from './appSettings';
import { AiError, parseJsonContent } from './aiSuggestShared';
import { chatCompletion } from './llmChat';
import { SYNAPSE_MARKDOWN_GUIDE } from './synapseMarkdownGuide';
import logger from '../utils/logger';

const MAX_NOTE_CHARS = 200_000;
const CONTEXT_CHARS = 2_000;

export type SuggestNoteEditMode = 'whole' | 'selection';

export type SuggestNoteEditResult = {
  mode: SuggestNoteEditMode;
  before: string;
  after: string;
  selectionStart: number | null;
  selectionEnd: number | null;
};

const WHOLE_SYSTEM = `You are a careful markdown editor for Synapse (a personal knowledge vault).

Edit the note according to the user's instruction. Return ONLY valid JSON:
{"bodyMarkdown":"…full edited markdown…"}

Task rules:
1. Return the complete note body (not a patch or diff).
2. Apply the instruction with the smallest change set that satisfies it.
3. Do not wrap the JSON in markdown fences.

${SYNAPSE_MARKDOWN_GUIDE}`;

const SELECTION_SYSTEM = `You are a careful markdown editor for Synapse (a personal knowledge vault).

Edit ONLY the selected markdown span according to the user's instruction. Return ONLY valid JSON:
{"replacement":"…edited selection only…"}

Task rules:
1. Return only the replacement for the selection — not the full note.
2. Apply the instruction with the smallest change set that satisfies it.
3. Match surrounding tone using the provided context; do not repeat the context in the replacement.
4. Do not wrap the JSON in markdown fences.

${SYNAPSE_MARKDOWN_GUIDE}`;

function truncateNote(body: string): string {
  if (body.length <= MAX_NOTE_CHARS) return body;
  return `${body.slice(0, MAX_NOTE_CHARS)}\n\n[…truncated ${body.length - MAX_NOTE_CHARS} chars…]`;
}

function pickBodyMarkdown(parsed: unknown): string | null {
  if (parsed == null) return null;
  if (typeof parsed === 'string') {
    const s = parsed.trim();
    return s || null;
  }
  if (typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const obj = parsed as Record<string, unknown>;
  for (const key of ['bodyMarkdown', 'markdown', 'body', 'content', 'text']) {
    if (typeof obj[key] === 'string') {
      return String(obj[key]);
    }
  }
  return null;
}

function pickReplacement(parsed: unknown): string | null {
  if (parsed == null) return null;
  if (typeof parsed === 'string') return parsed;
  if (typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const obj = parsed as Record<string, unknown>;
  for (const key of ['replacement', 'text', 'content', 'selection', 'bodyMarkdown']) {
    if (typeof obj[key] === 'string') {
      return String(obj[key]);
    }
  }
  return null;
}

export async function suggestNoteEdit(input: {
  instruction: string;
  title?: string | null;
  path?: string | null;
  bodyMarkdown: string;
  selectionStart?: number | null;
  selectionEnd?: number | null;
}): Promise<SuggestNoteEditResult> {
  const enabled = await getSettingBool(SETTING_KEYS.aiEnabled, false);
  if (!enabled) {
    throw new AiError('AI suggestions are disabled in Admin settings', 400);
  }

  const instruction = String(input.instruction || '').trim();
  if (!instruction) {
    throw new AiError('Instruction is required', 400);
  }

  const body = String(input.bodyMarkdown ?? '');
  const startRaw = input.selectionStart;
  const endRaw = input.selectionEnd;
  const hasSelection =
    startRaw != null &&
    endRaw != null &&
    Number.isFinite(startRaw) &&
    Number.isFinite(endRaw) &&
    Number(startRaw) !== Number(endRaw);

  if (hasSelection) {
    let start = Math.max(0, Math.min(Number(startRaw), Number(endRaw)));
    let end = Math.max(0, Math.max(Number(startRaw), Number(endRaw)));
    if (end > body.length) end = body.length;
    if (start > body.length) start = body.length;
    if (start === end) {
      throw new AiError('Selection is empty', 400);
    }

    const before = body.slice(start, end);
    const prefix = body.slice(Math.max(0, start - CONTEXT_CHARS), start);
    const suffix = body.slice(end, Math.min(body.length, end + CONTEXT_CHARS));

    const user = [
      `Instruction: ${instruction}`,
      input.title ? `Note title: ${input.title}` : null,
      input.path ? `Note path: ${input.path}` : null,
      '',
      'This is Synapse markdown. Preserve [[wikilinks]], ![[embeds]], <!--synapse:cb:…-->, YAML, ::: fences, #tags, and media URLs unless the instruction asks otherwise.',
      '',
      '===== CONTEXT BEFORE SELECTION =====',
      prefix || '(start of note)',
      '===== BEGIN SELECTION =====',
      before,
      '===== END SELECTION =====',
      '===== CONTEXT AFTER SELECTION =====',
      suffix || '(end of note)',
      '',
      'Respond with JSON only: {"replacement":"…"}',
    ]
      .filter((line) => line != null)
      .join('\n');

    logger.info('AI suggest-edit request', {
      mode: 'selection',
      title: input.title || null,
      path: input.path || null,
      selectionChars: before.length,
      instructionChars: instruction.length,
    });

    const { content: message, provider, model } = await chatCompletion({
      system: SELECTION_SYSTEM,
      user,
      jsonMode: true,
    });

    let parsed: unknown;
    try {
      parsed = parseJsonContent(message);
    } catch (error) {
      logger.warn('AI suggest-edit JSON parse failed', {
        provider,
        model,
        mode: 'selection',
        preview: message.slice(0, 800),
      });
      if (error instanceof AiError) throw error;
      throw new AiError('AI returned invalid JSON', 502);
    }

    const after = pickReplacement(parsed);
    if (after == null) {
      throw new AiError('AI returned JSON without a usable replacement', 502);
    }

    logger.info('AI suggest-edit response', {
      provider,
      model,
      mode: 'selection',
      beforeChars: before.length,
      afterChars: after.length,
    });

    return {
      mode: 'selection',
      before,
      after,
      selectionStart: start,
      selectionEnd: end,
    };
  }

  const markdownForModel = truncateNote(body);
  const user = [
    `Instruction: ${instruction}`,
    input.title ? `Note title: ${input.title}` : null,
    input.path ? `Note path: ${input.path}` : null,
    `Note length: ${body.length} characters`,
    '',
    'This is Synapse markdown. Preserve [[wikilinks]], ![[embeds]], <!--synapse:cb:…-->, YAML, ::: fences, #tags, and media URLs unless the instruction asks otherwise.',
    '',
    '===== BEGIN FULL NOTE MARKDOWN =====',
    markdownForModel,
    '===== END FULL NOTE MARKDOWN =====',
    '',
    'Respond with JSON only: {"bodyMarkdown":"…"}',
  ]
    .filter((line) => line != null)
    .join('\n');

  logger.info('AI suggest-edit request', {
    mode: 'whole',
    title: input.title || null,
    path: input.path || null,
    noteChars: body.length,
    instructionChars: instruction.length,
  });

  const { content: message, provider, model } = await chatCompletion({
    system: WHOLE_SYSTEM,
    user,
    jsonMode: true,
  });

  let parsed: unknown;
  try {
    parsed = parseJsonContent(message);
  } catch (error) {
    logger.warn('AI suggest-edit JSON parse failed', {
      provider,
      model,
      mode: 'whole',
      preview: message.slice(0, 800),
    });
    if (error instanceof AiError) throw error;
    throw new AiError('AI returned invalid JSON', 502);
  }

  const after = pickBodyMarkdown(parsed);
  if (after == null) {
    throw new AiError('AI returned JSON without usable bodyMarkdown', 502);
  }

  logger.info('AI suggest-edit response', {
    provider,
    model,
    mode: 'whole',
    beforeChars: body.length,
    afterChars: after.length,
  });

  return {
    mode: 'whole',
    before: body,
    after,
    selectionStart: null,
    selectionEnd: null,
  };
}
