import { getSetting, SETTING_KEYS } from './appSettings';
import { AiError, OllamaError } from './aiSuggestShared';
import logger from '../utils/logger';

export type { ProposedTodoSuggestion } from './aiSuggestShared';
export { AiError, OllamaError } from './aiSuggestShared';

function normalizeOllamaBaseUrl(raw: string): string {
  return String(raw || '')
    .trim()
    .replace(/\/+$/, '');
}

/** List local models from Ollama `GET /api/tags`. */
export async function listOllamaModels(baseUrlOverride?: string | null): Promise<string[]> {
  const fromSettings = (await getSetting(SETTING_KEYS.ollamaBaseUrl)) || '';
  const baseUrl = normalizeOllamaBaseUrl(baseUrlOverride != null ? baseUrlOverride : fromSettings);
  if (!baseUrl) {
    throw new OllamaError('Ollama base URL is not configured', 400);
  }

  const url = `${baseUrl}/api/tags`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  let response: Response;
  try {
    response = await fetch(url, { method: 'GET', signal: controller.signal });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      throw new OllamaError('Ollama request timed out', 504);
    }
    logger.error('Ollama tags request failed', { error, url });
    throw new OllamaError(
      'Could not reach Ollama — check base URL and that the service is running',
      502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new OllamaError(`Ollama returned HTTP ${response.status}`, 502);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new OllamaError('Ollama returned a non-JSON response', 502);
  }

  const models =
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { models?: unknown }).models)
      ? (payload as { models: Array<{ name?: unknown }> }).models
      : [];

  const names = models
    .map((m) => (m?.name != null ? String(m.name).trim() : ''))
    .filter(Boolean);

  return [...new Set(names)].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

/** Chat completion against local Ollama. */
export async function chatWithOllama(params: {
  model: string;
  system: string;
  user: string;
  baseUrlOverride?: string | null;
}): Promise<string> {
  const fromSettings = (await getSetting(SETTING_KEYS.ollamaBaseUrl)) || '';
  const baseUrl = normalizeOllamaBaseUrl(
    params.baseUrlOverride != null ? params.baseUrlOverride : fromSettings
  );
  if (!baseUrl) {
    throw new AiError('Ollama base URL is not configured', 400);
  }
  if (!params.model.trim()) {
    throw new AiError('Ollama model name is not configured', 400);
  }

  const url = `${baseUrl}/api/chat`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: params.model,
        stream: false,
        format: 'json',
        keep_alive: '5m',
        options: {
          temperature: 0.2,
          num_ctx: 32768,
          num_predict: 4096,
        },
        messages: [
          { role: 'system', content: params.system },
          { role: 'user', content: params.user },
        ],
      }),
    });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      throw new AiError('Ollama request timed out', 504);
    }
    logger.error('Ollama request failed', { error, url });
    throw new AiError(
      'Could not reach Ollama — check base URL and that the service is running',
      502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    logger.warn('Ollama HTTP error', { status: response.status, detail: detail.slice(0, 500) });
    throw new AiError(
      response.status === 404
        ? 'Ollama model not found — pull it on the Ollama host or change the model name'
        : `Ollama returned HTTP ${response.status}`,
      502
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AiError('Ollama returned a non-JSON response', 502);
  }

  const message =
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    payload.message &&
    typeof payload.message === 'object' &&
    'content' in (payload.message as object)
      ? String((payload.message as { content?: unknown }).content || '')
      : '';

  if (!message.trim()) {
    throw new AiError('Ollama returned an empty message', 502);
  }
  return message;
}
