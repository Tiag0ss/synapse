/**
 * Suggest frontmatter todos via configured AI provider (Ollama, OpenAI, or OpenRouter).
 */
import { getSettingBool, SETTING_KEYS } from './appSettings';
import {
  AiError,
  buildSuggestTodosUserContent,
  normalizeProposedList,
  parseJsonContent,
  SYSTEM_INSTRUCTIONS,
  type ProposedTodoSuggestion,
} from './aiSuggestShared';
import { chatCompletion } from './llmChat';
import logger from '../utils/logger';

export type { ProposedTodoSuggestion };
export { AiError, OllamaError } from './aiSuggestShared';
export {
  normalizeAiProvider,
  listOpenAiModels,
  pingOpenAiApiKey,
  listOpenRouterModels,
  pingOpenRouterApiKey,
  type AiProvider,
} from './llmChat';

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

  const userContent = buildSuggestTodosUserContent(input);

  logger.info('AI suggest-todos request', {
    title: input.title,
    path: input.path || null,
    noteChars: String(input.bodyMarkdown || '').length,
    existingCount: input.existingTodoTitles.length,
  });

  const { content: message, provider, model } = await chatCompletion({
    system: SYSTEM_INSTRUCTIONS,
    user: userContent,
    jsonMode: true,
  });

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
