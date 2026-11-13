/**
 * Shared LLM chat for Synapse AI features (Ollama, OpenAI, OpenRouter).
 * Privacy defaults mirror Myelin's llmProvider helpers.
 */
import {
  getDecryptedSetting,
  getSetting,
  getSettingBool,
  SETTING_KEYS,
} from './appSettings';
import { AiError } from './aiSuggestShared';
import { chatWithOllama } from './ollamaClient';
import logger from '../utils/logger';

export type AiProvider = 'ollama' | 'openai' | 'openrouter';

export type LlmResolvedConfig = {
  provider: AiProvider;
  model: string;
  openAiApiKey: string;
  openRouterApiKey: string;
  openRouterRequireZdr: boolean;
  ollamaBaseUrl: string;
};

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';

export function normalizeAiProvider(raw: string | null | undefined): AiProvider {
  const normalized = String(raw || '').trim().toLowerCase();
  if (normalized === 'openai') return 'openai';
  if (normalized === 'openrouter') return 'openrouter';
  return 'ollama';
}

function resolveAppReferer(): string {
  const raw = String(
    process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'
  ).trim();
  return raw.replace(/\/+$/, '') || 'http://localhost:3010';
}

export function openRouterAttributionHeaders(): Record<string, string> {
  return {
    'HTTP-Referer': resolveAppReferer(),
    'X-OpenRouter-Title': 'Synapse',
    'X-Title': 'Synapse',
  };
}

export type LlmPrivacyOptions = {
  openRouterRequireZdr?: boolean;
};

export function applyLlmPrivacyDefaults(
  provider: AiProvider,
  body: Record<string, unknown>,
  options?: LlmPrivacyOptions
): Record<string, unknown> {
  if (provider === 'openai') {
    return { ...body, store: false };
  }
  if (provider === 'openrouter') {
    const providerPrefs: Record<string, unknown> = {
      data_collection: 'deny',
    };
    if (options?.openRouterRequireZdr) {
      providerPrefs.zdr = true;
    }
    return {
      ...body,
      provider: providerPrefs,
    };
  }
  return body;
}

export async function resolveLlmConfig(): Promise<LlmResolvedConfig> {
  const [
    providerRaw,
    openaiApiKey,
    openaiModel,
    ollamaBaseUrl,
    ollamaModel,
    openRouterApiKey,
    openRouterModel,
    openRouterRequireZdr,
  ] = await Promise.all([
    getSetting(SETTING_KEYS.aiProvider),
    getDecryptedSetting(SETTING_KEYS.openaiApiKey),
    getSetting(SETTING_KEYS.openaiModel),
    getSetting(SETTING_KEYS.ollamaBaseUrl),
    getSetting(SETTING_KEYS.ollamaModel),
    getDecryptedSetting(SETTING_KEYS.openrouterApiKey),
    getSetting(SETTING_KEYS.openrouterModel),
    getSettingBool(SETTING_KEYS.openrouterRequireZdr, false),
  ]);

  const provider = normalizeAiProvider(providerRaw);
  let model = '';
  if (provider === 'openai') {
    model = (openaiModel || '').trim() || DEFAULT_OPENAI_MODEL;
  } else if (provider === 'openrouter') {
    model = (openRouterModel || '').trim() || DEFAULT_OPENROUTER_MODEL;
  } else {
    model = (ollamaModel || '').trim();
  }

  return {
    provider,
    model,
    openAiApiKey: (openaiApiKey || '').trim(),
    openRouterApiKey: (openRouterApiKey || '').trim(),
    openRouterRequireZdr,
    ollamaBaseUrl: String(ollamaBaseUrl || '')
      .trim()
      .replace(/\/+$/, ''),
  };
}

async function chatOpenAiCompatible(params: {
  provider: 'openai' | 'openrouter';
  url: string;
  apiKey: string;
  model: string;
  system: string;
  user: string;
  openRouterRequireZdr?: boolean;
  jsonMode?: boolean;
}): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${params.apiKey}`,
  };
  if (params.provider === 'openrouter') {
    Object.assign(headers, openRouterAttributionHeaders());
  }

  let body: Record<string, unknown> = {
    model: params.model,
    temperature: 0.2,
    messages: [
      { role: 'system', content: params.system },
      { role: 'user', content: params.user },
    ],
  };
  if (params.jsonMode !== false) {
    body.response_format = { type: 'json_object' };
  }
  body = applyLlmPrivacyDefaults(params.provider, body, {
    openRouterRequireZdr: params.openRouterRequireZdr,
  });

  let response: Response;
  try {
    response = await fetch(params.url, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify(body),
    });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      throw new AiError(
        params.provider === 'openrouter' ? 'OpenRouter request timed out' : 'OpenAI request timed out',
        504
      );
    }
    logger.error(`${params.provider} request failed`, { error });
    throw new AiError(
      params.provider === 'openrouter'
        ? 'Could not reach OpenRouter — check network and API key'
        : 'Could not reach OpenAI — check network and API key',
      502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    logger.warn(`${params.provider} HTTP error`, {
      status: response.status,
      detail: detail.slice(0, 500),
    });
    if (response.status === 401) {
      throw new AiError(
        params.provider === 'openrouter' ? 'OpenRouter API key rejected' : 'OpenAI API key rejected',
        401
      );
    }
    throw new AiError(
      `${params.provider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} returned HTTP ${response.status}`,
      502
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new AiError(
      params.provider === 'openrouter'
        ? 'OpenRouter returned a non-JSON response'
        : 'OpenAI returned a non-JSON response',
      502
    );
  }

  const choices =
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { choices?: unknown }).choices)
      ? (payload as { choices: Array<{ message?: { content?: unknown } }> }).choices
      : [];
  const content = choices[0]?.message?.content != null ? String(choices[0].message.content) : '';
  if (!content.trim()) {
    throw new AiError(
      params.provider === 'openrouter'
        ? 'OpenRouter returned an empty message'
        : 'OpenAI returned an empty message',
      502
    );
  }
  return content;
}

/**
 * Run a chat completion against the admin-configured provider.
 * Prefer JSON object responses when the model supports it (OpenAI / OpenRouter).
 */
export async function chatCompletion(params: {
  system: string;
  user: string;
  jsonMode?: boolean;
}): Promise<{ content: string; provider: AiProvider; model: string }> {
  const config = await resolveLlmConfig();

  if (config.provider === 'openai') {
    if (!config.openAiApiKey) {
      throw new AiError('OpenAI API key is not configured', 400);
    }
    const content = await chatOpenAiCompatible({
      provider: 'openai',
      url: OPENAI_CHAT_URL,
      apiKey: config.openAiApiKey,
      model: config.model,
      system: params.system,
      user: params.user,
      jsonMode: params.jsonMode,
    });
    return { content, provider: 'openai', model: config.model };
  }

  if (config.provider === 'openrouter') {
    if (!config.openRouterApiKey) {
      throw new AiError('OpenRouter API key is not configured', 400);
    }
    if (!config.model) {
      throw new AiError('OpenRouter model is not configured', 400);
    }
    const content = await chatOpenAiCompatible({
      provider: 'openrouter',
      url: OPENROUTER_CHAT_URL,
      apiKey: config.openRouterApiKey,
      model: config.model,
      system: params.system,
      user: params.user,
      openRouterRequireZdr: config.openRouterRequireZdr,
      jsonMode: params.jsonMode,
    });
    return { content, provider: 'openrouter', model: config.model };
  }

  if (!config.model) {
    throw new AiError('Ollama model name is not configured', 400);
  }
  const content = await chatWithOllama({
    model: config.model,
    system: params.system,
    user: params.user,
  });
  return { content, provider: 'ollama', model: config.model };
}

function isOpenAiChatModelId(id: string): boolean {
  const lower = id.toLowerCase();
  if (
    /embedding|whisper|tts|dall-e|moderation|realtime|transcribe|image|audio|codex|davinci|babbage|curie|ada/.test(
      lower
    )
  ) {
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
    .filter((id) => id && isOpenAiChatModelId(id));
  ids.sort((a, b) => a.localeCompare(b));
  return ids;
}

export async function pingOpenAiApiKey(apiKeyOverride?: string | null): Promise<{ ok: true }> {
  await listOpenAiModels(apiKeyOverride);
  return { ok: true };
}

/** List models from OpenRouter (validates the API key). */
export async function listOpenRouterModels(apiKeyOverride?: string | null): Promise<string[]> {
  const key =
    apiKeyOverride != null && String(apiKeyOverride).trim()
      ? String(apiKeyOverride).trim()
      : (await getDecryptedSetting(SETTING_KEYS.openrouterApiKey)) || '';
  if (!key) {
    throw new AiError('OpenRouter API key is not configured', 400);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  let response: Response;
  try {
    response = await fetch(OPENROUTER_MODELS_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
        ...openRouterAttributionHeaders(),
      },
      signal: controller.signal,
    });
  } catch (error) {
    if ((error as { name?: string })?.name === 'AbortError') {
      throw new AiError('OpenRouter request timed out', 504);
    }
    throw new AiError('Could not reach OpenRouter', 502);
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    if (response.status === 401) throw new AiError('OpenRouter API key rejected', 401);
    throw new AiError(`OpenRouter returned HTTP ${response.status}`, 502);
  }
  const payload = (await response.json().catch(() => ({}))) as {
    data?: Array<{ id?: string }>;
  };
  const ids = (payload.data || [])
    .map((m) => String(m.id || '').trim())
    .filter(Boolean);
  ids.sort((a, b) => a.localeCompare(b));
  return ids;
}

export async function pingOpenRouterApiKey(apiKeyOverride?: string | null): Promise<{ ok: true }> {
  await listOpenRouterModels(apiKeyOverride);
  return { ok: true };
}
