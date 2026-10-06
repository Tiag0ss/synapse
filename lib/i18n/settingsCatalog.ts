export type SettingsMessages = {
  administration: string;
  title: string;
  backVaults: string;
  loading: string;
  forbidden: string;
  tabGeneral: string;
  tabAuth: string;
  tabEmail: string;
  tabPm: string;
  tabAi: string;
  tabTemplates: string;
  tabExport: string;
  tabUsers: string;
  tabVaults: string;
  siteName: string;
  showWikiDir: string;
  allowRegistration: string;
  allowRegistrationHint: string;
  allowSso: string;
  minPasswordLength: string;
  smtpHint: string;
  smtpConfigured: string;
  smtpIncomplete: string;
  host: string;
  port: string;
  useTls: string;
  username: string;
  password: string;
  passwordSaved: string;
  clearSmtpPassword: string;
  fromEmail: string;
  fromName: string;
  sendTestEmail: string;
  enableMyelin: string;
  pmBaseUrl: string;
  myelinCallsHint: string;
  aiHint: string;
  enableAi: string;
  provider: string;
  providerOllama: string;
  providerOpenai: string;
  ollamaBaseUrl: string;
  model: string;
  refreshModels: string;
  noModels: string;
  modelSaved: string;
  ollamaModelsHint: string;
  openaiModelsHint: string;
  openaiApiKey: string;
  openaiKeyKeep: string;
  clearApiKey: string;
  openaiModel: string;
  testApiKey: string;
  checking: string;
  pendingShareRequests: string;
  openTemplatesPage: string;
  noPendingRequests: string;
  byUser: string;
  approve: string;
  reject: string;
  createGlobalTemplate: string;
  createGlobalHint: string;
  label: string;
  description: string;
  body: string;
  createGlobal: string;
  uploadedTemplates: string;
  uploadedTemplatesHint: string;
  howToCreateTemplates: string;
  wordHelpTitle: string;
  wordHelpSubtitle: string;
  wordHelpStep1: string;
  wordHelpStep2: string;
  wordHelpStep3: string;
  wordHelpGridsTitle: string;
  wordHelpGridsBody: string;
  wordHelpGridsHint: string;
  wordHelpNestedTitle: string;
  wordHelpNestedBody: string;
  wordHelpBodyTitle: string;
  wordHelpBodyP1: string;
  wordHelpBodyP2: string;
  wordHelpTocTitle: string;
  wordHelpTocBody: string;
  wordHelpMarkersTitle: string;
  wordHelpMarkerCol: string;
  wordHelpValueCol: string;
  wordHelpFmExample: string;
  wordHelpGotIt: string;
  wordFieldTitle: string;
  wordFieldPath: string;
  wordFieldBody: string;
  wordFieldVaultName: string;
  wordFieldExportedAt: string;
  wordFieldAuthor: string;
  wordFieldAuthorEmail: string;
  wordFieldFmKey: string;
  wordFieldRootKey: string;
  wordFieldListCell: string;
  noTemplatesUploaded: string;
  delete: string;
  uploadDocx: string;
  optional: string;
  wordFile: string;
  uploading: string;
  uploadTemplate: string;
  usersSyncHint: string;
  syncFromMyelin: string;
  syncing: string;
  createUser: string;
  colUser: string;
  colFlags: string;
  colActions: string;
  flagAdmin: string;
  flagActive: string;
  flagDisabled: string;
  flagSsoOnly: string;
  revokeAdmin: string;
  makeAdmin: string;
  disable: string;
  enable: string;
  setPassword: string;
  vaultsAdminHint: string;
  noVaults: string;
  colVault: string;
  colOwner: string;
  colStats: string;
  publicWikiOn: string;
  unknown: string;
  notesCount: string;
  sharesCount: string;
  open: string;
  share: string;
  changeOwner: string;
  admin: string;
  newPassword: string;
  deleteUserTitle: string;
  deleteUserMessage: string;
  syncUsersTitle: string;
  syncUsersMessage: string;
  syncNow: string;
  deleteWordTitle: string;
  deleteWordMessage: string;
  deleting: string;
  changeVaultOwner: string;
  changeOwnerHint: string;
  newOwner: string;
  selectUser: string;
  currentOwner: string;
  transferring: string;
  transferOwnership: string;
  saved: string;
  userCreated: string;
  passwordUpdated: string;
  userDeleted: string;
  templatePublished: string;
  shareRejected: string;
  globalTemplateCreated: string;
  wordTemplateUploaded: string;
  templateDeleted: string;
  ownershipTransferred: string;
};

export const settingsEn: SettingsMessages = {
  administration: 'Administration',
  title: 'Settings',
  backVaults: '← Vaults',
  loading: 'Loading settings…',
  forbidden: 'Admin access required.',
  tabGeneral: 'General',
  tabAuth: 'Authentication',
  tabEmail: 'Email',
  tabPm: 'Myelin',
  tabAi: 'AI',
  tabTemplates: 'Templates',
  tabExport: 'Word export',
  tabUsers: 'Users',
  tabVaults: 'Vaults',
  siteName: 'Site name',
  showWikiDir: 'Show public wiki directory (/w)',
  allowRegistration: 'Allow public registration',
  allowRegistrationHint:
    'When disabled, only admins can create users (first user on a fresh install can always register).',
  allowSso: 'Allow Sign in with Myelin',
  minPasswordLength: 'Minimum password length',
  smtpHint: 'SMTP is required for password reset emails.',
  smtpConfigured: 'Status: configured.',
  smtpIncomplete: 'Status: incomplete.',
  host: 'Host',
  port: 'Port',
  useTls: 'Use TLS/SSL',
  username: 'Username',
  password: 'Password',
  passwordSaved: '(saved)',
  clearSmtpPassword: 'Clear stored SMTP password',
  fromEmail: 'From email',
  fromName: 'From name',
  sendTestEmail: 'Send test email',
  enableMyelin: 'Enable Myelin integration',
  pmBaseUrl: 'Myelin base URL (from environment)',
  myelinCallsHint:
    'Myelin calls use each user’s SSO token, or their personal pt_… token from Profile. There is no instance-wide API key.',
  aiHint:
    'Synapse calls an AI provider to suggest YAML todos: from a note. Choose local Ollama or OpenAI. Suggestions never auto-save — the editor always reviews them first.',
  enableAi: 'Enable AI todo suggestions',
  provider: 'Provider',
  providerOllama: 'Ollama (self-hosted)',
  providerOpenai: 'OpenAI',
  ollamaBaseUrl: 'Ollama base URL',
  model: 'Model',
  refreshModels: 'Refresh models',
  noModels: 'No models found',
  modelSaved: '(saved)',
  ollamaModelsHint: 'Loaded from Ollama /api/tags. Pull models on the host, then refresh.',
  openaiModelsHint: 'Loaded from OpenAI /v1/models (chat models). Refresh after changing the API key.',
  openaiApiKey: 'OpenAI API key',
  openaiKeyKeep: '•••••••• (leave blank to keep)',
  clearApiKey: 'Clear stored API key',
  openaiModel: 'OpenAI model',
  testApiKey: 'Test API key',
  checking: 'Checking…',
  pendingShareRequests: 'Pending share requests',
  openTemplatesPage: 'Open templates page',
  noPendingRequests: 'No pending requests.',
  byUser: 'by {name}',
  approve: 'Approve',
  reject: 'Reject',
  createGlobalTemplate: 'Create global template',
  createGlobalHint: 'Available to all users when creating notes. Use {{title}} in the body for the note title.',
  label: 'Label',
  description: 'Description',
  body: 'Body',
  createGlobal: 'Create global',
  uploadedTemplates: 'Uploaded templates',
  uploadedTemplatesHint: 'App-level .docx templates for note export (Carbone markers).',
  howToCreateTemplates: 'How to create templates',
  wordHelpTitle: 'How to create a Word template',
  wordHelpSubtitle: 'Generic Carbone .docx guide — markers are filled from the note and its frontmatter',
  wordHelpStep1: 'Design the layout in Word (styles, headers, tables). Save as .docx.',
  wordHelpStep2: 'Insert Carbone markers such as {marker} as a single unbroken run (do not bold only part of the marker).',
  wordHelpStep3: 'Upload the file here. Users export a note with Export DOCX in a vault.',
  wordHelpGridsTitle: 'Grids (repeating rows)',
  wordHelpGridsBody: 'Put field markers on one sample data row using [i]. Synapse adds the Carbone end marker and repeats that row for each item in the matching frontmatter array. You do not need to create many empty rows in advance.',
  wordHelpGridsHint: 'The array name (items above) must match a YAML list key in the note frontmatter. Style the sample row in Word; clones keep that formatting.',
  wordHelpNestedTitle: 'Nested / indented rows',
  wordHelpNestedBody: 'Add indent: 1 (or level) on nested list items. Synapse prefixes label-like fields (Task, name, title, …) with em-spaces, so a normal cell already shows nesting. You can also use indentPrefix explicitly.',
  wordHelpBodyTitle: 'Body and headings',
  wordHelpBodyP1: 'Place {d.body} alone in its own paragraph. Synapse replaces it with the note Markdown: Heading 1–4 styles, GFM tables, fenced code (monospace), callouts, footnote text, math (KaTeX → readable text), vault images, and Mermaid as PNG when render succeeds.',
  wordHelpBodyP2: 'Fixed section titles that always appear in the document should be typed in Word and given Heading 1 / Heading 2 styles there — Carbone only fills markers; it does not invent a TOC by itself.',
  wordHelpTocTitle: 'Table of contents',
  wordHelpTocBody: 'Insert a native Word table of contents in the template (References → Table of Contents). After export, open the file in Word and update the field (right-click → Update field) so it picks up Heading styles from the filled body and fixed titles.',
  wordHelpMarkersTitle: 'Built-in markers',
  wordHelpMarkerCol: 'Marker',
  wordHelpValueCol: 'Value',
  wordHelpFmExample: 'Frontmatter example (generic): define any keys your template markers expect — scalars under {d.fm.*}, lists for table loops.',
  wordHelpGotIt: 'Got it',
  wordFieldTitle: 'Note title',
  wordFieldPath: 'Note path',
  wordFieldBody: 'Note Markdown body (see Body section below)',
  wordFieldVaultName: 'Vault name',
  wordFieldExportedAt: 'Export timestamp (ISO)',
  wordFieldAuthor: 'Exporter username',
  wordFieldAuthorEmail: 'Exporter email',
  wordFieldFmKey: 'Any frontmatter scalar, e.g. {d.fm.status}',
  wordFieldRootKey: 'Frontmatter scalar flattened on the root when it does not collide',
  wordFieldListCell: 'One cell in a repeating table row (see Grids)',
  noTemplatesUploaded: 'No templates uploaded.',
  delete: 'Delete',
  uploadDocx: 'Upload .docx template',
  optional: 'Optional',
  wordFile: 'Word file (.docx)',
  uploading: 'Uploading…',
  uploadTemplate: 'Upload template',
  usersSyncHint:
    'Sync pulls accounts from Myelin (admin API). New users are SSO-ready with no local password; existing Synapse users are linked by Myelin id or email.',
  syncFromMyelin: 'Sync from Myelin',
  syncing: 'Syncing…',
  createUser: 'Create user',
  colUser: 'User',
  colFlags: 'Flags',
  colActions: 'Actions',
  flagAdmin: 'admin',
  flagActive: 'active',
  flagDisabled: 'disabled',
  flagSsoOnly: 'SSO-only',
  revokeAdmin: 'Revoke admin',
  makeAdmin: 'Make admin',
  disable: 'Disable',
  enable: 'Enable',
  setPassword: 'Set password',
  vaultsAdminHint:
    'All vaults on this Synapse instance. Admins can transfer ownership or manage share memberships without being the vault owner. Transfer keeps the previous owner as Edit access.',
  noVaults: 'No vaults yet.',
  colVault: 'Vault',
  colOwner: 'Owner',
  colStats: 'Stats',
  publicWikiOn: 'public wiki on',
  unknown: 'Unknown',
  notesCount: '{n} notes',
  sharesCount: '{n} shares',
  open: 'Open',
  share: 'Share',
  changeOwner: 'Change owner',
  admin: 'Admin',
  newPassword: 'New password',
  deleteUserTitle: 'Delete user?',
  deleteUserMessage: 'This cannot be undone. The user must not own any vaults.',
  syncUsersTitle: 'Sync users from Myelin',
  syncUsersMessage:
    'Import Myelin users into Synapse. Matched by Myelin user id or email. New accounts are SSO-ready (no local password). Existing Synapse-only users are not deleted. Requires your admin SSO session or personal API token in Profile.',
  syncNow: 'Sync now',
  deleteWordTitle: 'Delete Word template',
  deleteWordMessage: 'This removes the uploaded .docx from the app. Existing notes are not affected.',
  deleting: 'Deleting…',
  changeVaultOwner: 'Change vault owner',
  changeOwnerHint: '{name} — previous owner keeps Edit access.',
  newOwner: 'New owner',
  selectUser: 'Select user…',
  currentOwner: '— current',
  transferring: 'Transferring…',
  transferOwnership: 'Transfer ownership',
  saved: 'Settings saved',
  userCreated: 'User created',
  passwordUpdated: 'Password updated',
  userDeleted: 'User deleted',
  templatePublished: 'Template published',
  shareRejected: 'Share request rejected',
  globalTemplateCreated: 'Global template created',
  wordTemplateUploaded: 'Word export template uploaded',
  templateDeleted: 'Template deleted',
  ownershipTransferred: 'Ownership of “{name}” transferred',
};

export const settingsPt: SettingsMessages = {
  administration: 'Administração',
  title: 'Definições',
  backVaults: '← Cofres',
  loading: 'A carregar as definições…',
  forbidden: 'É necessário acesso de administrador.',
  tabGeneral: 'Geral',
  tabAuth: 'Autenticação',
  tabEmail: 'E-mail',
  tabPm: 'Myelin',
  tabAi: 'IA',
  tabTemplates: 'Modelos',
  tabExport: 'Exportação Word',
  tabUsers: 'Utilizadores',
  tabVaults: 'Cofres',
  siteName: 'Nome do sítio',
  showWikiDir: 'Mostrar directório de wikis públicas (/w)',
  allowRegistration: 'Permitir registo público',
  allowRegistrationHint:
    'Quando desactivado, só os administradores podem criar utilizadores (o primeiro utilizador numa instalação nova pode sempre registar-se).',
  allowSso: 'Permitir iniciar sessão com Myelin',
  minPasswordLength: 'Comprimento mínimo da palavra-passe',
  smtpHint: 'O SMTP é necessário para e-mails de reposição da palavra-passe.',
  smtpConfigured: 'Estado: configurado.',
  smtpIncomplete: 'Estado: incompleto.',
  host: 'Anfitrião',
  port: 'Porta',
  useTls: 'Usar TLS/SSL',
  username: 'Nome de utilizador',
  password: 'Palavra-passe',
  passwordSaved: '(guardada)',
  clearSmtpPassword: 'Limpar palavra-passe SMTP guardada',
  fromEmail: 'E-mail de remetente',
  fromName: 'Nome de remetente',
  sendTestEmail: 'Enviar e-mail de teste',
  enableMyelin: 'Activar integração Myelin',
  pmBaseUrl: 'URL base do Myelin (do ambiente)',
  myelinCallsHint:
    'As chamadas ao Myelin usam o token SSO de cada utilizador, ou o token pessoal pt_… no Perfil. Não há chave de API global.',
  aiHint:
    'O Synapse chama um fornecedor de IA para sugerir YAML todos: a partir de uma nota. Escolha Ollama local ou OpenAI. As sugestões nunca são guardadas automaticamente — o editor revê-as sempre primeiro.',
  enableAi: 'Activar sugestões de tarefas por IA',
  provider: 'Fornecedor',
  providerOllama: 'Ollama (auto-hospedado)',
  providerOpenai: 'OpenAI',
  ollamaBaseUrl: 'URL base do Ollama',
  model: 'Modelo',
  refreshModels: 'Actualizar modelos',
  noModels: 'Nenhum modelo encontrado',
  modelSaved: '(guardado)',
  ollamaModelsHint: 'Carregado de Ollama /api/tags. Faça pull dos modelos no anfitrião e actualize.',
  openaiModelsHint:
    'Carregado de OpenAI /v1/models (modelos de chat). Actualize após alterar a chave API.',
  openaiApiKey: 'Chave API OpenAI',
  openaiKeyKeep: '•••••••• (deixe em branco para manter)',
  clearApiKey: 'Limpar chave API guardada',
  openaiModel: 'Modelo OpenAI',
  testApiKey: 'Testar chave API',
  checking: 'A verificar…',
  pendingShareRequests: 'Pedidos de partilha pendentes',
  openTemplatesPage: 'Abrir página de modelos',
  noPendingRequests: 'Sem pedidos pendentes.',
  byUser: 'por {name}',
  approve: 'Aprovar',
  reject: 'Rejeitar',
  createGlobalTemplate: 'Criar modelo global',
  createGlobalHint:
    'Disponível para todos os utilizadores ao criar notas. Use {{title}} no corpo para o título da nota.',
  label: 'Etiqueta',
  description: 'Descrição',
  body: 'Corpo',
  createGlobal: 'Criar global',
  uploadedTemplates: 'Modelos enviados',
  uploadedTemplatesHint: 'Modelos .docx ao nível da aplicação para exportação de notas (marcadores Carbone).',
  howToCreateTemplates: 'Como criar modelos',
  wordHelpTitle: 'Como criar um modelo Word',
  wordHelpSubtitle: 'Guia genérico Carbone .docx — os marcadores são preenchidos a partir da nota e do frontmatter',
  wordHelpStep1: 'Desenhe o layout no Word (estilos, cabeçalhos, tabelas). Guarde como .docx.',
  wordHelpStep2: 'Insira marcadores Carbone como {marker} como um único run contínuo (não ponha negrito só numa parte do marcador).',
  wordHelpStep3: 'Envie o ficheiro aqui. Os utilizadores exportam uma nota com Exportar DOCX num cofre.',
  wordHelpGridsTitle: 'Grelhas (linhas repetidas)',
  wordHelpGridsBody: 'Coloque marcadores de campo numa linha de dados de exemplo usando [i]. O Synapse adiciona o marcador de fim Carbone e repete essa linha para cada item na lista do frontmatter correspondente. Não precisa de criar muitas linhas vazias antecipadamente.',
  wordHelpGridsHint: 'O nome da lista (items acima) deve corresponder a uma chave de lista YAML no frontmatter da nota. Estilize a linha de exemplo no Word; os clones mantêm essa formatação.',
  wordHelpNestedTitle: 'Linhas aninhadas / indentadas',
  wordHelpNestedBody: 'Adicione indent: 1 (ou level) nos itens de lista aninhados. O Synapse prefixa campos semelhantes a etiquetas (Task, name, title, …) com espaços em, pelo que uma célula normal já mostra o aninhamento. Também pode usar indentPrefix explicitamente.',
  wordHelpBodyTitle: 'Corpo e títulos',
  wordHelpBodyP1: 'Coloque {d.body} sozinho no seu próprio parágrafo. O Synapse substitui-o pelo Markdown da nota: estilos Heading 1–4, tabelas GFM, código em bloco (monoespaçado), callouts, notas de rodapé, matemática (KaTeX → texto legível), imagens do cofre e Mermaid como PNG quando a renderização tem sucesso.',
  wordHelpBodyP2: 'Títulos de secção fixos que aparecem sempre no documento devem ser escritos no Word com estilos Heading 1 / Heading 2 — o Carbone só preenche marcadores; não inventa um índice por si.',
  wordHelpTocTitle: 'Índice',
  wordHelpTocBody: 'Insira um índice nativo do Word no modelo (Referências → Índice). Após exportar, abra o ficheiro no Word e actualize o campo (clique com o botão direito → Actualizar campo) para recolher os estilos Heading do corpo preenchido e dos títulos fixos.',
  wordHelpMarkersTitle: 'Marcadores incorporados',
  wordHelpMarkerCol: 'Marcador',
  wordHelpValueCol: 'Valor',
  wordHelpFmExample: 'Exemplo de frontmatter (genérico): defina quaisquer chaves que os marcadores do modelo esperem — escalares sob {d.fm.*}, listas para ciclos de tabelas.',
  wordHelpGotIt: 'Compreendi',
  wordFieldTitle: 'Título da nota',
  wordFieldPath: 'Caminho da nota',
  wordFieldBody: 'Corpo Markdown da nota (ver secção Corpo abaixo)',
  wordFieldVaultName: 'Nome do cofre',
  wordFieldExportedAt: 'Carimbo de exportação (ISO)',
  wordFieldAuthor: 'Nome de utilizador do exportador',
  wordFieldAuthorEmail: 'E-mail do exportador',
  wordFieldFmKey: 'Qualquer escalar do frontmatter, p.ex. {d.fm.status}',
  wordFieldRootKey: 'Escalar do frontmatter no raiz quando não colide',
  wordFieldListCell: 'Uma célula numa linha de tabela repetida (ver Grelhas)',
  noTemplatesUploaded: 'Nenhum modelo enviado.',
  delete: 'Eliminar',
  uploadDocx: 'Enviar modelo .docx',
  optional: 'Opcional',
  wordFile: 'Ficheiro Word (.docx)',
  uploading: 'A enviar…',
  uploadTemplate: 'Enviar modelo',
  usersSyncHint:
    'A sincronização obtém contas do Myelin (API de administração). Novos utilizadores ficam prontos para SSO sem palavra-passe local; utilizadores Synapse existentes são ligados por id Myelin ou e-mail.',
  syncFromMyelin: 'Sincronizar do Myelin',
  syncing: 'A sincronizar…',
  createUser: 'Criar utilizador',
  colUser: 'Utilizador',
  colFlags: 'Sinalizadores',
  colActions: 'Acções',
  flagAdmin: 'admin',
  flagActive: 'activo',
  flagDisabled: 'desactivado',
  flagSsoOnly: 'só SSO',
  revokeAdmin: 'Revogar admin',
  makeAdmin: 'Tornar admin',
  disable: 'Desactivar',
  enable: 'Activar',
  setPassword: 'Definir palavra-passe',
  vaultsAdminHint:
    'Todos os cofres nesta instância Synapse. Os administradores podem transferir a propriedade ou gerir partilhas sem serem proprietários. A transferência mantém o proprietário anterior com acesso de Edição.',
  noVaults: 'Ainda sem cofres.',
  colVault: 'Cofre',
  colOwner: 'Proprietário',
  colStats: 'Estatísticas',
  publicWikiOn: 'wiki pública activa',
  unknown: 'Desconhecido',
  notesCount: '{n} notas',
  sharesCount: '{n} partilhas',
  open: 'Abrir',
  share: 'Partilhar',
  changeOwner: 'Alterar proprietário',
  admin: 'Administrador',
  newPassword: 'Nova palavra-passe',
  deleteUserTitle: 'Eliminar utilizador?',
  deleteUserMessage: 'Isto não pode ser anulado. O utilizador não pode ser proprietário de cofres.',
  syncUsersTitle: 'Sincronizar utilizadores do Myelin',
  syncUsersMessage:
    'Importar utilizadores Myelin para o Synapse. Correspondência por id Myelin ou e-mail. Novas contas ficam prontas para SSO (sem palavra-passe local). Utilizadores só Synapse não são eliminados. Requer sessão SSO de administrador ou token API pessoal no Perfil.',
  syncNow: 'Sincronizar agora',
  deleteWordTitle: 'Eliminar modelo Word',
  deleteWordMessage: 'Isto retira o .docx enviado da aplicação. As notas existentes não são afectadas.',
  deleting: 'A eliminar…',
  changeVaultOwner: 'Alterar proprietário do cofre',
  changeOwnerHint: '{name} — o proprietário anterior mantém acesso de Edição.',
  newOwner: 'Novo proprietário',
  selectUser: 'Seleccionar utilizador…',
  currentOwner: '— actual',
  transferring: 'A transferir…',
  transferOwnership: 'Transferir propriedade',
  saved: 'Definições guardadas',
  userCreated: 'Utilizador criado',
  passwordUpdated: 'Palavra-passe actualizada',
  userDeleted: 'Utilizador eliminado',
  templatePublished: 'Modelo publicado',
  shareRejected: 'Pedido de partilha rejeitado',
  globalTemplateCreated: 'Modelo global criado',
  wordTemplateUploaded: 'Modelo de exportação Word enviado',
  templateDeleted: 'Modelo eliminado',
  ownershipTransferred: 'Propriedade de “{name}” transferida',
};

export const settingsEs: SettingsMessages = {
  administration: 'Administración',
  title: 'Ajustes',
  backVaults: '← Bóvedas',
  loading: 'Cargando ajustes…',
  forbidden: 'Se requiere acceso de administrador.',
  tabGeneral: 'General',
  tabAuth: 'Autenticación',
  tabEmail: 'Correo',
  tabPm: 'Myelin',
  tabAi: 'IA',
  tabTemplates: 'Plantillas',
  tabExport: 'Exportación Word',
  tabUsers: 'Usuarios',
  tabVaults: 'Bóvedas',
  siteName: 'Nombre del sitio',
  showWikiDir: 'Mostrar directorio de wikis públicas (/w)',
  allowRegistration: 'Permitir registro público',
  allowRegistrationHint:
    'Si está desactivado, solo los administradores pueden crear usuarios (el primer usuario en una instalación nueva siempre puede registrarse).',
  allowSso: 'Permitir iniciar sesión con Myelin',
  minPasswordLength: 'Longitud mínima de la contraseña',
  smtpHint: 'SMTP es necesario para correos de restablecimiento de contraseña.',
  smtpConfigured: 'Estado: configurado.',
  smtpIncomplete: 'Estado: incompleto.',
  host: 'Host',
  port: 'Puerto',
  useTls: 'Usar TLS/SSL',
  username: 'Usuario',
  password: 'Contraseña',
  passwordSaved: '(guardada)',
  clearSmtpPassword: 'Borrar contraseña SMTP guardada',
  fromEmail: 'Correo remitente',
  fromName: 'Nombre remitente',
  sendTestEmail: 'Enviar correo de prueba',
  enableMyelin: 'Activar integración Myelin',
  pmBaseUrl: 'URL base de Myelin (del entorno)',
  myelinCallsHint:
    'Las llamadas a Myelin usan el token SSO de cada usuario, o su token personal pt_… en Perfil. No hay clave API global.',
  aiHint:
    'Synapse llama a un proveedor de IA para sugerir YAML todos: desde una nota. Elige Ollama local u OpenAI. Las sugerencias nunca se guardan automáticamente: el editor siempre las revisa primero.',
  enableAi: 'Activar sugerencias de tareas con IA',
  provider: 'Proveedor',
  providerOllama: 'Ollama (autoalojado)',
  providerOpenai: 'OpenAI',
  ollamaBaseUrl: 'URL base de Ollama',
  model: 'Modelo',
  refreshModels: 'Actualizar modelos',
  noModels: 'No se encontraron modelos',
  modelSaved: '(guardado)',
  ollamaModelsHint: 'Cargado desde Ollama /api/tags. Descarga modelos en el host y actualiza.',
  openaiModelsHint:
    'Cargado desde OpenAI /v1/models (modelos de chat). Actualiza tras cambiar la clave API.',
  openaiApiKey: 'Clave API de OpenAI',
  openaiKeyKeep: '•••••••• (déjalo en blanco para mantener)',
  clearApiKey: 'Borrar clave API guardada',
  openaiModel: 'Modelo OpenAI',
  testApiKey: 'Probar clave API',
  checking: 'Comprobando…',
  pendingShareRequests: 'Solicitudes de compartición pendientes',
  openTemplatesPage: 'Abrir página de plantillas',
  noPendingRequests: 'No hay solicitudes pendientes.',
  byUser: 'por {name}',
  approve: 'Aprobar',
  reject: 'Rechazar',
  createGlobalTemplate: 'Crear plantilla global',
  createGlobalHint:
    'Disponible para todos al crear notas. Usa {{title}} en el cuerpo para el título de la nota.',
  label: 'Etiqueta',
  description: 'Descripción',
  body: 'Cuerpo',
  createGlobal: 'Crear global',
  uploadedTemplates: 'Plantillas subidas',
  uploadedTemplatesHint: 'Plantillas .docx a nivel de aplicación para exportar notas (marcadores Carbone).',
  howToCreateTemplates: 'Cómo crear plantillas',
  wordHelpTitle: 'Cómo crear una plantilla Word',
  wordHelpSubtitle: 'Guía genérica Carbone .docx — los marcadores se rellenan desde la nota y su frontmatter',
  wordHelpStep1: 'Diseñe el diseño en Word (estilos, encabezados, tablas). Guarde como .docx.',
  wordHelpStep2: 'Inserte marcadores Carbone como {marker} como un único run continuo (no ponga negrita solo en parte del marcador).',
  wordHelpStep3: 'Suba el fichero aquí. Los usuarios exportan una nota con Exportar DOCX en una bóveda.',
  wordHelpGridsTitle: 'Cuadrículas (filas repetidas)',
  wordHelpGridsBody: 'Ponga marcadores de campo en una fila de datos de ejemplo usando [i]. Synapse añade el marcador de fin Carbone y repite esa fila por cada elemento de la lista del frontmatter correspondiente. No necesita crear muchas filas vacías de antemano.',
  wordHelpGridsHint: 'El nombre de la lista (items arriba) debe coincidir con una clave de lista YAML en el frontmatter de la nota. Estilice la fila de ejemplo en Word; los clones conservan ese formato.',
  wordHelpNestedTitle: 'Filas anidadas / sangradas',
  wordHelpNestedBody: 'Añada indent: 1 (o level) en los elementos de lista anidados. Synapse antepone espacios em a campos tipo etiqueta (Task, name, title, …), de modo que una celda normal ya muestra el anidamiento. También puede usar indentPrefix explícitamente.',
  wordHelpBodyTitle: 'Cuerpo y títulos',
  wordHelpBodyP1: 'Coloque {d.body} solo en su propio párrafo. Synapse lo sustituye por el Markdown de la nota: estilos Heading 1–4, tablas GFM, código cercado (monoespaciado), callouts, notas al pie, matemáticas (KaTeX → texto legible), imágenes de la bóveda y Mermaid como PNG cuando el renderizado tiene éxito.',
  wordHelpBodyP2: 'Los títulos de sección fijos que siempre aparecen en el documento deben escribirse en Word con estilos Heading 1 / Heading 2 — Carbone solo rellena marcadores; no inventa un TOC por sí solo.',
  wordHelpTocTitle: 'Tabla de contenidos',
  wordHelpTocBody: 'Inserte una tabla de contenidos nativa de Word en la plantilla (Referencias → Tabla de contenido). Tras exportar, abra el fichero en Word y actualice el campo (clic derecho → Actualizar campo) para que tome los estilos Heading del cuerpo rellenado y los títulos fijos.',
  wordHelpMarkersTitle: 'Marcadores integrados',
  wordHelpMarkerCol: 'Marcador',
  wordHelpValueCol: 'Valor',
  wordHelpFmExample: 'Ejemplo de frontmatter (genérico): defina las claves que esperen los marcadores de la plantilla — escalares bajo {d.fm.*}, listas para bucles de tablas.',
  wordHelpGotIt: 'Entendido',
  wordFieldTitle: 'Título de la nota',
  wordFieldPath: 'Ruta de la nota',
  wordFieldBody: 'Cuerpo Markdown de la nota (ver sección Cuerpo abajo)',
  wordFieldVaultName: 'Nombre de la bóveda',
  wordFieldExportedAt: 'Marca de tiempo de exportación (ISO)',
  wordFieldAuthor: 'Nombre de usuario del exportador',
  wordFieldAuthorEmail: 'Correo del exportador',
  wordFieldFmKey: 'Cualquier escalar del frontmatter, p. ej. {d.fm.status}',
  wordFieldRootKey: 'Escalar del frontmatter en la raíz cuando no colisiona',
  wordFieldListCell: 'Una celda en una fila de tabla repetida (ver Cuadrículas)',
  noTemplatesUploaded: 'No hay plantillas subidas.',
  delete: 'Eliminar',
  uploadDocx: 'Subir plantilla .docx',
  optional: 'Opcional',
  wordFile: 'Archivo Word (.docx)',
  uploading: 'Subiendo…',
  uploadTemplate: 'Subir plantilla',
  usersSyncHint:
    'La sincronización obtiene cuentas de Myelin (API de administración). Los usuarios nuevos quedan listos para SSO sin contraseña local; los usuarios Synapse existentes se vinculan por id Myelin o correo.',
  syncFromMyelin: 'Sincronizar desde Myelin',
  syncing: 'Sincronizando…',
  createUser: 'Crear usuario',
  colUser: 'Usuario',
  colFlags: 'Indicadores',
  colActions: 'Acciones',
  flagAdmin: 'admin',
  flagActive: 'activo',
  flagDisabled: 'desactivado',
  flagSsoOnly: 'solo SSO',
  revokeAdmin: 'Revocar admin',
  makeAdmin: 'Hacer admin',
  disable: 'Desactivar',
  enable: 'Activar',
  setPassword: 'Definir contraseña',
  vaultsAdminHint:
    'Todas las bóvedas de esta instancia Synapse. Los administradores pueden transferir la propiedad o gestionar comparticiones sin ser propietarios. La transferencia mantiene al propietario anterior con acceso de Edición.',
  noVaults: 'Aún no hay bóvedas.',
  colVault: 'Bóveda',
  colOwner: 'Propietario',
  colStats: 'Estadísticas',
  publicWikiOn: 'wiki pública activa',
  unknown: 'Desconocido',
  notesCount: '{n} notas',
  sharesCount: '{n} comparticiones',
  open: 'Abrir',
  share: 'Compartir',
  changeOwner: 'Cambiar propietario',
  admin: 'Administrador',
  newPassword: 'Nueva contraseña',
  deleteUserTitle: '¿Eliminar usuario?',
  deleteUserMessage: 'Esto no se puede deshacer. El usuario no debe ser propietario de bóvedas.',
  syncUsersTitle: 'Sincronizar usuarios desde Myelin',
  syncUsersMessage:
    'Importar usuarios Myelin a Synapse. Coincidencia por id Myelin o correo. Las cuentas nuevas quedan listas para SSO (sin contraseña local). Los usuarios solo Synapse no se eliminan. Requiere sesión SSO de administrador o token API personal en Perfil.',
  syncNow: 'Sincronizar ahora',
  deleteWordTitle: 'Eliminar plantilla Word',
  deleteWordMessage: 'Esto elimina el .docx subido de la aplicación. Las notas existentes no se ven afectadas.',
  deleting: 'Eliminando…',
  changeVaultOwner: 'Cambiar propietario de la bóveda',
  changeOwnerHint: '{name} — el propietario anterior conserva acceso de Edición.',
  newOwner: 'Nuevo propietario',
  selectUser: 'Seleccionar usuario…',
  currentOwner: '— actual',
  transferring: 'Transfiriendo…',
  transferOwnership: 'Transferir propiedad',
  saved: 'Ajustes guardados',
  userCreated: 'Usuario creado',
  passwordUpdated: 'Contraseña actualizada',
  userDeleted: 'Usuario eliminado',
  templatePublished: 'Plantilla publicada',
  shareRejected: 'Solicitud de compartición rechazada',
  globalTemplateCreated: 'Plantilla global creada',
  wordTemplateUploaded: 'Plantilla de exportación Word subida',
  templateDeleted: 'Plantilla eliminada',
  ownershipTransferred: 'Propiedad de “{name}” transferida',
};

export const settingsFr: SettingsMessages = {
  administration: 'Administration',
  title: 'Paramètres',
  backVaults: '← Coffres',
  loading: 'Chargement des paramètres…',
  forbidden: 'Accès administrateur requis.',
  tabGeneral: 'Général',
  tabAuth: 'Authentification',
  tabEmail: 'E-mail',
  tabPm: 'Myelin',
  tabAi: 'IA',
  tabTemplates: 'Modèles',
  tabExport: 'Export Word',
  tabUsers: 'Utilisateurs',
  tabVaults: 'Coffres',
  siteName: 'Nom du site',
  showWikiDir: 'Afficher le répertoire des wikis publics (/w)',
  allowRegistration: 'Autoriser l’inscription publique',
  allowRegistrationHint:
    'Si désactivé, seuls les administrateurs peuvent créer des utilisateurs (le premier utilisateur d’une nouvelle installation peut toujours s’inscrire).',
  allowSso: 'Autoriser la connexion avec Myelin',
  minPasswordLength: 'Longueur minimale du mot de passe',
  smtpHint: 'SMTP est requis pour les e-mails de réinitialisation de mot de passe.',
  smtpConfigured: 'État : configuré.',
  smtpIncomplete: 'État : incomplet.',
  host: 'Hôte',
  port: 'Port',
  useTls: 'Utiliser TLS/SSL',
  username: 'Nom d’utilisateur',
  password: 'Mot de passe',
  passwordSaved: '(enregistré)',
  clearSmtpPassword: 'Effacer le mot de passe SMTP enregistré',
  fromEmail: 'E-mail expéditeur',
  fromName: 'Nom expéditeur',
  sendTestEmail: 'Envoyer un e-mail de test',
  enableMyelin: 'Activer l’intégration Myelin',
  pmBaseUrl: 'URL de base Myelin (depuis l’environnement)',
  myelinCallsHint:
    'Les appels Myelin utilisent le jeton SSO de chaque utilisateur, ou leur jeton personnel pt_… dans le Profil. Il n’y a pas de clé API globale.',
  aiHint:
    'Synapse appelle un fournisseur d’IA pour suggérer des YAML todos: à partir d’une note. Choisissez Ollama local ou OpenAI. Les suggestions ne sont jamais enregistrées automatiquement — l’éditeur les examine toujours d’abord.',
  enableAi: 'Activer les suggestions de tâches IA',
  provider: 'Fournisseur',
  providerOllama: 'Ollama (auto-hébergé)',
  providerOpenai: 'OpenAI',
  ollamaBaseUrl: 'URL de base Ollama',
  model: 'Modèle',
  refreshModels: 'Actualiser les modèles',
  noModels: 'Aucun modèle trouvé',
  modelSaved: '(enregistré)',
  ollamaModelsHint: 'Chargé depuis Ollama /api/tags. Tirez les modèles sur l’hôte, puis actualisez.',
  openaiModelsHint:
    'Chargé depuis OpenAI /v1/models (modèles de chat). Actualisez après avoir changé la clé API.',
  openaiApiKey: 'Clé API OpenAI',
  openaiKeyKeep: '•••••••• (laisser vide pour conserver)',
  clearApiKey: 'Effacer la clé API enregistrée',
  openaiModel: 'Modèle OpenAI',
  testApiKey: 'Tester la clé API',
  checking: 'Vérification…',
  pendingShareRequests: 'Demandes de partage en attente',
  openTemplatesPage: 'Ouvrir la page des modèles',
  noPendingRequests: 'Aucune demande en attente.',
  byUser: 'par {name}',
  approve: 'Approuver',
  reject: 'Rejeter',
  createGlobalTemplate: 'Créer un modèle global',
  createGlobalHint:
    'Disponible pour tous lors de la création de notes. Utilisez {{title}} dans le corps pour le titre de la note.',
  label: 'Libellé',
  description: 'Description',
  body: 'Corps',
  createGlobal: 'Créer un global',
  uploadedTemplates: 'Modèles téléversés',
  uploadedTemplatesHint: 'Modèles .docx au niveau de l’application pour l’export de notes (marqueurs Carbone).',
  howToCreateTemplates: 'Comment créer des modèles',
  wordHelpTitle: 'Comment créer un modèle Word',
  wordHelpSubtitle: 'Guide générique Carbone .docx — les marqueurs sont remplis depuis la note et son frontmatter',
  wordHelpStep1: 'Concevez la mise en page dans Word (styles, en-têtes, tableaux). Enregistrez en .docx.',
  wordHelpStep2: 'Insérez des marqueurs Carbone tels que {marker} en une seule plage continue (ne mettez pas en gras seulement une partie du marqueur).',
  wordHelpStep3: 'Téléversez le fichier ici. Les utilisateurs exportent une note avec Exporter DOCX dans un coffre.',
  wordHelpGridsTitle: 'Grilles (lignes répétées)',
  wordHelpGridsBody: 'Placez les marqueurs de champ sur une ligne d’exemple avec [i]. Synapse ajoute le marqueur de fin Carbone et répète cette ligne pour chaque élément du tableau frontmatter correspondant. Vous n’avez pas besoin de créer beaucoup de lignes vides à l’avance.',
  wordHelpGridsHint: 'Le nom du tableau (items ci-dessus) doit correspondre à une clé de liste YAML dans le frontmatter de la note. Stylez la ligne d’exemple dans Word ; les clones conservent cette mise en forme.',
  wordHelpNestedTitle: 'Lignes imbriquées / indentées',
  wordHelpNestedBody: 'Ajoutez indent: 1 (ou level) sur les éléments de liste imbriqués. Synapse préfixe les champs de type libellé (Task, name, title, …) avec des espaces cadratins, donc une cellule normale montre déjà l’imbrication. Vous pouvez aussi utiliser indentPrefix explicitement.',
  wordHelpBodyTitle: 'Corps et titres',
  wordHelpBodyP1: 'Placez {d.body} seul dans son propre paragraphe. Synapse le remplace par le Markdown de la note : styles Heading 1–4, tableaux GFM, code clôturé (monospace), callouts, notes de bas de page, maths (KaTeX → texte lisible), images du coffre et Mermaid en PNG lorsque le rendu réussit.',
  wordHelpBodyP2: 'Les titres de section fixes qui apparaissent toujours dans le document doivent être saisis dans Word avec les styles Heading 1 / Heading 2 — Carbone ne remplit que les marqueurs ; il n’invente pas un TOC tout seul.',
  wordHelpTocTitle: 'Table des matières',
  wordHelpTocBody: 'Insérez une table des matières Word native dans le modèle (Références → Table des matières). Après export, ouvrez le fichier dans Word et mettez à jour le champ (clic droit → Mettre à jour le champ) pour qu’il prenne les styles Heading du corps rempli et des titres fixes.',
  wordHelpMarkersTitle: 'Marqueurs intégrés',
  wordHelpMarkerCol: 'Marqueur',
  wordHelpValueCol: 'Valeur',
  wordHelpFmExample: 'Exemple de frontmatter (générique) : définissez les clés attendues par les marqueurs du modèle — scalaires sous {d.fm.*}, listes pour les boucles de tableaux.',
  wordHelpGotIt: 'Compris',
  wordFieldTitle: 'Titre de la note',
  wordFieldPath: 'Chemin de la note',
  wordFieldBody: 'Corps Markdown de la note (voir la section Corps ci-dessous)',
  wordFieldVaultName: 'Nom du coffre',
  wordFieldExportedAt: 'Horodatage d’export (ISO)',
  wordFieldAuthor: 'Nom d’utilisateur de l’exportateur',
  wordFieldAuthorEmail: 'E-mail de l’exportateur',
  wordFieldFmKey: 'Tout scalaire frontmatter, p. ex. {d.fm.status}',
  wordFieldRootKey: 'Scalaire frontmatter à la racine lorsqu’il ne collisionne pas',
  wordFieldListCell: 'Une cellule dans une ligne de tableau répétée (voir Grilles)',
  noTemplatesUploaded: 'Aucun modèle téléversé.',
  delete: 'Supprimer',
  uploadDocx: 'Téléverser un modèle .docx',
  optional: 'Facultatif',
  wordFile: 'Fichier Word (.docx)',
  uploading: 'Téléversement…',
  uploadTemplate: 'Téléverser le modèle',
  usersSyncHint:
    'La synchronisation récupère les comptes depuis Myelin (API admin). Les nouveaux utilisateurs sont prêts pour le SSO sans mot de passe local ; les utilisateurs Synapse existants sont liés par id Myelin ou e-mail.',
  syncFromMyelin: 'Synchroniser depuis Myelin',
  syncing: 'Synchronisation…',
  createUser: 'Créer un utilisateur',
  colUser: 'Utilisateur',
  colFlags: 'Indicateurs',
  colActions: 'Actions',
  flagAdmin: 'admin',
  flagActive: 'actif',
  flagDisabled: 'désactivé',
  flagSsoOnly: 'SSO uniquement',
  revokeAdmin: 'Révoquer admin',
  makeAdmin: 'Rendre admin',
  disable: 'Désactiver',
  enable: 'Activer',
  setPassword: 'Définir le mot de passe',
  vaultsAdminHint:
    'Tous les coffres de cette instance Synapse. Les administrateurs peuvent transférer la propriété ou gérer les partages sans être propriétaires. Le transfert conserve l’ancien propriétaire en accès Édition.',
  noVaults: 'Aucun coffre pour l’instant.',
  colVault: 'Coffre',
  colOwner: 'Propriétaire',
  colStats: 'Statistiques',
  publicWikiOn: 'wiki public activé',
  unknown: 'Inconnu',
  notesCount: '{n} notes',
  sharesCount: '{n} partages',
  open: 'Ouvrir',
  share: 'Partager',
  changeOwner: 'Changer de propriétaire',
  admin: 'Administrateur',
  newPassword: 'Nouveau mot de passe',
  deleteUserTitle: 'Supprimer l’utilisateur ?',
  deleteUserMessage: 'Cette action est irréversible. L’utilisateur ne doit posséder aucun coffre.',
  syncUsersTitle: 'Synchroniser les utilisateurs depuis Myelin',
  syncUsersMessage:
    'Importer les utilisateurs Myelin dans Synapse. Correspondance par id Myelin ou e-mail. Les nouveaux comptes sont prêts pour le SSO (sans mot de passe local). Les utilisateurs uniquement Synapse ne sont pas supprimés. Nécessite une session SSO admin ou un jeton API personnel dans le Profil.',
  syncNow: 'Synchroniser maintenant',
  deleteWordTitle: 'Supprimer le modèle Word',
  deleteWordMessage: 'Cela retire le .docx téléversé de l’application. Les notes existantes ne sont pas affectées.',
  deleting: 'Suppression…',
  changeVaultOwner: 'Changer le propriétaire du coffre',
  changeOwnerHint: '{name} — l’ancien propriétaire conserve l’accès Édition.',
  newOwner: 'Nouveau propriétaire',
  selectUser: 'Sélectionner un utilisateur…',
  currentOwner: '— actuel',
  transferring: 'Transfert…',
  transferOwnership: 'Transférer la propriété',
  saved: 'Paramètres enregistrés',
  userCreated: 'Utilisateur créé',
  passwordUpdated: 'Mot de passe mis à jour',
  userDeleted: 'Utilisateur supprimé',
  templatePublished: 'Modèle publié',
  shareRejected: 'Demande de partage rejetée',
  globalTemplateCreated: 'Modèle global créé',
  wordTemplateUploaded: 'Modèle d’export Word téléversé',
  templateDeleted: 'Modèle supprimé',
  ownershipTransferred: 'Propriété de « {name} » transférée',
};
