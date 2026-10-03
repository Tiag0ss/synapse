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
  showWikiDir: 'Mostrar diretório de wikis públicas (/w)',
  allowRegistration: 'Permitir registo público',
  allowRegistrationHint:
    'Quando desativado, só os administradores podem criar utilizadores (o primeiro utilizador numa instalação nova pode sempre registar-se).',
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
  enableMyelin: 'Ativar integração Myelin',
  pmBaseUrl: 'URL base do Myelin (do ambiente)',
  myelinCallsHint:
    'As chamadas ao Myelin usam o token SSO de cada utilizador, ou o token pessoal pt_… no Perfil. Não há chave de API global.',
  aiHint:
    'O Synapse chama um fornecedor de IA para sugerir YAML todos: a partir de uma nota. Escolha Ollama local ou OpenAI. As sugestões nunca são guardadas automaticamente — o editor revê-as sempre primeiro.',
  enableAi: 'Ativar sugestões de tarefas por IA',
  provider: 'Fornecedor',
  providerOllama: 'Ollama (auto-hospedado)',
  providerOpenai: 'OpenAI',
  ollamaBaseUrl: 'URL base do Ollama',
  model: 'Modelo',
  refreshModels: 'Atualizar modelos',
  noModels: 'Nenhum modelo encontrado',
  modelSaved: '(guardado)',
  ollamaModelsHint: 'Carregado de Ollama /api/tags. Faça pull dos modelos no anfitrião e atualize.',
  openaiModelsHint:
    'Carregado de OpenAI /v1/models (modelos de chat). Atualize após alterar a chave API.',
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
  colActions: 'Ações',
  flagAdmin: 'admin',
  flagActive: 'ativo',
  flagDisabled: 'desativado',
  flagSsoOnly: 'só SSO',
  revokeAdmin: 'Revogar admin',
  makeAdmin: 'Tornar admin',
  disable: 'Desativar',
  enable: 'Ativar',
  setPassword: 'Definir palavra-passe',
  vaultsAdminHint:
    'Todos os cofres nesta instância Synapse. Os administradores podem transferir a propriedade ou gerir partilhas sem serem proprietários. A transferência mantém o proprietário anterior com acesso de Edição.',
  noVaults: 'Ainda sem cofres.',
  colVault: 'Cofre',
  colOwner: 'Proprietário',
  colStats: 'Estatísticas',
  publicWikiOn: 'wiki pública ativa',
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
  deleteWordMessage: 'Isto remove o .docx enviado da aplicação. As notas existentes não são afetadas.',
  deleting: 'A eliminar…',
  changeVaultOwner: 'Alterar proprietário do cofre',
  changeOwnerHint: '{name} — o proprietário anterior mantém acesso de Edição.',
  newOwner: 'Novo proprietário',
  selectUser: 'Selecionar utilizador…',
  currentOwner: '— atual',
  transferring: 'A transferir…',
  transferOwnership: 'Transferir propriedade',
  saved: 'Definições guardadas',
  userCreated: 'Utilizador criado',
  passwordUpdated: 'Palavra-passe atualizada',
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
