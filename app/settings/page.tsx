'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AppUserMenu from '@/components/AppUserMenu';
import ConfirmModal from '@/components/ConfirmModal';
import PromptModal from '@/components/PromptModal';
import VaultShareModal from '@/components/VaultShareModal';
import WordExportHelpModal from '@/components/WordExportHelpModal';
import { useI18n } from '@/lib/i18n/provider';

type Tab = 'general' | 'auth' | 'email' | 'pm' | 'ai' | 'templates' | 'export' | 'users' | 'vaults';

interface SettingsData {
  general: { siteName: string; allowPublicWikiDirectory: boolean };
  auth: { allowPublicRegistration: boolean; allowSsoLogin: boolean; minPasswordLength: number };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpSecure: boolean;
    smtpUser: string;
    smtpFrom: string;
    smtpFromName: string;
    hasSmtpPassword: boolean;
    smtpConfigured: boolean;
  };
  projectManagement: {
    pmBaseUrl: string;
    pmIntegrationEnabled: boolean;
  };
  ai: {
    aiEnabled: boolean;
    aiProvider?: 'ollama' | 'openai';
    ollamaBaseUrl: string;
    ollamaModel: string;
    hasOpenaiApiKey?: boolean;
    openaiModel?: string;
  };
}

interface UserRow {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  hasPassword: boolean;
  pmUserId: number | null;
  lastLoginAt: string | null;
}

interface AdminVaultRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  defaultVisibility: string;
  allowPublicPages: boolean;
  noteCount: number;
  memberCount: number;
  owner: { userId: number; username: string; email: string } | null;
  updatedAt: string | null;
}

export default function SettingsPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('general');
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState<SettingsData | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [adminVaults, setAdminVaults] = useState<AdminVaultRow[]>([]);
  const [shareVault, setShareVault] = useState<AdminVaultRow | null>(null);
  const [ownerVault, setOwnerVault] = useState<AdminVaultRow | null>(null);
  const [ownerUserId, setOwnerUserId] = useState<number | ''>('');
  const [ownerBusy, setOwnerBusy] = useState(false);

  const [siteName, setSiteName] = useState('');
  const [allowWikiDir, setAllowWikiDir] = useState(true);
  const [allowReg, setAllowReg] = useState(true);
  const [allowSso, setAllowSso] = useState(true);
  const [minPass, setMinPass] = useState(8);
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [smtpFromName, setSmtpFromName] = useState('Synapse');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [clearSmtpPassword, setClearSmtpPassword] = useState(false);
  const [pmEnabled, setPmEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiProvider, setAiProvider] = useState<'ollama' | 'openai'>('ollama');
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState('http://127.0.0.1:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.2');
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [ollamaModelsBusy, setOllamaModelsBusy] = useState(false);
  const [ollamaModelsError, setOllamaModelsError] = useState('');
  const [hasOpenaiApiKey, setHasOpenaiApiKey] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [clearOpenaiApiKey, setClearOpenaiApiKey] = useState(false);
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini');
  const [openaiModels, setOpenaiModels] = useState<string[]>([]);
  const [openaiModelsBusy, setOpenaiModelsBusy] = useState(false);
  const [openaiModelsError, setOpenaiModelsError] = useState('');
  const [openaiPingBusy, setOpenaiPingBusy] = useState(false);
  const [openaiPingMsg, setOpenaiPingMsg] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [syncConfirmOpen, setSyncConfirmOpen] = useState(false);
  const [syncBusy, setSyncBusy] = useState(false);

  const [pendingTemplates, setPendingTemplates] = useState<
    Array<{
      id: number;
      label: string;
      description: string | null;
      ownerUsername?: string | null;
      bodyMarkdown: string;
    }>
  >([]);
  const [globalLabel, setGlobalLabel] = useState('');
  const [globalDescription, setGlobalDescription] = useState('');
  const [globalBody, setGlobalBody] = useState('# {{title}}\n\n');
  const [templatesBusy, setTemplatesBusy] = useState(false);

  const [exportTemplates, setExportTemplates] = useState<
    Array<{
      id: number;
      label: string;
      description: string | null;
      originalName: string;
      sizeBytes: number;
      createdAt: string;
    }>
  >([]);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportLabel, setExportLabel] = useState('');
  const [exportDescription, setExportDescription] = useState('');
  const [exportFileBase64, setExportFileBase64] = useState<string | null>(null);
  const [exportFileName, setExportFileName] = useState('');
  const [exportDeleteId, setExportDeleteId] = useState<number | null>(null);
  const [exportHelpOpen, setExportHelpOpen] = useState(false);

  const loadSettings = useCallback(async () => {
    const res = await fetch('/api/settings/general', { credentials: 'include' });
    if (res.status === 401 || res.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || t('status.failedToLoadSettings'));
      setLoading(false);
      return;
    }
    const d = json.data as SettingsData;
    setData(d);
    setSiteName(d.general.siteName);
    setAllowWikiDir(d.general.allowPublicWikiDirectory);
    setAllowReg(d.auth.allowPublicRegistration);
    setAllowSso(d.auth.allowSsoLogin);
    setMinPass(d.auth.minPasswordLength);
    setSmtpHost(d.email.smtpHost);
    setSmtpPort(d.email.smtpPort);
    setSmtpSecure(d.email.smtpSecure);
    setSmtpUser(d.email.smtpUser);
    setSmtpFrom(d.email.smtpFrom);
    setSmtpFromName(d.email.smtpFromName);
    setPmEnabled(d.projectManagement.pmIntegrationEnabled);
    setAiEnabled(d.ai?.aiEnabled ?? false);
    setAiProvider(d.ai?.aiProvider === 'openai' ? 'openai' : 'ollama');
    setOllamaBaseUrl(d.ai?.ollamaBaseUrl || 'http://127.0.0.1:11434');
    setOllamaModel(d.ai?.ollamaModel || 'llama3.2');
    setHasOpenaiApiKey(Boolean(d.ai?.hasOpenaiApiKey));
    setOpenaiModel(d.ai?.openaiModel || 'gpt-4o-mini');
    setOpenaiApiKey('');
    setClearOpenaiApiKey(false);
    setLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    const res = await fetch('/api/users', { credentials: 'include' });
    if (!res.ok) return;
    const json = await res.json();
    setUsers(json.data || []);
  }, []);

  const loadAdminVaults = useCallback(async () => {
    const res = await fetch('/api/settings/vaults', { credentials: 'include' });
    if (!res.ok) return;
    const json = await res.json();
    setAdminVaults(json.data || []);
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (tab === 'users' && !forbidden) void loadUsers();
  }, [tab, forbidden, loadUsers]);

  useEffect(() => {
    if (tab === 'vaults' && !forbidden) {
      void loadAdminVaults();
      void loadUsers();
    }
  }, [tab, forbidden, loadAdminVaults, loadUsers]);

  const loadOllamaModels = useCallback(async (baseUrl: string, currentModel: string) => {
    setOllamaModelsBusy(true);
    setOllamaModelsError('');
    try {
      const qs = new URLSearchParams();
      if (baseUrl.trim()) qs.set('baseUrl', baseUrl.trim());
      const res = await fetch(`/api/settings/ai/models?${qs.toString()}`, {
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        setOllamaModels([]);
        setOllamaModelsError(json.message || t('status.failedListModels'));
        return;
      }
      const list = (json.data?.models || []) as string[];
      setOllamaModels(list);
      if (list.length > 0 && !currentModel) {
        setOllamaModel(list[0]);
      }
    } catch {
      setOllamaModels([]);
      setOllamaModelsError(t('status.networkErrorListingOllama'));
    } finally {
      setOllamaModelsBusy(false);
    }
  }, [t]);

  const loadOpenaiModels = useCallback(async (currentModel: string, apiKeyDraft: string) => {
    setOpenaiModelsBusy(true);
    setOpenaiModelsError('');
    try {
      const res = await fetch('/api/settings/ai/openai/models', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiKeyDraft.trim() ? { apiKey: apiKeyDraft.trim() } : {}),
      });
      const json = await res.json();
      if (!res.ok) {
        setOpenaiModels([]);
        setOpenaiModelsError(json.message || t('status.failedListModels'));
        return;
      }
      const list = (json.data?.models || []) as string[];
      setOpenaiModels(list);
      if (list.length > 0 && (!currentModel || !list.includes(currentModel))) {
        const preferred =
          list.find((m) => m === 'gpt-4o-mini') ||
          list.find((m) => m.startsWith('gpt-4o')) ||
          list[0];
        if (preferred && preferred !== currentModel) setOpenaiModel(preferred);
      }
    } catch {
      setOpenaiModels([]);
      setOpenaiModelsError(t('status.networkErrorListingOpenai'));
    } finally {
      setOpenaiModelsBusy(false);
    }
  }, [t]);

  useEffect(() => {
    if (tab === 'ai' && !forbidden && !loading && aiProvider === 'ollama') {
      void loadOllamaModels(ollamaBaseUrl, ollamaModel);
    }
    if (tab === 'ai' && !forbidden && !loading && aiProvider === 'openai' && (hasOpenaiApiKey || openaiApiKey.trim())) {
      void loadOpenaiModels(openaiModel, openaiApiKey);
    }
    // Load once when opening the AI tab / switching provider.
  }, [tab, forbidden, loading, aiProvider]);

  const transferOwner = async () => {
    if (!ownerVault || ownerUserId === '') return;
    setOwnerBusy(true);
    setError('');
    setStatus('');
    try {
      const res = await fetch(`/api/settings/vaults/${ownerVault.id}/owner`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerUserId: Number(ownerUserId) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.ownershipTransferFailed'));
        return;
      }
      setStatus(t('settings.ownershipTransferred', { name: ownerVault.name }));
      setOwnerVault(null);
      setOwnerUserId('');
      await loadAdminVaults();
    } finally {
      setOwnerBusy(false);
    }
  };

  const loadPendingTemplates = useCallback(async () => {
    const res = await fetch('/api/templates/pending', { credentials: 'include' });
    if (!res.ok) return;
    const json = await res.json();
    setPendingTemplates(json.data || []);
  }, []);

  useEffect(() => {
    if (tab === 'templates' && !forbidden) void loadPendingTemplates();
  }, [tab, forbidden, loadPendingTemplates]);

  const loadExportTemplates = useCallback(async () => {
    const res = await fetch('/api/export-templates', { credentials: 'include' });
    if (!res.ok) return;
    const json = await res.json();
    setExportTemplates(json.data || []);
  }, []);

  useEffect(() => {
    if (tab === 'export' && !forbidden) void loadExportTemplates();
  }, [tab, forbidden, loadExportTemplates]);

  const uploadExportTemplate = async () => {
    if (!exportLabel.trim() || !exportFileBase64) {
      setError(t('status.labelAndDocxRequired'));
      return;
    }
    setExportBusy(true);
    setError('');
    setStatus('');
    try {
      const res = await fetch('/api/export-templates', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: exportLabel.trim(),
          description: exportDescription.trim() || null,
          dataBase64: exportFileBase64,
          fileName: exportFileName || 'template.docx',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.uploadFailed'));
        return;
      }
      setStatus(t('settings.wordTemplateUploaded'));
      setExportLabel('');
      setExportDescription('');
      setExportFileBase64(null);
      setExportFileName('');
      await loadExportTemplates();
    } finally {
      setExportBusy(false);
    }
  };

  const deleteExportTemplate = async () => {
    if (exportDeleteId == null) return;
    setExportBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/export-templates/${exportDeleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('chrome.deleteFailed'));
        return;
      }
      setStatus(t('settings.templateDeleted'));
      setExportDeleteId(null);
      await loadExportTemplates();
    } finally {
      setExportBusy(false);
    }
  };

  const save = async (extra: Record<string, unknown> = {}) => {
    setStatus('');
    setError('');
    const body: Record<string, unknown> = {
      siteName,
      allowPublicWikiDirectory: allowWikiDir,
      allowPublicRegistration: allowReg,
      allowSsoLogin: allowSso,
      minPasswordLength: minPass,
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      smtpFrom,
      smtpFromName,
      pmIntegrationEnabled: pmEnabled,
      aiEnabled,
      aiProvider,
      ollamaBaseUrl,
      ollamaModel,
      openaiModel,
      ...extra,
    };
    if (clearSmtpPassword) body.smtpPassword = '';
    else if (smtpPassword) body.smtpPassword = smtpPassword;
    if (clearOpenaiApiKey) body.openaiApiKey = '';
    else if (openaiApiKey) body.openaiApiKey = openaiApiKey;

    const res = await fetch('/api/settings/general', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || t('status.saveFailed'));
      return;
    }
    setStatus(json.message || t('settings.saved'));
    setSmtpPassword('');
    setClearSmtpPassword(false);
    if (openaiApiKey || clearOpenaiApiKey) {
      setHasOpenaiApiKey(Boolean(openaiApiKey) && !clearOpenaiApiKey);
    }
    setOpenaiApiKey('');
    setClearOpenaiApiKey(false);
    await loadSettings();
  };

  const testEmail = async () => {
    setStatus('');
    setError('');
    const res = await fetch('/api/settings/email/test', {
      method: 'POST',
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) setError(json.message || t('status.testFailed'));
    else setStatus(json.message || t('status.sent'));
  };

  async function toggleAdmin(u: UserRow) {
    setError('');
    const res = await fetch(`/api/users/${u.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin: !u.isAdmin }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.message || t('status.updateFailed'));
    else await loadUsers();
  }

  async function toggleActive(u: UserRow) {
    setError('');
    const res = await fetch(`/api/users/${u.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.message || t('status.updateFailed'));
    else await loadUsers();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
        {t('settings.loading')}
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-xl font-semibold">{t('settings.forbidden')}</h1>
        <Link href="/" className="mt-4 inline-block text-[var(--accent-soft)]">
          {t('settings.backVaults')}
        </Link>
      </main>
    );
  }

  const approveTemplate = async (id: number, approve: boolean) => {
    setTemplatesBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/templates/${id}/${approve ? 'approve' : 'reject'}`, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.actionFailed'));
        return;
      }
      setStatus(approve ? t('settings.templatePublished') : t('settings.shareRejected'));
      await loadPendingTemplates();
    } finally {
      setTemplatesBusy(false);
    }
  };

  const createGlobalTemplate = async () => {
    if (!globalLabel.trim()) return;
    setTemplatesBusy(true);
    setError('');
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: globalLabel.trim(),
          description: globalDescription.trim() || null,
          bodyMarkdown: globalBody,
          kind: 'global',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.failedCreateGlobalTemplate'));
        return;
      }
      setGlobalLabel('');
      setGlobalDescription('');
      setGlobalBody('# {{title}}\n\n');
      setStatus(t('settings.globalTemplateCreated'));
    } finally {
      setTemplatesBusy(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: t('settings.tabGeneral') },
    { id: 'auth', label: t('settings.tabAuth') },
    { id: 'email', label: t('settings.tabEmail') },
    { id: 'pm', label: t('settings.tabPm') },
    { id: 'ai', label: t('settings.tabAi') },
    { id: 'templates', label: t('settings.tabTemplates') },
    { id: 'export', label: t('settings.tabExport') },
    { id: 'users', label: t('settings.tabUsers') },
    { id: 'vaults', label: t('settings.tabVaults') },
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
            {t('settings.administration')}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{t('settings.title')}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="btn-ghost no-underline hover:no-underline">
            {t('settings.backVaults')}
          </Link>
          <AppUserMenu dense />
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-1 border-b border-[var(--border)] pb-2">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm ${
              tab === tabItem.id
                ? 'bg-[var(--surface-2)] text-[var(--text)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
            onClick={() => setTab(tabItem.id)}
          >
            {tabItem.label}
          </button>
        ))}
      </nav>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {status && (
        <p className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm">
          {status}
        </p>
      )}

      {tab === 'general' && (
        <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <label className="block text-sm">
            {t('settings.siteName')}
            <input className="input mt-1 w-full" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={allowWikiDir} onChange={(e) => setAllowWikiDir(e.target.checked)} />
            {t('settings.showWikiDir')}
          </label>
          <button type="button" className="btn-primary" onClick={() => void save()}>
            {t('common.save')}
          </button>
        </section>
      )}

      {tab === 'auth' && (
        <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={allowReg} onChange={(e) => setAllowReg(e.target.checked)} />
            {t('settings.allowRegistration')}
          </label>
          <p className="text-xs text-[var(--muted)]">{t('settings.allowRegistrationHint')}</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={allowSso} onChange={(e) => setAllowSso(e.target.checked)} />
            {t('settings.allowSso')}
          </label>
          <label className="block text-sm">
            {t('settings.minPasswordLength')}
            <input
              className="input mt-1 w-24"
              type="number"
              min={6}
              max={128}
              value={minPass}
              onChange={(e) => setMinPass(Number(e.target.value))}
            />
          </label>
          <button type="button" className="btn-primary" onClick={() => void save()}>
            {t('common.save')}
          </button>
        </section>
      )}

      {tab === 'email' && (
        <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <p className="text-xs text-[var(--muted)]">
            {t('settings.smtpHint')}{' '}
            {data?.email.smtpConfigured ? t('settings.smtpConfigured') : t('settings.smtpIncomplete')}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              {t('settings.host')}
              <input className="input mt-1 w-full" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
            </label>
            <label className="block text-sm">
              {t('settings.port')}
              <input className="input mt-1 w-full" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
            </label>
            <label className="flex items-center gap-2 self-end text-sm pb-2">
              <input type="checkbox" checked={smtpSecure} onChange={(e) => setSmtpSecure(e.target.checked)} />
              {t('settings.useTls')}
            </label>
            <label className="block text-sm">
              {t('settings.username')}
              <input className="input mt-1 w-full" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
            </label>
            <label className="block text-sm">
              {t('settings.password')}{' '}
              {data?.email.hasSmtpPassword ? t('settings.passwordSaved') : ''}
              <input
                className="input mt-1 w-full"
                type="password"
                placeholder={data?.email.hasSmtpPassword ? '••••••••' : ''}
                value={smtpPassword}
                onChange={(e) => {
                  setSmtpPassword(e.target.value);
                  setClearSmtpPassword(false);
                }}
              />
            </label>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={clearSmtpPassword}
                onChange={(e) => {
                  setClearSmtpPassword(e.target.checked);
                  if (e.target.checked) setSmtpPassword('');
                }}
              />
              {t('settings.clearSmtpPassword')}
            </label>
            <label className="block text-sm">
              {t('settings.fromEmail')}
              <input className="input mt-1 w-full" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} />
            </label>
            <label className="block text-sm">
              {t('settings.fromName')}
              <input
                className="input mt-1 w-full"
                value={smtpFromName}
                onChange={(e) => setSmtpFromName(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={() => void save()}>
              {t('common.save')}
            </button>
            <button type="button" className="btn-ghost" onClick={() => void testEmail()}>
              {t('settings.sendTestEmail')}
            </button>
          </div>
        </section>
      )}

      {tab === 'pm' && (
        <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pmEnabled} onChange={(e) => setPmEnabled(e.target.checked)} />
            {t('settings.enableMyelin')}
          </label>
          <label className="block text-sm">
            {t('settings.pmBaseUrl')}
            <input className="input mt-1 w-full opacity-70" readOnly value={data?.projectManagement.pmBaseUrl || ''} />
          </label>
          <p className="text-xs leading-relaxed text-[var(--muted)]">{t('settings.myelinCallsHint')}</p>
          <button type="button" className="btn-primary" onClick={() => void save()}>
            {t('common.save')}
          </button>
        </section>
      )}

      {tab === 'ai' && (
        <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <p className="text-xs leading-relaxed text-[var(--muted)]">{t('settings.aiHint')}</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
            {t('settings.enableAi')}
          </label>
          <label className="block text-sm">
            {t('settings.provider')}
            <select
              className="input mt-1 w-full"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value === 'openai' ? 'openai' : 'ollama')}
            >
              <option value="ollama">{t('settings.providerOllama')}</option>
              <option value="openai">{t('settings.providerOpenai')}</option>
            </select>
          </label>
          {aiProvider === 'ollama' ? (
            <>
              <label className="block text-sm">
                {t('settings.ollamaBaseUrl')}
                <input
                  className="input mt-1 w-full"
                  value={ollamaBaseUrl}
                  onChange={(e) => setOllamaBaseUrl(e.target.value)}
                  placeholder="http://127.0.0.1:11434"
                />
              </label>
              <div>
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-sm" htmlFor="ollama-model-select">
                    {t('settings.model')}
                  </label>
                  <button
                    type="button"
                    className="btn-ghost py-1 text-xs"
                    disabled={ollamaModelsBusy || !ollamaBaseUrl.trim()}
                    onClick={() => void loadOllamaModels(ollamaBaseUrl, ollamaModel)}
                  >
                    {ollamaModelsBusy ? t('common.loading') : t('settings.refreshModels')}
                  </button>
                </div>
                <select
                  id="ollama-model-select"
                  className="input w-full"
                  value={ollamaModel}
                  disabled={ollamaModelsBusy && ollamaModels.length === 0}
                  onChange={(e) => setOllamaModel(e.target.value)}
                >
                  {ollamaModel && !ollamaModels.includes(ollamaModel) && (
                    <option value={ollamaModel}>
                      {ollamaModel} {t('settings.modelSaved')}
                    </option>
                  )}
                  {ollamaModels.length === 0 && !ollamaModel && (
                    <option value="">{t('settings.noModels')}</option>
                  )}
                  {ollamaModels.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {ollamaModelsError ? (
                  <p className="mt-1 text-xs text-red-300">{ollamaModelsError}</p>
                ) : (
                  <p className="mt-1 text-xs text-[var(--muted)]">{t('settings.ollamaModelsHint')}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <label className="block text-sm">
                {t('settings.openaiApiKey')}
                <input
                  className="input mt-1 w-full"
                  type="password"
                  autoComplete="off"
                  value={openaiApiKey}
                  onChange={(e) => {
                    setOpenaiApiKey(e.target.value);
                    setClearOpenaiApiKey(false);
                  }}
                  placeholder={hasOpenaiApiKey ? t('settings.openaiKeyKeep') : 'sk-…'}
                />
              </label>
              {hasOpenaiApiKey && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={clearOpenaiApiKey}
                    onChange={(e) => setClearOpenaiApiKey(e.target.checked)}
                  />
                  {t('settings.clearApiKey')}
                </label>
              )}
              <div>
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-sm" htmlFor="openai-model-select">
                    {t('settings.openaiModel')}
                  </label>
                  <button
                    type="button"
                    className="btn-ghost py-1 text-xs"
                    disabled={
                      openaiModelsBusy || (!openaiApiKey.trim() && !hasOpenaiApiKey) || clearOpenaiApiKey
                    }
                    onClick={() => void loadOpenaiModels(openaiModel, openaiApiKey)}
                  >
                    {openaiModelsBusy ? t('common.loading') : t('settings.refreshModels')}
                  </button>
                </div>
                <select
                  id="openai-model-select"
                  className="input w-full"
                  value={openaiModel}
                  disabled={openaiModelsBusy && openaiModels.length === 0}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                >
                  {openaiModel && !openaiModels.includes(openaiModel) && (
                    <option value={openaiModel}>
                      {openaiModel} {t('settings.modelSaved')}
                    </option>
                  )}
                  {openaiModels.length === 0 && !openaiModel && (
                    <option value="">{t('settings.noModels')}</option>
                  )}
                  {openaiModels.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {openaiModelsError ? (
                  <p className="mt-1 text-xs text-red-300">{openaiModelsError}</p>
                ) : (
                  <p className="mt-1 text-xs text-[var(--muted)]">{t('settings.openaiModelsHint')}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="btn-ghost py-1 text-xs"
                  disabled={
                    openaiPingBusy ||
                    openaiModelsBusy ||
                    (!openaiApiKey.trim() && !hasOpenaiApiKey) ||
                    clearOpenaiApiKey
                  }
                  onClick={() => {
                    void (async () => {
                      setOpenaiPingBusy(true);
                      setOpenaiPingMsg('');
                      try {
                        const res = await fetch('/api/settings/ai/openai/ping', {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(
                            openaiApiKey.trim() ? { apiKey: openaiApiKey.trim() } : {}
                          ),
                        });
                        const json = await res.json();
                        setOpenaiPingMsg(
                          json.message || (res.ok ? t('status.connectionOk') : t('status.genericFailed'))
                        );
                        if (res.ok) {
                          void loadOpenaiModels(openaiModel, openaiApiKey);
                        }
                      } catch {
                        setOpenaiPingMsg(t('status.networkError'));
                      } finally {
                        setOpenaiPingBusy(false);
                      }
                    })();
                  }}
                >
                  {openaiPingBusy ? t('settings.checking') : t('settings.testApiKey')}
                </button>
                {openaiPingMsg ? (
                  <span className="text-xs text-[var(--muted)]">{openaiPingMsg}</span>
                ) : null}
              </div>
            </>
          )}
          <button type="button" className="btn-primary" onClick={() => void save()}>
            {t('common.save')}
          </button>
        </section>
      )}

      {tab === 'templates' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">{t('settings.pendingShareRequests')}</h2>
              <Link href="/templates" className="text-xs text-[var(--accent-soft)] no-underline hover:underline">
                {t('settings.openTemplatesPage')}
              </Link>
            </div>
            {pendingTemplates.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">{t('settings.noPendingRequests')}</p>
            ) : (
              <ul className="space-y-3">
                {pendingTemplates.map((tmpl) => (
                  <li
                    key={tmpl.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-3 py-3"
                  >
                    <div className="flex flex-wrap items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--text)]">{tmpl.label}</p>
                        <p className="text-[11px] text-[var(--muted)]">
                          {t('settings.byUser', { name: tmpl.ownerUsername || 'user' })}
                          {tmpl.description ? ` · ${tmpl.description}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary py-1 text-xs"
                        disabled={templatesBusy}
                        onClick={() => void approveTemplate(tmpl.id, true)}
                      >
                        {t('settings.approve')}
                      </button>
                      <button
                        type="button"
                        className="btn-ghost py-1 text-xs"
                        disabled={templatesBusy}
                        onClick={() => void approveTemplate(tmpl.id, false)}
                      >
                        {t('settings.reject')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
            <h2 className="text-sm font-semibold">{t('settings.createGlobalTemplate')}</h2>
            <p className="text-xs text-[var(--muted)]">{t('settings.createGlobalHint')}</p>
            <label className="block text-sm">
              {t('settings.label')}
              <input
                className="input mt-1 w-full"
                value={globalLabel}
                onChange={(e) => setGlobalLabel(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              {t('settings.description')}
              <input
                className="input mt-1 w-full"
                value={globalDescription}
                onChange={(e) => setGlobalDescription(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              {t('settings.body')}
              <textarea
                className="input mt-1 min-h-[10rem] w-full font-mono text-sm"
                value={globalBody}
                onChange={(e) => setGlobalBody(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="btn-primary"
              disabled={templatesBusy || !globalLabel.trim()}
              onClick={() => void createGlobalTemplate()}
            >
              {t('settings.createGlobal')}
            </button>
          </div>
        </section>
      )}

      {tab === 'export' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
            <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">{t('settings.uploadedTemplates')}</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">{t('settings.uploadedTemplatesHint')}</p>
              </div>
              <button
                type="button"
                className="btn-ghost py-1.5 text-xs"
                onClick={() => setExportHelpOpen(true)}
              >
                {t('settings.howToCreateTemplates')}
              </button>
            </div>
            {exportTemplates.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">{t('settings.noTemplatesUploaded')}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {exportTemplates.map((tmpl) => (
                  <li
                    key={tmpl.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--text)]">{tmpl.label}</p>
                      <p className="text-[11px] text-[var(--muted)]">
                        {tmpl.originalName} · {(tmpl.sizeBytes / 1024).toFixed(1)} KB
                        {tmpl.description ? ` · ${tmpl.description}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost py-1 text-xs text-red-300"
                      disabled={exportBusy}
                      onClick={() => setExportDeleteId(tmpl.id)}
                    >
                      {t('settings.delete')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
            <h2 className="text-sm font-semibold">{t('settings.uploadDocx')}</h2>
            <label className="block text-sm">
              {t('settings.label')}
              <input
                className="input mt-1 w-full"
                value={exportLabel}
                onChange={(e) => setExportLabel(e.target.value)}
                placeholder={t('status.meetingMinutes')}
              />
            </label>
            <label className="block text-sm">
              {t('settings.description')}
              <input
                className="input mt-1 w-full"
                value={exportDescription}
                onChange={(e) => setExportDescription(e.target.value)}
                placeholder={t('common.optional')}
              />
            </label>
            <label className="block text-sm">
              {t('settings.wordFile')}
              <input
                className="mt-1 block w-full text-sm text-[var(--muted)]"
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  setExportFileName(file.name);
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = String(reader.result || '');
                    const b64 = result.includes(',') ? result.split(',')[1] : result;
                    setExportFileBase64(b64 || null);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              {exportFileName && (
                <span className="mt-1 block text-[11px] text-[var(--muted)]">{exportFileName}</span>
              )}
            </label>
            <button
              type="button"
              className="btn-primary"
              disabled={exportBusy || !exportLabel.trim() || !exportFileBase64}
              onClick={() => void uploadExportTemplate()}
            >
              {exportBusy ? t('settings.uploading') : t('settings.uploadTemplate')}
            </button>
          </div>
        </section>
      )}

      {tab === 'users' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="max-w-xl text-xs text-[var(--muted)]">{t('settings.usersSyncHint')}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-ghost"
                disabled={syncBusy}
                title={t('settings.syncFromMyelin')}
                onClick={() => setSyncConfirmOpen(true)}
              >
                {syncBusy ? t('settings.syncing') : t('settings.syncFromMyelin')}
              </button>
              <button type="button" className="btn-primary" onClick={() => setCreateOpen(true)}>
                {t('settings.createUser')}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--panel)]/80 text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2 font-medium">{t('settings.colUser')}</th>
                  <th className="px-3 py-2 font-medium">{t('settings.colFlags')}</th>
                  <th className="px-3 py-2 font-medium">{t('settings.colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border)]/60">
                    <td className="px-3 py-2">
                      <div className="font-medium">{u.username}</div>
                      <div className="text-xs text-[var(--muted)]">{u.email}</div>
                    </td>
                    <td className="px-3 py-2 text-xs text-[var(--muted)]">
                      {u.isAdmin ? `${t('settings.flagAdmin')} · ` : ''}
                      {u.isActive ? t('settings.flagActive') : t('settings.flagDisabled')}
                      {u.hasPassword ? '' : ` · ${t('settings.flagSsoOnly')}`}
                      {u.pmUserId != null ? ` · Myelin #${u.pmUserId}` : ''}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="btn-ghost text-xs"
                          onClick={() => void toggleAdmin(u)}
                        >
                          {u.isAdmin ? t('settings.revokeAdmin') : t('settings.makeAdmin')}
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs"
                          onClick={() => void toggleActive(u)}
                        >
                          {u.isActive ? t('settings.disable') : t('settings.enable')}
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs"
                          onClick={() => setPasswordUserId(u.id)}
                        >
                          {t('settings.setPassword')}
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs text-red-300"
                          onClick={() => setDeleteUserId(u.id)}
                        >
                          {t('settings.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'vaults' && (
        <section className="space-y-4">
          <p className="max-w-xl text-xs text-[var(--muted)]">{t('settings.vaultsAdminHint')}</p>
          {adminVaults.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-10 text-center text-sm text-[var(--muted)]">
              {t('settings.noVaults')}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--panel)]/80 text-[var(--muted)]">
                  <tr>
                    <th className="px-3 py-2 font-medium">{t('settings.colVault')}</th>
                    <th className="px-3 py-2 font-medium">{t('settings.colOwner')}</th>
                    <th className="px-3 py-2 font-medium">{t('settings.colStats')}</th>
                    <th className="px-3 py-2 font-medium">{t('settings.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {adminVaults.map((v) => (
                    <tr key={v.id} className="border-b border-[var(--border)]/60">
                      <td className="px-3 py-2">
                        <div className="font-medium text-[var(--text)]">{v.name}</div>
                        <div className="font-mono text-xs text-[var(--muted)]">/{v.slug}</div>
                        <div className="mt-0.5 text-[11px] text-[var(--muted)]">
                          {v.defaultVisibility}
                          {v.allowPublicPages ? ` · ${t('settings.publicWikiOn')}` : ''}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {v.owner ? (
                          <>
                            <div className="font-medium">{v.owner.username}</div>
                            <div className="text-xs text-[var(--muted)]">{v.owner.email}</div>
                          </>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">{t('settings.unknown')}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-[var(--muted)]">
                        {t('settings.notesCount', { n: v.noteCount })}
                        <br />
                        {t('settings.sharesCount', { n: v.memberCount })}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          <Link
                            href={`/vaults/${v.id}`}
                            className="btn-ghost text-xs no-underline hover:no-underline"
                          >
                            {t('settings.open')}
                          </Link>
                          <button
                            type="button"
                            className="btn-ghost text-xs"
                            onClick={() => setShareVault(v)}
                          >
                            {t('settings.share')}
                          </button>
                          <button
                            type="button"
                            className="btn-ghost text-xs"
                            onClick={() => {
                              setOwnerVault(v);
                              setOwnerUserId(v.owner?.userId ?? '');
                            }}
                          >
                            {t('settings.changeOwner')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-xl">
            <h2 className="text-lg font-semibold">{t('settings.createUser')}</h2>
            <div className="mt-4 space-y-3">
              <input
                className="input w-full"
                placeholder={t('settings.username')}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                className="input w-full"
                type="email"
                placeholder={t('home.email')}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                className="input w-full"
                type="password"
                placeholder={t('settings.password')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newIsAdmin} onChange={(e) => setNewIsAdmin(e.target.checked)} />
                {t('settings.admin')}
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setCreateOpen(false)}>
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={async () => {
                  setError('');
                  const res = await fetch('/api/users', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      username: newUsername,
                      email: newEmail,
                      password: newPassword,
                      isAdmin: newIsAdmin,
                    }),
                  });
                  const json = await res.json();
                  if (!res.ok) {
                    setError(json.message || t('status.createFailed'));
                    return;
                  }
                  setCreateOpen(false);
                  setNewUsername('');
                  setNewEmail('');
                  setNewPassword('');
                  setNewIsAdmin(false);
                  setStatus(t('settings.userCreated'));
                  await loadUsers();
                }}
              >
                {t('common.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      <PromptModal
        open={passwordUserId != null}
        title={t('settings.setPassword')}
        label={t('settings.newPassword')}
        confirmLabel={t('common.save')}
        inputType="password"
        onCancel={() => setPasswordUserId(null)}
        onConfirm={async (value) => {
          if (passwordUserId == null) return;
          const res = await fetch(`/api/users/${passwordUserId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: value }),
          });
          const json = await res.json();
          if (!res.ok) {
            setError(json.message || t('status.genericFailed'));
            return;
          }
          setStatus(t('settings.passwordUpdated'));
          setPasswordUserId(null);
          await loadUsers();
        }}
      />

      <ConfirmModal
        open={deleteUserId != null}
        title={t('settings.deleteUserTitle')}
        message={t('settings.deleteUserMessage')}
        confirmLabel={t('settings.delete')}
        danger
        onCancel={() => setDeleteUserId(null)}
        onConfirm={async () => {
          if (deleteUserId == null) return;
          const res = await fetch(`/api/users/${deleteUserId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          const json = await res.json();
          if (!res.ok) {
            setError(json.message || t('chrome.deleteFailed'));
            setDeleteUserId(null);
            return;
          }
          setStatus(t('settings.userDeleted'));
          setDeleteUserId(null);
          await loadUsers();
        }}
      />

      <ConfirmModal
        open={syncConfirmOpen}
        title={t('settings.syncUsersTitle')}
        message={t('settings.syncUsersMessage')}
        confirmLabel={syncBusy ? t('settings.syncing') : t('settings.syncNow')}
        cancelLabel={t('common.cancel')}
        onCancel={() => {
          if (!syncBusy) setSyncConfirmOpen(false);
        }}
        onConfirm={async () => {
          if (syncBusy) return;
          setSyncBusy(true);
          setError('');
          setStatus('');
          try {
            const res = await fetch('/api/users/sync-from-pm', {
              method: 'POST',
              credentials: 'include',
            });
            const json = await res.json();
            if (!res.ok) {
              setError(json.message || t('status.syncFailed'));
              return;
            }
            const d = json.data as {
              created?: number;
              updated?: number;
              linked?: number;
              skipped?: number;
              failed?: number;
            };
            setStatus(
              json.message ||
                t('status.syncUsersSummary', {
                  created: d.created ?? 0,
                  updated: d.updated ?? 0,
                  linked: d.linked ?? 0,
                  skipped: d.skipped ?? 0,
                  failed: d.failed ?? 0,
                })
            );
            setSyncConfirmOpen(false);
            await loadUsers();
          } finally {
            setSyncBusy(false);
          }
        }}
      />

      <ConfirmModal
        open={exportDeleteId != null}
        title={t('settings.deleteWordTitle')}
        message={t('settings.deleteWordMessage')}
        confirmLabel={exportBusy ? t('settings.deleting') : t('settings.delete')}
        cancelLabel={t('common.cancel')}
        danger
        onCancel={() => {
          if (!exportBusy) setExportDeleteId(null);
        }}
        onConfirm={() => void deleteExportTemplate()}
      />

      <WordExportHelpModal open={exportHelpOpen} onClose={() => setExportHelpOpen(false)} />

      <VaultShareModal
        open={shareVault != null}
        vaultId={shareVault ? String(shareVault.id) : ''}
        vaultName={shareVault?.name || ''}
        isOwner
        canManage
        membersBasePath={shareVault ? `/api/settings/vaults/${shareVault.id}` : undefined}
        onClose={() => {
          setShareVault(null);
          void loadAdminVaults();
        }}
      />

      {ownerVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl"
          >
            <h2 className="text-lg font-semibold tracking-tight">{t('settings.changeVaultOwner')}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {t('settings.changeOwnerHint', { name: ownerVault.name })}
            </p>
            <label className="mt-4 block text-sm">
              {t('settings.newOwner')}
              <select
                className="input mt-1 w-full"
                value={ownerUserId === '' ? '' : String(ownerUserId)}
                onChange={(e) =>
                  setOwnerUserId(e.target.value ? Number(e.target.value) : '')
                }
              >
                <option value="">{t('settings.selectUser')}</option>
                {users
                  .filter((u) => u.isActive)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.email})
                      {ownerVault.owner?.userId === u.id ? ` ${t('settings.currentOwner')}` : ''}
                    </option>
                  ))}
              </select>
            </label>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="btn-ghost"
                disabled={ownerBusy}
                onClick={() => {
                  setOwnerVault(null);
                  setOwnerUserId('');
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={
                  ownerBusy ||
                  ownerUserId === '' ||
                  ownerUserId === ownerVault.owner?.userId
                }
                onClick={() => void transferOwner()}
              >
                {ownerBusy ? t('settings.transferring') : t('settings.transferOwnership')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
