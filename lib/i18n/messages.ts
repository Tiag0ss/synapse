import type { Locale } from './config';
import {
  settingsEn,
  settingsEs,
  settingsFr,
  settingsPt,
  type SettingsMessages,
} from './settingsCatalog';
import {
  chromeEn,
  chromeEs,
  chromeFr,
  chromePt,
  type ChromeMessages,
} from './chromeCatalog';
import {
  statusEn,
  statusEs,
  statusFr,
  statusPt,
  type StatusMessages,
} from './statusCatalog';

export type Messages = {
  brand: string;
  nav: {
    profile: string;
    settings: string;
    templates: string;
    wikis: string;
    signIn: string;
    logOut: string;
    signedIn: string;
    theme: string;
    language: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
  };
  home: {
    vaults: string;
    wikis: string;
    emptyVaults: string;
    emptyWikis: string;
    myWork: string;
    owner: string;
    shared: string;
    knowledgeVaults: string;
    loadingWorkspace: string;
    headline: string;
    tagline: string;
    browseWikis: string;
    createAccount: string;
    continueVaults: string;
    startAccount: string;
    usernameOrEmail: string;
    password: string;
    username: string;
    email: string;
    signingIn: string;
    creating: string;
    forgotPassword: string;
    needAccount: string;
    haveAccount: string;
    or: string;
    signInMyelin: string;
    myelinLinkHint: string;
    createVault: string;
    createVaultHint: string;
    vaultName: string;
    create: string;
    newVault: string;
    searchVaults: string;
    clearSearch: string;
    canEdit: string;
    readOnly: string;
    roleShared: string;
    homeSectionsAria: string;
    defaultWikiVisibility: string;
    wikiAudienceTitle: string;
    searchWikis: string;
    browseAll: string;
    wikiCount: string;
    wikiCountOne: string;
    wikiCountOf: string;
    noVaultsMatch: string;
  };
  profile: {
    title: string;
    accountDetails: string;
    preferences: string;
    languageHint: string;
    loading: string;
    backVaults: string;
    profileFields: string;
    saveProfile: string;
    myelinApiToken: string;
    saveToken: string;
    testConnection: string;
    changePassword: string;
    setLocalPassword: string;
    setPassword: string;
    currentPassword: string;
    templatesHint: string;
    changePasswordHint: string;
    linkedToMyelinSuffix: string;
    ssoAccountTitle: string;
    ssoAccountBody: string;
    myelinUserId: string;
    emailManagedBySso: string;
    pmTokenHelp: string;
    ssoStatusLabel: string;
    connectionConnected: string;
    connectionNotConnected: string;
    personalTokenStatusLabel: string;
    tokenConfiguredFallback: string;
    tokenNotSet: string;
    personalApiTokenField: string;
    clearStoredToken: string;
    autoAssignLabel: string;
    autoAssignHelp: string;
    autoAssignNoPmUser: string;
    openAdminSettings: string;
    setLocalPasswordHint: string;
  };
  authPages: {
    forgotTitle: string;
    forgotHint: string;
    forgotSent: string;
    sendReset: string;
    sending: string;
    backSignIn: string;
    resetTitle: string;
    resetHint: string;
    missingToken: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    passwordsMismatch: string;
  };
  settings: SettingsMessages;
  chrome: ChromeMessages;
  status: StatusMessages;
  common: {
    save: string;
    cancel: string;
    close: string;
    loading: string;
    search: string;
    jump: string;
    jumpPlaceholder: string;
    recentNotes: string;
    noMatches: string;
    searching: string;
    noNotesYet: string;
    delete: string;
    create: string;
    optional: string;
    matchInBody: string;
    matchInTag: string;
    matchInRecent: string;
    confirm: string;
  };
};

const en: Messages = {
  brand: 'Synapse',
  nav: {
    profile: 'My profile',
    settings: 'Admin settings',
    templates: 'Note templates',
    wikis: 'Public wikis',
    signIn: 'Sign in',
    logOut: 'Log out',
    signedIn: 'Signed in',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications',
  },
  home: {
    vaults: 'Vaults',
    wikis: 'Wikis',
    emptyVaults: 'No vaults yet.',
    emptyWikis: 'No wikis available.',
    myWork: 'My work',
    owner: 'Owner',
    shared: 'Shared',
    knowledgeVaults: 'Knowledge vaults',
    loadingWorkspace: 'Loading workspace…',
    headline: 'Knowledge that stays connected',
    tagline:
      'Markdown vaults with wikilinks, tasks, and optional Myelin sync — built for teams that think in notes.',
    browseWikis: 'Browse public wikis',
    createAccount: 'Create account',
    continueVaults: 'Continue to your vaults.',
    startAccount: 'Start with a Synapse account.',
    usernameOrEmail: 'Username or email',
    password: 'Password',
    username: 'Username',
    email: 'Email',
    signingIn: 'Signing in…',
    creating: 'Creating…',
    forgotPassword: 'Forgot password?',
    needAccount: 'Need an account? Register',
    haveAccount: 'Already have an account? Sign in',
    or: 'or',
    signInMyelin: 'Sign in with Myelin',
    myelinLinkHint: 'Same email as in Myelin links your accounts.',
    createVault: 'Create vault',
    createVaultHint: 'A vault is a collection of Markdown notes. Wiki visibility can be changed later.',
    vaultName: 'Vault name',
    create: 'Create',
    newVault: 'New vault',
    searchVaults: 'Search vaults…',
    clearSearch: 'Clear search',
    canEdit: 'Can edit',
    readOnly: 'Read only',
    roleShared: 'Shared with you',
    homeSectionsAria: 'Home sections',
    defaultWikiVisibility: 'Default wiki visibility',
    wikiAudienceTitle: 'Wiki audience when public pages are enabled; also default for notes',
    searchWikis: 'Search wikis…',
    browseAll: 'Browse all',
    wikiCount: '{count} wikis',
    wikiCountOne: '{count} wiki',
    wikiCountOf: '{filtered} of {total} wikis',
    noVaultsMatch: 'No vaults match “{query}”.',
  },
  profile: {
    title: 'My profile',
    accountDetails: 'Account details',
    preferences: 'Preferences',
    languageHint: 'UI language for Synapse chrome. Note content stays in the language you write.',
    loading: 'Loading profile…',
    backVaults: '← Vaults',
    profileFields: 'Profile',
    saveProfile: 'Save profile',
    myelinApiToken: 'Myelin API token',
    saveToken: 'Save token',
    testConnection: 'Test connection',
    changePassword: 'Change password',
    setLocalPassword: 'Set local password',
    setPassword: 'Set password',
    currentPassword: 'Current password',
    templatesHint: 'Create personal templates and request admin approval to share them with everyone.',
    changePasswordHint: 'Update the password used for username/email sign-in.',
    linkedToMyelinSuffix: ' · linked to Myelin',
    ssoAccountTitle: 'SSO account',
    ssoAccountBody: 'Your email comes from Myelin and cannot be changed here. Username may be refreshed on the next SSO sign-in. You can still set a local password to sign in without SSO.',
    myelinUserId: 'Myelin user #{id}',
    emailManagedBySso: 'Managed by Myelin SSO',
    pmTokenHelp: 'Personal pt_… token from Project Management → Administration → API Tokens. Used for Myelin calls when you have no valid SSO session. Attribution and permissions follow this token.',
    ssoStatusLabel: 'SSO:',
    connectionConnected: 'connected',
    connectionNotConnected: 'not connected',
    personalTokenStatusLabel: 'Personal token:',
    tokenConfiguredFallback: 'configured',
    tokenNotSet: 'not set',
    personalApiTokenField: 'Personal API token',
    clearStoredToken: 'Clear stored personal token',
    autoAssignLabel: 'Auto-assign me on create',
    autoAssignHelp: 'When enabled, tasks created from Synapse are assigned to your linked Myelin user (SSO / Myelin user id). Off = leave Unassigned.',
    autoAssignNoPmUser: 'No linked Myelin user id yet — reconnect SSO (or ask an admin to sync Myelin users) so assignment can resolve.',
    openAdminSettings: 'Open admin settings',
    setLocalPasswordHint: 'Optional local password so you can sign in without SSO.',
  },
  authPages: {
    forgotTitle: 'Forgot password',
    forgotHint:
      'Enter your account email. If it exists and email is configured, you will receive a reset link.',
    forgotSent: 'If an account exists for that email, a reset link has been sent.',
    sendReset: 'Send reset link',
    sending: 'Sending…',
    backSignIn: '← Back to sign in',
    resetTitle: 'Reset password',
    resetHint: 'Choose a new password for your Synapse account.',
    missingToken: 'Missing reset token. Use the link from your email.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    updatePassword: 'Update password',
    passwordsMismatch: 'Passwords do not match',
  },
  settings: settingsEn,
  chrome: chromeEn,
  status: statusEn,
  common: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    loading: 'Loading…',
    search: 'Search',
    jump: 'Jump to note',
    jumpPlaceholder: 'Jump to note… (title, path, or body)',
    recentNotes: 'Recent notes',
    noMatches: 'No matches',
    searching: 'Searching…',
    noNotesYet: 'No notes yet',
    delete: 'Delete',
    create: 'Create',
    optional: 'Optional',
    matchInBody: ' · body',
    matchInTag: ' · tag',
    matchInRecent: ' · recent',
    confirm: 'Confirm',
  },
};

const pt: Messages = {
  brand: 'Synapse',
  nav: {
    profile: 'O meu perfil',
    settings: 'Definições de administração',
    templates: 'Modelos de nota',
    wikis: 'Wikis públicas',
    signIn: 'Iniciar sessão',
    logOut: 'Terminar sessão',
    signedIn: 'Com sessão',
    theme: 'Tema',
    language: 'Idioma',
    notifications: 'Notificações',
    markAllRead: 'Marcar tudo como lido',
    noNotifications: 'Sem notificações',
  },
  home: {
    vaults: 'Cofres',
    wikis: 'Wikis',
    emptyVaults: 'Ainda sem cofres.',
    emptyWikis: 'Sem wikis disponíveis.',
    myWork: 'O meu trabalho',
    owner: 'Proprietário',
    shared: 'Partilhado',
    knowledgeVaults: 'Cofres de conhecimento',
    loadingWorkspace: 'A carregar o espaço de trabalho…',
    headline: 'Conhecimento que se mantém ligado',
    tagline:
      'Cofres Markdown com wikilinks, tarefas e sincronização opcional com o Myelin — para equipas que pensam em notas.',
    browseWikis: 'Explorar wikis públicas',
    createAccount: 'Criar conta',
    continueVaults: 'Continuar para os seus cofres.',
    startAccount: 'Comece com uma conta Synapse.',
    usernameOrEmail: 'Nome de utilizador ou e-mail',
    password: 'Palavra-passe',
    username: 'Nome de utilizador',
    email: 'E-mail',
    signingIn: 'A iniciar sessão…',
    creating: 'A criar…',
    forgotPassword: 'Esqueceu-se da palavra-passe?',
    needAccount: 'Precisa de uma conta? Registar',
    haveAccount: 'Já tem conta? Iniciar sessão',
    or: 'ou',
    signInMyelin: 'Iniciar sessão com Myelin',
    myelinLinkHint: 'O mesmo e-mail no Myelin liga as contas.',
    createVault: 'Criar cofre',
    createVaultHint: 'Um cofre é um conjunto de notas Markdown. A visibilidade da wiki pode alterar-se depois.',
    vaultName: 'Nome do cofre',
    create: 'Criar',
    newVault: 'Novo cofre',
    searchVaults: 'Pesquisar cofres…',
    clearSearch: 'Limpar pesquisa',
    canEdit: 'Pode editar',
    readOnly: 'Só leitura',
    roleShared: 'Partilhado consigo',
    homeSectionsAria: 'Secções da página inicial',
    defaultWikiVisibility: 'Visibilidade wiki predefinida',
    wikiAudienceTitle: 'Audiência da wiki com páginas públicas; também predefinição das notas',
    searchWikis: 'Pesquisar wikis…',
    browseAll: 'Explorar todas',
    wikiCount: '{count} wikis',
    wikiCountOne: '{count} wiki',
    wikiCountOf: '{filtered} de {total} wikis',
    noVaultsMatch: 'Nenhum cofre corresponde a “{query}”.',
  },
  profile: {
    title: 'O meu perfil',
    accountDetails: 'Detalhes da conta',
    preferences: 'Preferências',
    languageHint: 'Idioma da interface Synapse. O conteúdo das notas permanece na língua em que escreve.',
    loading: 'A carregar o perfil…',
    backVaults: '← Cofres',
    profileFields: 'Perfil',
    saveProfile: 'Guardar perfil',
    myelinApiToken: 'Token API Myelin',
    saveToken: 'Guardar token',
    testConnection: 'Testar ligação',
    changePassword: 'Alterar palavra-passe',
    setLocalPassword: 'Definir palavra-passe local',
    setPassword: 'Definir palavra-passe',
    currentPassword: 'Palavra-passe actual',
    templatesHint:
      'Crie modelos pessoais e peça aprovação de administrador para os partilhar com todos.',
    changePasswordHint: 'Actualize a palavra-passe usada no início de sessão com nome de utilizador/e-mail.',
    linkedToMyelinSuffix: ' · associado ao Myelin',
    ssoAccountTitle: 'Conta SSO',
    ssoAccountBody: 'O seu e-mail vem do Myelin e não pode ser alterado aqui. O nome de utilizador pode actualizar-se no próximo início de sessão SSO. Pode ainda definir uma palavra-passe local para entrar sem SSO.',
    myelinUserId: 'Utilizador Myelin #{id}',
    emailManagedBySso: 'Gerido pelo SSO Myelin',
    pmTokenHelp: 'Token pessoal pt_… de Project Management → Administração → Tokens API. Usado nas chamadas Myelin quando não tem sessão SSO válida. A atribuição e as permissões seguem este token.',
    ssoStatusLabel: 'SSO:',
    connectionConnected: 'ligado',
    connectionNotConnected: 'não ligado',
    personalTokenStatusLabel: 'Token pessoal:',
    tokenConfiguredFallback: 'configurado',
    tokenNotSet: 'não definido',
    personalApiTokenField: 'Token API pessoal',
    clearStoredToken: 'Limpar token pessoal guardado',
    autoAssignLabel: 'Atribuir-me automaticamente ao criar',
    autoAssignHelp: 'Quando activo, as tarefas criadas a partir do Synapse são atribuídas ao seu utilizador Myelin associado (SSO / id Myelin). Desligado = ficam Sem atribuição.',
    autoAssignNoPmUser: 'Ainda sem id de utilizador Myelin associado — volte a ligar o SSO (ou peça a um administrador para sincronizar utilizadores Myelin) para a atribuição funcionar.',
    openAdminSettings: 'Abrir definições de administração',
    setLocalPasswordHint: 'Palavra-passe local opcional para entrar sem SSO.',
  },
  authPages: {
    forgotTitle: 'Esqueceu-se da palavra-passe',
    forgotHint:
      'Introduza o e-mail da conta. Se existir e o e-mail estiver configurado, receberá uma ligação de reposição.',
    forgotSent: 'Se existir uma conta para esse e-mail, foi enviada uma ligação de reposição.',
    sendReset: 'Enviar ligação de reposição',
    sending: 'A enviar…',
    backSignIn: '← Voltar ao início de sessão',
    resetTitle: 'Repor palavra-passe',
    resetHint: 'Escolha uma nova palavra-passe para a sua conta Synapse.',
    missingToken: 'Falta o token de reposição. Use a ligação do seu e-mail.',
    newPassword: 'Nova palavra-passe',
    confirmPassword: 'Confirmar palavra-passe',
    updatePassword: 'Actualizar palavra-passe',
    passwordsMismatch: 'As palavras-passe não coincidem',
  },
  settings: settingsPt,
  chrome: chromePt,
  status: statusPt,
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Fechar',
    loading: 'A carregar…',
    search: 'Pesquisar',
    jump: 'Ir para a nota',
    jumpPlaceholder: 'Ir para a nota… (título, caminho ou corpo)',
    recentNotes: 'Notas recentes',
    noMatches: 'Sem resultados',
    searching: 'A pesquisar…',
    noNotesYet: 'Ainda sem notas',
    delete: 'Eliminar',
    create: 'Criar',
    optional: 'Opcional',
    matchInBody: ' · corpo',
    matchInTag: ' · etiqueta',
    matchInRecent: ' · recente',
    confirm: 'Confirmar',
  },
};

const es: Messages = {
  brand: 'Synapse',
  nav: {
    profile: 'Mi perfil',
    settings: 'Ajustes de administración',
    templates: 'Plantillas de notas',
    wikis: 'Wikis públicas',
    signIn: 'Iniciar sesión',
    logOut: 'Cerrar sesión',
    signedIn: 'Con sesión',
    theme: 'Tema',
    language: 'Idioma',
    notifications: 'Notificaciones',
    markAllRead: 'Marcar todo como leído',
    noNotifications: 'Sin notificaciones',
  },
  home: {
    vaults: 'Bóvedas',
    wikis: 'Wikis',
    emptyVaults: 'Aún no hay bóvedas.',
    emptyWikis: 'No hay wikis disponibles.',
    myWork: 'Mi trabajo',
    owner: 'Propietario',
    shared: 'Compartido',
    knowledgeVaults: 'Bóvedas de conocimiento',
    loadingWorkspace: 'Cargando el espacio de trabajo…',
    headline: 'Conocimiento que sigue conectado',
    tagline:
      'Bóvedas Markdown con wikilinks, tareas y sincronización opcional con Myelin — para equipos que piensan en notas.',
    browseWikis: 'Explorar wikis públicas',
    createAccount: 'Crear cuenta',
    continueVaults: 'Continuar a tus bóvedas.',
    startAccount: 'Empieza con una cuenta Synapse.',
    usernameOrEmail: 'Usuario o correo',
    password: 'Contraseña',
    username: 'Usuario',
    email: 'Correo',
    signingIn: 'Iniciando sesión…',
    creating: 'Creando…',
    forgotPassword: '¿Olvidaste la contraseña?',
    needAccount: '¿Necesitas una cuenta? Registrarse',
    haveAccount: '¿Ya tienes cuenta? Iniciar sesión',
    or: 'o',
    signInMyelin: 'Iniciar sesión con Myelin',
    myelinLinkHint: 'El mismo correo que en Myelin vincula las cuentas.',
    createVault: 'Crear bóveda',
    createVaultHint: 'Una bóveda es un conjunto de notas Markdown. La visibilidad de la wiki se puede cambiar después.',
    vaultName: 'Nombre de la bóveda',
    create: 'Crear',
    newVault: 'Nueva bóveda',
    searchVaults: 'Buscar bóvedas…',
    clearSearch: 'Borrar búsqueda',
    canEdit: 'Puede editar',
    readOnly: 'Solo lectura',
    roleShared: 'Compartido contigo',
    homeSectionsAria: 'Secciones de inicio',
    defaultWikiVisibility: 'Visibilidad wiki predeterminada',
    wikiAudienceTitle: 'Audiencia de la wiki con páginas públicas; también predeterminado de notas',
    searchWikis: 'Buscar wikis…',
    browseAll: 'Explorar todas',
    wikiCount: '{count} wikis',
    wikiCountOne: '{count} wiki',
    wikiCountOf: '{filtered} de {total} wikis',
    noVaultsMatch: 'Ninguna bóveda coincide con “{query}”.',
  },
  profile: {
    title: 'Mi perfil',
    accountDetails: 'Detalles de la cuenta',
    preferences: 'Preferencias',
    languageHint: 'Idioma de la interfaz de Synapse. El contenido de las notas permanece en el idioma en que escribes.',
    loading: 'Cargando perfil…',
    backVaults: '← Bóvedas',
    profileFields: 'Perfil',
    saveProfile: 'Guardar perfil',
    myelinApiToken: 'Token API Myelin',
    saveToken: 'Guardar token',
    testConnection: 'Probar conexión',
    changePassword: 'Cambiar contraseña',
    setLocalPassword: 'Establecer contraseña local',
    setPassword: 'Establecer contraseña',
    currentPassword: 'Contraseña actual',
    templatesHint:
      'Crea plantillas personales y pide aprobación de administrador para compartirlas con todos.',
    changePasswordHint: 'Actualiza la contraseña usada para iniciar sesión con usuario/correo.',
    linkedToMyelinSuffix: ' · vinculado a Myelin',
    ssoAccountTitle: 'Cuenta SSO',
    ssoAccountBody: 'Su correo proviene de Myelin y no se puede cambiar aquí. El usuario puede actualizarse en el próximo inicio de sesión SSO. Aún puede establecer una contraseña local para entrar sin SSO.',
    myelinUserId: 'Usuario Myelin #{id}',
    emailManagedBySso: 'Gestionado por el SSO Myelin',
    pmTokenHelp: 'Token personal pt_… de Project Management → Administración → Tokens API. Se usa para llamadas Myelin sin sesión SSO válida. La atribución y los permisos siguen este token.',
    ssoStatusLabel: 'SSO:',
    connectionConnected: 'conectado',
    connectionNotConnected: 'no conectado',
    personalTokenStatusLabel: 'Token personal:',
    tokenConfiguredFallback: 'configurado',
    tokenNotSet: 'no definido',
    personalApiTokenField: 'Token API personal',
    clearStoredToken: 'Borrar token personal almacenado',
    autoAssignLabel: 'Asignarme automáticamente al crear',
    autoAssignHelp: 'Si está activo, las tareas creadas desde Synapse se asignan a su usuario Myelin vinculado (SSO / id Myelin). Desactivado = quedan Sin asignar.',
    autoAssignNoPmUser: 'Aún no hay id de usuario Myelin vinculado — reconecte el SSO (o pida a un administrador que sincronice usuarios Myelin) para que la asignación funcione.',
    openAdminSettings: 'Abrir ajustes de administración',
    setLocalPasswordHint: 'Contraseña local opcional para iniciar sesión sin SSO.',
  },
  authPages: {
    forgotTitle: 'Olvidé la contraseña',
    forgotHint:
      'Introduce el correo de tu cuenta. Si existe y el correo está configurado, recibirás un enlace de restablecimiento.',
    forgotSent: 'Si existe una cuenta para ese correo, se ha enviado un enlace de restablecimiento.',
    sendReset: 'Enviar enlace',
    sending: 'Enviando…',
    backSignIn: '← Volver a iniciar sesión',
    resetTitle: 'Restablecer contraseña',
    resetHint: 'Elige una nueva contraseña para tu cuenta Synapse.',
    missingToken: 'Falta el token de restablecimiento. Usa el enlace de tu correo.',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar contraseña',
    updatePassword: 'Actualizar contraseña',
    passwordsMismatch: 'Las contraseñas no coinciden',
  },
  settings: settingsEs,
  chrome: chromeEs,
  status: statusEs,
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    loading: 'Cargando…',
    search: 'Buscar',
    jump: 'Ir a la nota',
    jumpPlaceholder: 'Ir a la nota… (título, ruta o cuerpo)',
    recentNotes: 'Notas recientes',
    noMatches: 'Sin resultados',
    searching: 'Buscando…',
    noNotesYet: 'Aún no hay notas',
    delete: 'Eliminar',
    create: 'Crear',
    optional: 'Opcional',
    matchInBody: ' · cuerpo',
    matchInTag: ' · etiqueta',
    matchInRecent: ' · reciente',
    confirm: 'Confirmar',
  },
};

const fr: Messages = {
  brand: 'Synapse',
  nav: {
    profile: 'Mon profil',
    settings: 'Paramètres admin',
    templates: 'Modèles de notes',
    wikis: 'Wikis publics',
    signIn: 'Connexion',
    logOut: 'Déconnexion',
    signedIn: 'Connecté',
    theme: 'Thème',
    language: 'Langue',
    notifications: 'Notifications',
    markAllRead: 'Tout marquer comme lu',
    noNotifications: 'Aucune notification',
  },
  home: {
    vaults: 'Coffres',
    wikis: 'Wikis',
    emptyVaults: 'Aucun coffre pour l’instant.',
    emptyWikis: 'Aucun wiki disponible.',
    myWork: 'Mon travail',
    owner: 'Propriétaire',
    shared: 'Partagé',
    knowledgeVaults: 'Coffres de connaissance',
    loadingWorkspace: 'Chargement de l’espace de travail…',
    headline: 'Une connaissance qui reste connectée',
    tagline:
      'Coffres Markdown avec wikilinks, tâches et sync Myelin optionnelle — pour les équipes qui pensent en notes.',
    browseWikis: 'Parcourir les wikis publics',
    createAccount: 'Créer un compte',
    continueVaults: 'Continuer vers vos coffres.',
    startAccount: 'Commencez avec un compte Synapse.',
    usernameOrEmail: 'Nom d’utilisateur ou e-mail',
    password: 'Mot de passe',
    username: 'Nom d’utilisateur',
    email: 'E-mail',
    signingIn: 'Connexion…',
    creating: 'Création…',
    forgotPassword: 'Mot de passe oublié ?',
    needAccount: 'Besoin d’un compte ? S’inscrire',
    haveAccount: 'Déjà un compte ? Se connecter',
    or: 'ou',
    signInMyelin: 'Se connecter avec Myelin',
    myelinLinkHint: 'Le même e-mail que dans Myelin lie vos comptes.',
    createVault: 'Créer un coffre',
    createVaultHint:
      'Un coffre est une collection de notes Markdown. La visibilité du wiki peut être modifiée plus tard.',
    vaultName: 'Nom du coffre',
    create: 'Créer',
    newVault: 'Nouveau coffre',
    searchVaults: 'Rechercher des coffres…',
    clearSearch: 'Effacer la recherche',
    canEdit: 'Peut modifier',
    readOnly: 'Lecture seule',
    roleShared: 'Partagé avec vous',
    homeSectionsAria: 'Sections d’accueil',
    defaultWikiVisibility: 'Visibilité wiki par défaut',
    wikiAudienceTitle: 'Audience du wiki lorsque les pages publiques sont activées ; défaut aussi pour les notes',
    searchWikis: 'Rechercher des wikis…',
    browseAll: 'Tout parcourir',
    wikiCount: '{count} wikis',
    wikiCountOne: '{count} wiki',
    wikiCountOf: '{filtered} sur {total} wikis',
    noVaultsMatch: 'Aucun coffre ne correspond à « {query} ».',
  },
  profile: {
    title: 'Mon profil',
    accountDetails: 'Détails du compte',
    preferences: 'Préférences',
    languageHint:
      'Langue de l’interface Synapse. Le contenu des notes reste dans la langue d’écriture.',
    loading: 'Chargement du profil…',
    backVaults: '← Coffres',
    profileFields: 'Profil',
    saveProfile: 'Enregistrer le profil',
    myelinApiToken: 'Jeton API Myelin',
    saveToken: 'Enregistrer le jeton',
    testConnection: 'Tester la connexion',
    changePassword: 'Changer le mot de passe',
    setLocalPassword: 'Définir un mot de passe local',
    setPassword: 'Définir le mot de passe',
    currentPassword: 'Mot de passe actuel',
    templatesHint:
      'Créez des modèles personnels et demandez l’approbation admin pour les partager avec tous.',
    changePasswordHint: 'Mettez à jour le mot de passe utilisé pour la connexion nom/e-mail.',
    linkedToMyelinSuffix: ' · lié à Myelin',
    ssoAccountTitle: 'Compte SSO',
    ssoAccountBody: 'Votre e-mail provient de Myelin et ne peut pas être modifié ici. Le nom d’utilisateur peut être actualisé à la prochaine connexion SSO. Vous pouvez toujours définir un mot de passe local pour vous connecter sans SSO.',
    myelinUserId: 'Utilisateur Myelin #{id}',
    emailManagedBySso: 'Géré par le SSO Myelin',
    pmTokenHelp: 'Jeton personnel pt_… depuis Project Management → Administration → Jetons API. Utilisé pour les appels Myelin sans session SSO valide. L’attribution et les droits suivent ce jeton.',
    ssoStatusLabel: 'SSO :',
    connectionConnected: 'connecté',
    connectionNotConnected: 'non connecté',
    personalTokenStatusLabel: 'Jeton personnel :',
    tokenConfiguredFallback: 'configuré',
    tokenNotSet: 'non défini',
    personalApiTokenField: 'Jeton API personnel',
    clearStoredToken: 'Effacer le jeton personnel enregistré',
    autoAssignLabel: 'M’assigner automatiquement à la création',
    autoAssignHelp: 'Lorsqu’il est activé, les tâches créées depuis Synapse sont assignées à votre utilisateur Myelin lié (SSO / id Myelin). Désactivé = laisser Non assigné.',
    autoAssignNoPmUser: 'Pas encore d’id utilisateur Myelin lié — reconnectez le SSO (ou demandez à un admin de synchroniser les utilisateurs Myelin) pour que l’assignation fonctionne.',
    openAdminSettings: 'Ouvrir les paramètres admin',
    setLocalPasswordHint: 'Mot de passe local optionnel pour vous connecter sans SSO.',
  },
  authPages: {
    forgotTitle: 'Mot de passe oublié',
    forgotHint:
      'Saisissez l’e-mail de votre compte. S’il existe et que l’e-mail est configuré, vous recevrez un lien de réinitialisation.',
    forgotSent: 'Si un compte existe pour cet e-mail, un lien de réinitialisation a été envoyé.',
    sendReset: 'Envoyer le lien',
    sending: 'Envoi…',
    backSignIn: '← Retour à la connexion',
    resetTitle: 'Réinitialiser le mot de passe',
    resetHint: 'Choisissez un nouveau mot de passe pour votre compte Synapse.',
    missingToken: 'Jeton de réinitialisation manquant. Utilisez le lien de votre e-mail.',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    passwordsMismatch: 'Les mots de passe ne correspondent pas',
  },
  settings: settingsFr,
  chrome: chromeFr,
  status: statusFr,
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    loading: 'Chargement…',
    search: 'Rechercher',
    jump: 'Aller à la note',
    jumpPlaceholder: 'Aller à la note… (titre, chemin ou corps)',
    recentNotes: 'Notes récentes',
    noMatches: 'Aucun résultat',
    searching: 'Recherche…',
    noNotesYet: 'Aucune note pour l’instant',
    delete: 'Supprimer',
    create: 'Créer',
    optional: 'Facultatif',
    matchInBody: ' · corps',
    matchInTag: ' · tag',
    matchInRecent: ' · récent',
    confirm: 'Confirmer',
  },
};

export const catalogs: Record<Locale, Messages> = { en, pt, es, fr };

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export function t(locale: Locale, path: string, vars?: Record<string, string | number>): string {
  const raw = getByPath(catalogs[locale], path) ?? getByPath(catalogs.en, path) ?? path;
  let s = String(raw);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}
