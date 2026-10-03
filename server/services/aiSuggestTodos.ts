/**
 * Suggest frontmatter todos via configured AI provider (Ollama or OpenAI).
 */
import {
  getDecryptedSetting,
  getSetting,
  getSettingBool,
  SETTING_KEYS,
} from './appSettings';
import {
  AiError,
  buildSuggestTodosUserContent,
  normalizeProposedList,
  parseJsonContent,
  SYSTEM_INSTRUCTIONS,
  type ProposedTodoSuggestion,
} from './aiSuggestShared';
import { chatWithOllama } from './ollamaClient';
import logger from '../utils/logger';

export type { ProposedTodoSuggestion };
export { AiError, OllamaError } from './aiSuggestShared';

export type AiProvider = 'ollama' | 'openai';

export function normalizeAiProvider(raw: string | null | undefined): AiProvider {
  return String(raw || '').trim().toLowerCase() === 'openai' ? 'openai' : 'ollama';
}

async function chatWithOpenAI(params: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
}): Promise<string> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000);
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: params.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: params.system },
          { role: 'user', content: params.user },
        ],
      }),
    });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      throw new AiError('OpenAI request timed out', 504);
    }
    logger.error('OpenAI request failed', { error });
    throw new AiError('Could not reach OpenAI — check network and API key', 502);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    logger.warn('OpenAI HTTP error', { status: response.status, detail: detail.slice(0, 500) });
    if (response.status === 401) {
      throw new AiError('OpenAI API key rejected', 401);
    }
    throw new AiError(`OpenAI returned HTTP ${response.status}`, 502);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AiError('OpenAI returned a non-JSON response', 502);
  }

  const choices =
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { choices?: unknown }).choices)
      ? (payload as { choices: Array<{ message?: { content?: unknown } }> }).choices
      : [];
  const content = choices[0]?.message?.content != null ? String(choices[0].message.content) : '';
  if (!content.trim()) {
    throw new AiError('OpenAI returned an empty message', 502);
  }
  return content;
}

function isChatCompletionsModelId(id: string): boolean {
  const lower = id.toLowerCase();
  if (/embedding|whisper|tts|dall-e|moderation|realtime|transcribe|image|audio|codex|davinci|babbage|curie|ada/.test(lower)) {
    return false;
  }
  return /^(gpt-|o[1-9]|chatgpt-|ft:gpt-)/i.test(id);
}

/** List chat-capable models for the Admin AI combo (validates the API key). */
export async function listOpenAiModels(apiKeyOverride?: string | null): Promise<string[]> {
  const key =
    apiKeyOverride != null && String(apiKeyOverride).trim()
      ? String(apiKeyOverride).trim()
      : (await getDecryptedSetting(SETTING_KEYS.openaiApiKey)) || '';
  if (!key) {
    throw new AiError('OpenAI API key is not configured', 400);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
      signal: controller.signal,
    });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      throw new AiError('OpenAI request timed out', 504);
    }
    throw new AiError('Could not reach OpenAI', 502);
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    if (response.status === 401) throw new AiError('OpenAI API key rejected', 401);
    throw new AiError(`OpenAI returned HTTP ${response.status}`, 502);
  }
  const payload = (await response.json().catch(() => ({}))) as {
    data?: Array<{ id?: string }>;
  };
  const ids = (payload.data || [])
    .map((m) => String(m.id || '').trim())
    .filter((id) => id && isChatCompletionsModelId(id));
  ids.sort((a, b) => a.localeCompare(b));
  return ids;
}

/** Lightweight ping: list models to validate the API key. */
export async function pingOpenAiApiKey(apiKeyOverride?: string | null): Promise<{ ok: true }> {
  await listOpenAiModels(apiKeyOverride);
  return { ok: true };
}

export async function suggestTodosFromNote(input: {
  title: string;
  path?: string | null;
  bodyMarkdown: string;
  existingTodoTitles: string[];
}): Promise<ProposedTodoSuggestion[]> {
  const enabled = await getSettingBool(SETTING_KEYS.aiEnabled, false);
  if (!enabled) {
    throw new AiError('AI suggestions are disabled in Admin settings', 400);
  }

  const provider = normalizeAiProvider(await getSetting(SETTING_KEYS.aiProvider));
  const userContent = buildSuggestTodosUserContent(input);

  let message: string;
  let model: string;

  if (provider === 'openai') {
    const apiKey = (await getDecryptedSetting(SETTING_KEYS.openaiApiKey)) || '';
    model = ((await getSetting(SETTING_KEYS.openaiModel)) || '').trim() || 'gpt-4o-mini';
    if (!apiKey) {
      throw new AiError('OpenAI API key is not configured', 400);
    }
    logger.info('AI suggest-todos request', {
      provider,
      model,
      title: input.title,
      path: input.path || null,
      noteChars: String(input.bodyMarkdown || '').length,
      existingCount: input.existingTodoTitles.length,
    });
    message = await chatWithOpenAI({
      apiKey,
      model,
      system: SYSTEM_INSTRUCTIONS,
      user: userContent,
    });
  } else {
    model = ((await getSetting(SETTING_KEYS.ollamaModel)) || '').trim();
    if (!model) {
      throw new AiError('Ollama model name is not configured', 400);
    }
    logger.info('AI suggest-todos request', {
      provider,
      model,
      title: input.title,
      path: input.path || null,
      noteChars: String(input.bodyMarkdown || '').length,
      existingCount: input.existingTodoTitles.length,
    });
    message = await chatWithOllama({
      model,
      system: SYSTEM_INSTRUCTIONS,
      user: userContent,
    });
  }

  let parsedJson: unknown;
  try {
    parsedJson = parseJsonContent(message);
  } catch (error) {
    logger.warn('AI JSON parse failed', { provider, model, preview: message.slice(0, 800) });
    if (error instanceof AiError) throw error;
    throw new AiError('AI returned invalid JSON', 502);
  }

  const proposed = normalizeProposedList(parsedJson);
  if (!proposed.length) {
    logger.warn('AI JSON shape unmatched', {
      provider,
      model,
      preview: message.slice(0, 800),
    });
    throw new AiError(
      'AI returned JSON without usable todos — try again or use a larger model',
      502
    );
  }

  logger.info('AI suggest-todos response', {
    provider,
    model,
    proposedCount: proposed.length,
  });

  return proposed;
}
