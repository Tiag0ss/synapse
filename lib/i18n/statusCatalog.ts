/** Status / error / toast strings (en, pt PT-PT pré-AO90, es Spain, fr France). */

export type StatusMessages = {
  networkError: string;
  deleteFailed: string;
  failedToLoadTemplates: string;
  uploadFailed: string;
  updateFailed: string;
  saveFailed: string;
  createFailed: string;
  exportFailed: string;
  loginFailed: string;
  registrationFailed: string;
  resetFailed: string;
  failedToLoad: string;
  failedToCreateVault: string;
  failedToLoadWikis: string;
  failedToLoadSettings: string;
  failedToLoadProfile: string;
  failedToLoadNote: string;
  failedToLoadAttachments: string;
  failedToLoadFlashcards: string;
  failedToLoadMembers: string;
  failedToLoadMyelinTasks: string;
  networkErrorLoadingMyelinTasks: string;
  networkErrorBulkCreate: string;
  saveFailedBeforeExport: string;
  failedDownloadMarkdown: string;
  failedOpenPrintWindow: string;
  failedOpenPrintDialog: string;
  openVaultNoteToUpload: string;
  unsupportedFileType: string;
  imageInserted: string;
  attachmentInserted: string;
  attachmentRemoved: string;
  pullOnlyOverview: string;
  saveBeforeUpdatingTasks: string;
  saveBeforeCreatingTasks: string;
  saveBeforeLinkingTasks: string;
  markedOpen: string;
  markedDone: string;
  couldNotUpdateCheckbox: string;
  couldNotCreateTask: string;
  couldNotLinkTask: string;
  couldNotUnlinkTask: string;
  linkMyelinInVaultSettings: string;
  linkMyelinProjectFirst: string;
  pickOrgFirst: string;
  creatingProject: string;
  alreadyLinked: string;
  failedCreateProject: string;
  orgAndProjectRequired: string;
  linkFailed: string;
  projectUnlinked: string;
  unlinkFailed: string;
  creatingTask: string;
  linkingTask: string;
  unlinking: string;
  noMissingTasks: string;
  selectNoteFirst: string;
  noUnlinkedCheckboxes: string;
  matchingMyelinByDescription: string;
  autoLinkFailed: string;
  aiTodoSuggestionsFailed: string;
  estimatesUpdatedSaveFailed: string;
  todosUpdatedSaveFailed: string;
  frontmatterTodosUpdatedAi: string;
  writeAnswerFirst: string;
  failedSubmit: string;
  failedSaveDecision: string;
  failedUpdateLock: string;
  onlyDeleteOwnPendingAnswers: string;
  onlyEditOwnPendingAnswers: string;
  couldNotCopyClipboard: string;
  flashcardShareCreated: string;
  shareLinkCreated: string;
  shareRevoked: string;
  couldNotAddMember: string;
  removeFailed: string;
  couldNotAddAllUsers: string;
  ownershipTransferFailed: string;
  labelAndDocxRequired: string;
  testFailed: string;
  actionFailed: string;
  failedCreateGlobalTemplate: string;
  syncFailed: string;
  genericFailed: string;
  noProfileChanges: string;
  profileSaved: string;
  failedSaveAutoAssign: string;
  enterApiTokenOrClear: string;
  couldNotSaveApiToken: string;
  apiTokenCleared: string;
  apiTokenSaved: string;
  connectionTestFailed: string;
  connected: string;
  enterNewPassword: string;
  passwordsDoNotMatch: string;
  currentPasswordRequired: string;
  passwordUpdateFailed: string;
  passwordUpdated: string;
  localPasswordSet: string;
  templateSaved: string;
  createdPersonalTemplate: string;
  shareRequestFailed: string;
  shareRequestedPending: string;
  withdrawFailed: string;
  templatePrivateAgain: string;
  templateDeleted: string;
  noteRequiresSignIn: string;
  noteUnavailable: string;
  notFound: string;
  graphUnavailable: string;
  autosaving: string;
  autosaved: string;
  saved: string;
  couldNotRefreshMyelin: string;
  whiteboardMovedTrash: string;
  noteMovedTrash: string;
  couldNotLoadRevision: string;
  restored: string;
  restoreFailed: string;
  publicWikiDisabled: string;
  failedDisablePublicWiki: string;
  publicWikiEnabled: string;
  failedEnablePublicWiki: string;
  failedUpdatePublicWiki: string;
  currentNoteDirectLinks: string;
  currentNoteLinks: string;
  noWikisMatch: string;
  noWikisMatchFilter: string;
  noWikisVisibleYet: string;
  noTemplates: string;
  selectTemplate: string;
  meetingMinutes: string;
  selectNoteFocusMindmap: string;
  noLinkedNotesYet: string;
  noOrganizationsReturned: string;
  failedLoadOrganizations: string;
  networkErrorLoadingOrganizations: string;
  failedLoadProjects: string;
  linkedMyelinProjectName: string;
  linkedMyelinProjectId: string;
  alreadyLinkedAsMyelin: string;
  createdMyelinTask: string;
  linkedToMyelin: string;
  unlinkedFromMyelin: string;
  bulkCreateFailed: string;
  creatingMissingTasks: string;
  preparingCreateTasks: string;
  bulkCreateSummary: string;
  bulkCreateErrorsSuffix: string;
  grantedRoleToUser: string;
  addedUsersAsRole: string;
  alreadyMembersSuffix: string;
  syncedOneTaskFromMyelin: string;
  syncedTasksFromMyelin: string;
  clearedOneStaleMyelinLink: string;
  clearedStaleMyelinLinks: string;
  estimatesAlreadyUpToDate: string;
  noTaskHoursToRecalculate: string;
  updatedEstimate: string;
  failedSuggestTodos: string;
  networkErrorOllama: string;
  chooseKeptTodoForMerge: string;
  failedApplyTodos: string;
  failedLoadShares: string;
  failedCreateShare: string;
  failedRevokeShare: string;
  transferFailed: string;
  sent: string;
  autoAssignOn: string;
  autoAssignOff: string;
  createdInOtherVault: string;
  createdAndLinked: string;
  tasksUpdatedHub: string;
  autoLinkSummary: string;
  autoLinkDetailed: string;
  syncUsersSummary: string;
  failedCountSuffix: string;
  noteMovedDestination: string;
  noteCopiedDestination: string;
  networkErrorListingOllama: string;
  networkErrorListingOpenai: string;
  connectionOk: string;
  uploadedNamed: string;

  couldNotReadImage: string;
  failedListModels: string;
};

export const statusEn: StatusMessages = {
  networkError: 'Network error',
  deleteFailed: 'Delete failed',
  failedToLoadTemplates: 'Failed to load templates',
  uploadFailed: 'Upload failed',
  updateFailed: 'Update failed',
  saveFailed: 'Save failed',
  createFailed: 'Create failed',
  exportFailed: 'Export failed',
  loginFailed: 'Login failed',
  registrationFailed: 'Registration failed',
  resetFailed: 'Reset failed',
  failedToLoad: 'Failed to load',
  failedToCreateVault: 'Failed to create vault',
  failedToLoadWikis: 'Failed to load wikis',
  failedToLoadSettings: 'Failed to load settings',
  failedToLoadProfile: 'Failed to load profile',
  failedToLoadNote: 'Failed to load note',
  failedToLoadAttachments: 'Failed to load attachments',
  failedToLoadFlashcards: 'Failed to load flashcards',
  failedToLoadMembers: 'Failed to load members',
  failedToLoadMyelinTasks: 'Failed to load Myelin tasks',
  networkErrorLoadingMyelinTasks: 'Network error loading Myelin tasks',
  networkErrorBulkCreate: 'Network error during bulk create',
  saveFailedBeforeExport: 'Save failed — fix save errors before exporting',
  failedDownloadMarkdown: 'Failed to download Markdown',
  failedOpenPrintWindow: 'Failed to open print window',
  failedOpenPrintDialog: 'Failed to open print dialog',
  openVaultNoteToUpload: 'Open a vault note to upload files',
  unsupportedFileType: 'Unsupported file type',
  imageInserted: 'Image inserted',
  attachmentInserted: 'Attachment inserted',
  attachmentRemoved: 'Attachment removed',
  pullOnlyOverview: 'This overview is pull-only. Use Refresh tasks above.',
  saveBeforeUpdatingTasks: 'Save the note before updating tasks',
  saveBeforeCreatingTasks: 'Save the note before creating tasks',
  saveBeforeLinkingTasks: 'Save the note before linking tasks',
  markedOpen: 'Marked open',
  markedDone: 'Marked done',
  couldNotUpdateCheckbox: 'Could not update checkbox',
  couldNotCreateTask: 'Could not create task',
  couldNotLinkTask: 'Could not link task',
  couldNotUnlinkTask: 'Could not unlink task',
  linkMyelinInVaultSettings: 'Link a Myelin project in Vault settings first',
  linkMyelinProjectFirst: 'Link a Myelin project first',
  pickOrgFirst: 'Pick an organization first',
  creatingProject: 'Creating project…',
  alreadyLinked: 'Already linked',
  failedCreateProject: 'Failed to create project',
  orgAndProjectRequired: 'Organization and project required',
  linkFailed: 'Link failed',
  projectUnlinked: 'Project unlinked from vault',
  unlinkFailed: 'Unlink failed',
  creatingTask: 'Creating task…',
  linkingTask: 'Linking task…',
  unlinking: 'Unlinking…',
  noMissingTasks: 'No missing tasks — all checkboxes are already linked',
  selectNoteFirst: 'Select a note first',
  noUnlinkedCheckboxes: 'No unlinked checkboxes in that note',
  matchingMyelinByDescription: 'Matching Myelin tasks by description…',
  autoLinkFailed: 'Auto-link failed',
  aiTodoSuggestionsFailed: 'AI todo suggestions failed',
  estimatesUpdatedSaveFailed: 'Updated estimates in editor, but save failed — save before export',
  todosUpdatedSaveFailed: 'Updated todos in editor, but save failed — save manually',
  frontmatterTodosUpdatedAi: 'Frontmatter todos updated from AI suggestions',
  writeAnswerFirst: 'Write an answer first',
  failedSubmit: 'Failed to submit',
  failedSaveDecision: 'Failed to save decision',
  failedUpdateLock: 'Failed to update lock',
  onlyDeleteOwnPendingAnswers: 'You can only delete your own pending answers from this browser',
  onlyEditOwnPendingAnswers: 'You can only edit your own pending answers from this browser',
  couldNotCopyClipboard: 'Could not copy to clipboard',
  flashcardShareCreated: 'Flashcard share link created',
  shareLinkCreated: 'Share link created',
  shareRevoked: 'Share revoked',
  couldNotAddMember: 'Could not add member',
  removeFailed: 'Remove failed',
  couldNotAddAllUsers: 'Could not add all users',
  ownershipTransferFailed: 'Ownership transfer failed',
  labelAndDocxRequired: 'Label and .docx file are required',
  testFailed: 'Test failed',
  actionFailed: 'Action failed',
  failedCreateGlobalTemplate: 'Failed to create global template',
  syncFailed: 'Sync failed',
  genericFailed: 'Failed',
  noProfileChanges: 'No profile changes to save',
  profileSaved: 'Profile saved',
  failedSaveAutoAssign: 'Failed to save auto-assign preference',
  enterApiTokenOrClear: 'Enter a personal API token or check Clear',
  couldNotSaveApiToken: 'Could not save API token',
  apiTokenCleared: 'Personal API token cleared',
  apiTokenSaved: 'Personal API token saved',
  connectionTestFailed: 'Connection test failed',
  connected: 'Connected',
  enterNewPassword: 'Enter a new password',
  passwordsDoNotMatch: 'New passwords do not match',
  currentPasswordRequired: 'Current password is required',
  passwordUpdateFailed: 'Password update failed',
  passwordUpdated: 'Password updated',
  localPasswordSet: 'Local password set',
  templateSaved: 'Template saved',
  createdPersonalTemplate: 'Created personal template',
  shareRequestFailed: 'Share request failed',
  shareRequestedPending: 'Share requested — waiting for admin approval',
  withdrawFailed: 'Withdraw failed',
  templatePrivateAgain: 'Template is private again',
  templateDeleted: 'Template deleted',
  noteRequiresSignIn: 'This note requires sign-in. Sign in with Myelin, then reload.',
  noteUnavailable: 'Note unavailable',
  notFound: 'Not found',
  graphUnavailable: 'Graph unavailable',
  autosaving: 'Autosaving…',
  autosaved: 'Autosaved',
  saved: 'Saved',
  couldNotRefreshMyelin: 'Could not refresh Myelin tasks',
  whiteboardMovedTrash: 'Whiteboard moved to trash',
  noteMovedTrash: 'Note moved to trash',
  couldNotLoadRevision: 'Could not load revision',
  restored: 'Restored',
  restoreFailed: 'Restore failed',
  publicWikiDisabled: 'Public wiki disabled',
  failedDisablePublicWiki: 'Failed to disable public wiki',
  publicWikiEnabled: 'Public wiki enabled',
  failedEnablePublicWiki: 'Failed to enable public wiki',
  failedUpdatePublicWiki: 'Failed to update public wiki',
  currentNoteDirectLinks: 'Current note + direct links',
  currentNoteLinks: 'Current note + links',
  noWikisMatch: 'No wikis match “{query}”.',
  noWikisMatchFilter: 'No wikis match your filter.',
  noWikisVisibleYet: 'No wikis are visible yet. Enable the public wiki on a vault and publish notes, or open the full directory.',
  noTemplates: 'No templates',
  selectTemplate: 'Select a template',
  meetingMinutes: 'Meeting minutes',
  selectNoteFocusMindmap: 'Select a note to focus the mindmap',
  noLinkedNotesYet: 'No linked notes yet',
  noOrganizationsReturned: 'No organizations returned for your Myelin account.',
  failedLoadOrganizations: 'Failed to load organizations — reconnect SSO or add a personal API token in Profile',
  networkErrorLoadingOrganizations: 'Network error while loading organizations',
  failedLoadProjects: 'Failed to load projects',
  linkedMyelinProjectName: 'Linked Myelin project “{name}”',
  linkedMyelinProjectId: 'Linked Myelin project #{id}',
  alreadyLinkedAsMyelin: 'Already linked as Myelin #{id}',
  createdMyelinTask: 'Created Myelin task #{id}',
  linkedToMyelin: 'Linked to Myelin #{id}',
  unlinkedFromMyelin: 'Unlinked from Myelin #{id}',
  bulkCreateFailed: 'Bulk create failed',
  creatingMissingTasks: 'Creating missing tasks…',
  preparingCreateTasks: 'Preparing to create up to {count} task(s)…',
  bulkCreateSummary: 'Created {created}, skipped {skipped}, failed {failed}',
  bulkCreateErrorsSuffix: ' · {count} error(s)',
  grantedRoleToUser: 'Granted {role} to {username}',
  addedUsersAsRole: 'Added {added} user(s) as {role}',
  alreadyMembersSuffix: ' · {count} already members',
  syncedOneTaskFromMyelin: 'Synced 1 task from Myelin',
  syncedTasksFromMyelin: 'Synced {count} tasks from Myelin',
  clearedOneStaleMyelinLink: 'Cleared 1 stale Myelin link',
  clearedStaleMyelinLinks: 'Cleared {count} stale Myelin links',
  estimatesAlreadyUpToDate: 'Estimates already up to date · {hours}h total',
  noTaskHoursToRecalculate: 'No task hours to recalculate',
  updatedEstimate: 'Updated estimate ({catCount} tasks + Total) · {hours}h',
  failedSuggestTodos: 'Failed to suggest todos',
  networkErrorOllama: 'Network error talking to Synapse / Ollama',
  chooseKeptTodoForMerge: 'Choose a kept existing todo for each merge',
  failedApplyTodos: 'Failed to apply todos',
  failedLoadShares: 'Failed to load shares',
  failedCreateShare: 'Failed to create share',
  failedRevokeShare: 'Failed to revoke share',
  transferFailed: 'Transfer failed',
  sent: 'Sent',
  autoAssignOn: 'New Myelin tasks will be assigned to you',
  autoAssignOff: 'New Myelin tasks stay unassigned',
  createdInOtherVault: 'Created “{title}” in the other vault',
  createdAndLinked: 'Created and linked “{title}”',
  tasksUpdatedHub: 'Tasks updated · {added} added · {removed} removed · {updated} kept',
  autoLinkSummary: 'Auto-linked {linked} checkbox(es) by description',
  autoLinkDetailed: 'Auto-linked {linked} · {unmatched} unmatched · {ambiguous} ambiguous{failedPart} — use Link / create for the rest',
  syncUsersSummary: 'Created {created}, updated {updated}, linked {linked}, skipped {skipped}, failed {failed}',
  failedCountSuffix: ' · {count} failed',
  noteMovedDestination: 'Note moved to destination vault',
  noteCopiedDestination: 'Note copied to destination vault',
  networkErrorListingOllama: 'Network error listing Ollama models',
  networkErrorListingOpenai: 'Network error listing OpenAI models',
  connectionOk: 'OK',
  uploadedNamed: 'Uploaded {name}',
  couldNotReadImage: 'Could not read image',
  failedListModels: 'Failed to list models',
};

export const statusPt: StatusMessages = {
  networkError: 'Erro de rede',
  deleteFailed: 'Falha ao eliminar',
  failedToLoadTemplates: 'Falha ao carregar modelos',
  uploadFailed: 'Falha no envio',
  updateFailed: 'Falha na actualização',
  saveFailed: 'Falha ao guardar',
  createFailed: 'Falha ao criar',
  exportFailed: 'Falha na exportação',
  loginFailed: 'Falha no início de sessão',
  registrationFailed: 'Falha no registo',
  resetFailed: 'Falha no restabelecimento',
  failedToLoad: 'Falha ao carregar',
  failedToCreateVault: 'Falha ao criar o cofre',
  failedToLoadWikis: 'Falha ao carregar wikis',
  failedToLoadSettings: 'Falha ao carregar definições',
  failedToLoadProfile: 'Falha ao carregar o perfil',
  failedToLoadNote: 'Falha ao carregar a nota',
  failedToLoadAttachments: 'Falha ao carregar anexos',
  failedToLoadFlashcards: 'Falha ao carregar flashcards',
  failedToLoadMembers: 'Falha ao carregar membros',
  failedToLoadMyelinTasks: 'Falha ao carregar tarefas Myelin',
  networkErrorLoadingMyelinTasks: 'Erro de rede ao carregar tarefas Myelin',
  networkErrorBulkCreate: 'Erro de rede durante a criação em lote',
  saveFailedBeforeExport: 'Falha ao guardar — corrija os erros antes de exportar',
  failedDownloadMarkdown: 'Falha ao descarregar Markdown',
  failedOpenPrintWindow: 'Falha ao abrir a janela de impressão',
  failedOpenPrintDialog: 'Falha ao abrir o diálogo de impressão',
  openVaultNoteToUpload: 'Abra uma nota do cofre para enviar ficheiros',
  unsupportedFileType: 'Tipo de ficheiro não suportado',
  imageInserted: 'Imagem inserida',
  attachmentInserted: 'Anexo inserido',
  attachmentRemoved: 'Anexo removido',
  pullOnlyOverview: 'Esta vista geral é só de leitura (pull). Use Actualizar tarefas acima.',
  saveBeforeUpdatingTasks: 'Guarde a nota antes de actualizar tarefas',
  saveBeforeCreatingTasks: 'Guarde a nota antes de criar tarefas',
  saveBeforeLinkingTasks: 'Guarde a nota antes de associar tarefas',
  markedOpen: 'Marcada como aberta',
  markedDone: 'Marcada como concluída',
  couldNotUpdateCheckbox: 'Não foi possível actualizar a caixa de verificação',
  couldNotCreateTask: 'Não foi possível criar a tarefa',
  couldNotLinkTask: 'Não foi possível associar a tarefa',
  couldNotUnlinkTask: 'Não foi possível desassociar a tarefa',
  linkMyelinInVaultSettings: 'Associe primeiro um projecto Myelin nas definições do cofre',
  linkMyelinProjectFirst: 'Associe primeiro um projecto Myelin',
  pickOrgFirst: 'Escolha primeiro uma organização',
  creatingProject: 'A criar projecto…',
  alreadyLinked: 'Já associado',
  failedCreateProject: 'Falha ao criar o projecto',
  orgAndProjectRequired: 'Organização e projecto obrigatórios',
  linkFailed: 'Falha na associação',
  projectUnlinked: 'Projecto desassociado do cofre',
  unlinkFailed: 'Falha ao desassociar',
  creatingTask: 'A criar tarefa…',
  linkingTask: 'A associar tarefa…',
  unlinking: 'A desassociar…',
  noMissingTasks: 'Sem tarefas em falta — todas as caixas já estão associadas',
  selectNoteFirst: 'Seleccione primeiro uma nota',
  noUnlinkedCheckboxes: 'Sem caixas de verificação desassociadas nessa nota',
  matchingMyelinByDescription: 'A corresponder tarefas Myelin pela descrição…',
  autoLinkFailed: 'Falha na associação automática',
  aiTodoSuggestionsFailed: 'Falha nas sugestões de tarefas por IA',
  estimatesUpdatedSaveFailed: 'Estimativas actualizadas no editor, mas falhou ao guardar — guarde antes de exportar',
  todosUpdatedSaveFailed: 'Tarefas actualizadas no editor, mas falhou ao guardar — guarde manualmente',
  frontmatterTodosUpdatedAi: 'Tarefas do frontmatter actualizadas a partir das sugestões de IA',
  writeAnswerFirst: 'Escreva primeiro uma resposta',
  failedSubmit: 'Falha ao submeter',
  failedSaveDecision: 'Falha ao guardar a decisão',
  failedUpdateLock: 'Falha ao actualizar o bloqueio',
  onlyDeleteOwnPendingAnswers: 'Só pode eliminar as suas próprias respostas pendentes neste navegador',
  onlyEditOwnPendingAnswers: 'Só pode editar as suas próprias respostas pendentes neste navegador',
  couldNotCopyClipboard: 'Não foi possível copiar para a área de transferência',
  flashcardShareCreated: 'Ligação de partilha de flashcards criada',
  shareLinkCreated: 'Ligação de partilha criada',
  shareRevoked: 'Partilha revogada',
  couldNotAddMember: 'Não foi possível adicionar o membro',
  removeFailed: 'Falha ao remover',
  couldNotAddAllUsers: 'Não foi possível adicionar todos os utilizadores',
  ownershipTransferFailed: 'Falha na transferência de propriedade',
  labelAndDocxRequired: 'Etiqueta e ficheiro .docx são obrigatórios',
  testFailed: 'Teste falhou',
  actionFailed: 'Acção falhou',
  failedCreateGlobalTemplate: 'Falha ao criar o modelo global',
  syncFailed: 'Falha na sincronização',
  genericFailed: 'Falhou',
  noProfileChanges: 'Sem alterações de perfil para guardar',
  profileSaved: 'Perfil guardado',
  failedSaveAutoAssign: 'Falha ao guardar a preferência de atribuição automática',
  enterApiTokenOrClear: 'Introduza um token API pessoal ou marque Limpar',
  couldNotSaveApiToken: 'Não foi possível guardar o token API',
  apiTokenCleared: 'Token API pessoal limpo',
  apiTokenSaved: 'Token API pessoal guardado',
  connectionTestFailed: 'Teste de ligação falhou',
  connected: 'Ligado',
  enterNewPassword: 'Introduza uma nova palavra-passe',
  passwordsDoNotMatch: 'As novas palavras-passe não coincidem',
  currentPasswordRequired: 'A palavra-passe actual é obrigatória',
  passwordUpdateFailed: 'Falha ao actualizar a palavra-passe',
  passwordUpdated: 'Palavra-passe actualizada',
  localPasswordSet: 'Palavra-passe local definida',
  templateSaved: 'Modelo guardado',
  createdPersonalTemplate: 'Modelo pessoal criado',
  shareRequestFailed: 'Pedido de partilha falhou',
  shareRequestedPending: 'Partilha pedida — a aguardar aprovação do administrador',
  withdrawFailed: 'Falha ao retirar',
  templatePrivateAgain: 'O modelo voltou a ser privado',
  templateDeleted: 'Modelo eliminado',
  noteRequiresSignIn: 'Esta nota exige início de sessão. Inicie sessão com Myelin e recarregue.',
  noteUnavailable: 'Nota indisponível',
  notFound: 'Não encontrado',
  graphUnavailable: 'Grafo indisponível',
  autosaving: 'A autoguardar…',
  autosaved: 'Autoguardado',
  saved: 'Guardado',
  couldNotRefreshMyelin: 'Não foi possível actualizar as tarefas Myelin',
  whiteboardMovedTrash: 'Quadro branco movido para o lixo',
  noteMovedTrash: 'Nota movida para o lixo',
  couldNotLoadRevision: 'Não foi possível carregar a revisão',
  restored: 'Restaurada',
  restoreFailed: 'Falha na restauração',
  publicWikiDisabled: 'Wiki pública desactivada',
  failedDisablePublicWiki: 'Falha ao desactivar a wiki pública',
  publicWikiEnabled: 'Wiki pública activada',
  failedEnablePublicWiki: 'Falha ao activar a wiki pública',
  failedUpdatePublicWiki: 'Falha ao actualizar a wiki pública',
  currentNoteDirectLinks: 'Nota actual + ligações directas',
  currentNoteLinks: 'Nota actual + ligações',
  noWikisMatch: 'Nenhuma wiki corresponde a «{query}».',
  noWikisMatchFilter: 'Nenhuma wiki corresponde ao filtro.',
  noWikisVisibleYet: 'Ainda não há wikis visíveis. Active a wiki pública num cofre e publique notas, ou abra o directório completo.',
  noTemplates: 'Sem modelos',
  selectTemplate: 'Seleccione um modelo',
  meetingMinutes: 'Acta da reunião',
  selectNoteFocusMindmap: 'Seleccione uma nota para focar o mapa mental',
  noLinkedNotesYet: 'Ainda sem notas ligadas',
  noOrganizationsReturned: 'Nenhuma organização devolvida para a sua conta Myelin.',
  failedLoadOrganizations: 'Falha ao carregar organizações — volte a ligar o SSO ou adicione um token API pessoal no Perfil',
  networkErrorLoadingOrganizations: 'Erro de rede ao carregar organizações',
  failedLoadProjects: 'Falha ao carregar projectos',
  linkedMyelinProjectName: 'Projecto Myelin «{name}» associado',
  linkedMyelinProjectId: 'Projecto Myelin #{id} associado',
  alreadyLinkedAsMyelin: 'Já associado como Myelin #{id}',
  createdMyelinTask: 'Tarefa Myelin #{id} criada',
  linkedToMyelin: 'Associada ao Myelin #{id}',
  unlinkedFromMyelin: 'Desassociada do Myelin #{id}',
  bulkCreateFailed: 'Falha na criação em lote',
  creatingMissingTasks: 'A criar tarefas em falta…',
  preparingCreateTasks: 'A preparar a criação de até {count} tarefa(s)…',
  bulkCreateSummary: 'Criadas {created}, ignoradas {skipped}, falhadas {failed}',
  bulkCreateErrorsSuffix: ' · {count} erro(s)',
  grantedRoleToUser: 'Concedido {role} a {username}',
  addedUsersAsRole: 'Adicionados {added} utilizador(es) como {role}',
  alreadyMembersSuffix: ' · {count} já eram membros',
  syncedOneTaskFromMyelin: '1 tarefa sincronizada a partir do Myelin',
  syncedTasksFromMyelin: '{count} tarefas sincronizadas a partir do Myelin',
  clearedOneStaleMyelinLink: '1 ligação Myelin obsoleta limpa',
  clearedStaleMyelinLinks: '{count} ligações Myelin obsoletas limpas',
  estimatesAlreadyUpToDate: 'Estimativas já actualizadas · {hours}h no total',
  noTaskHoursToRecalculate: 'Sem horas de tarefa para recalcular',
  updatedEstimate: 'Estimativa actualizada ({catCount} tarefas + Total) · {hours}h',
  failedSuggestTodos: 'Falha ao sugerir tarefas',
  networkErrorOllama: 'Erro de rede ao falar com Synapse / Ollama',
  chooseKeptTodoForMerge: 'Escolha uma tarefa existente a manter para cada fusão',
  failedApplyTodos: 'Falha ao aplicar tarefas',
  failedLoadShares: 'Falha ao carregar partilhas',
  failedCreateShare: 'Falha ao criar a partilha',
  failedRevokeShare: 'Falha ao revogar a partilha',
  transferFailed: 'Falha na transferência',
  sent: 'Enviado',
  autoAssignOn: 'As novas tarefas Myelin serão atribuídas a si',
  autoAssignOff: 'As novas tarefas Myelin ficam sem atribuição',
  createdInOtherVault: 'Criada «{title}» no outro cofre',
  createdAndLinked: 'Criada e associada «{title}»',
  tasksUpdatedHub: 'Tarefas actualizadas · {added} adicionadas · {removed} removidas · {updated} mantidas',
  autoLinkSummary: 'Associadas automaticamente {linked} caixa(s) pela descrição',
  autoLinkDetailed: 'Associadas automaticamente {linked} · {unmatched} sem correspondência · {ambiguous} ambíguas{failedPart} — use Associar / criar para o resto',
  syncUsersSummary: 'Criados {created}, actualizados {updated}, associados {linked}, ignorados {skipped}, falhados {failed}',
  failedCountSuffix: ' · {count} falharam',
  noteMovedDestination: 'Nota movida para o cofre de destino',
  noteCopiedDestination: 'Nota copiada para o cofre de destino',
  networkErrorListingOllama: 'Erro de rede ao listar modelos Ollama',
  networkErrorListingOpenai: 'Erro de rede ao listar modelos OpenAI',
  connectionOk: 'OK',
  uploadedNamed: 'Enviado {name}',
  couldNotReadImage: 'Não foi possível ler a imagem',
  failedListModels: 'Falha ao listar modelos',
};

export const statusEs: StatusMessages = {
  networkError: 'Error de red',
  deleteFailed: 'Error al eliminar',
  failedToLoadTemplates: 'Error al cargar plantillas',
  uploadFailed: 'Error al subir',
  updateFailed: 'Error al actualizar',
  saveFailed: 'Error al guardar',
  createFailed: 'Error al crear',
  exportFailed: 'Error al exportar',
  loginFailed: 'Error al iniciar sesión',
  registrationFailed: 'Error en el registro',
  resetFailed: 'Error al restablecer',
  failedToLoad: 'Error al cargar',
  failedToCreateVault: 'Error al crear la bóveda',
  failedToLoadWikis: 'Error al cargar wikis',
  failedToLoadSettings: 'Error al cargar ajustes',
  failedToLoadProfile: 'Error al cargar el perfil',
  failedToLoadNote: 'Error al cargar la nota',
  failedToLoadAttachments: 'Error al cargar adjuntos',
  failedToLoadFlashcards: 'Error al cargar flashcards',
  failedToLoadMembers: 'Error al cargar miembros',
  failedToLoadMyelinTasks: 'Error al cargar tareas Myelin',
  networkErrorLoadingMyelinTasks: 'Error de red al cargar tareas Myelin',
  networkErrorBulkCreate: 'Error de red durante la creación masiva',
  saveFailedBeforeExport: 'Error al guardar — corrija los errores antes de exportar',
  failedDownloadMarkdown: 'Error al descargar Markdown',
  failedOpenPrintWindow: 'Error al abrir la ventana de impresión',
  failedOpenPrintDialog: 'Error al abrir el diálogo de impresión',
  openVaultNoteToUpload: 'Abra una nota de la bóveda para subir ficheros',
  unsupportedFileType: 'Tipo de fichero no compatible',
  imageInserted: 'Imagen insertada',
  attachmentInserted: 'Adjunto insertado',
  attachmentRemoved: 'Adjunto eliminado',
  pullOnlyOverview: 'Esta vista general es solo de lectura (pull). Use Actualizar tareas arriba.',
  saveBeforeUpdatingTasks: 'Guarde la nota antes de actualizar tareas',
  saveBeforeCreatingTasks: 'Guarde la nota antes de crear tareas',
  saveBeforeLinkingTasks: 'Guarde la nota antes de vincular tareas',
  markedOpen: 'Marcada como abierta',
  markedDone: 'Marcada como hecha',
  couldNotUpdateCheckbox: 'No se pudo actualizar la casilla',
  couldNotCreateTask: 'No se pudo crear la tarea',
  couldNotLinkTask: 'No se pudo vincular la tarea',
  couldNotUnlinkTask: 'No se pudo desvincular la tarea',
  linkMyelinInVaultSettings: 'Vincule primero un proyecto Myelin en Ajustes de la bóveda',
  linkMyelinProjectFirst: 'Vincule primero un proyecto Myelin',
  pickOrgFirst: 'Elija primero una organización',
  creatingProject: 'Creando proyecto…',
  alreadyLinked: 'Ya vinculado',
  failedCreateProject: 'Error al crear el proyecto',
  orgAndProjectRequired: 'Organización y proyecto obligatorios',
  linkFailed: 'Error al vincular',
  projectUnlinked: 'Proyecto desvinculado de la bóveda',
  unlinkFailed: 'Error al desvincular',
  creatingTask: 'Creando tarea…',
  linkingTask: 'Vinculando tarea…',
  unlinking: 'Desvinculando…',
  noMissingTasks: 'No faltan tareas — todas las casillas ya están vinculadas',
  selectNoteFirst: 'Seleccione primero una nota',
  noUnlinkedCheckboxes: 'No hay casillas desvinculadas en esa nota',
  matchingMyelinByDescription: 'Emparejando tareas Myelin por descripción…',
  autoLinkFailed: 'Error en la vinculación automática',
  aiTodoSuggestionsFailed: 'Error en las sugerencias de tareas por IA',
  estimatesUpdatedSaveFailed: 'Estimaciones actualizadas en el editor, pero falló al guardar — guarde antes de exportar',
  todosUpdatedSaveFailed: 'Tareas actualizadas en el editor, pero falló al guardar — guarde manualmente',
  frontmatterTodosUpdatedAi: 'Tareas del frontmatter actualizadas desde sugerencias de IA',
  writeAnswerFirst: 'Escriba primero una respuesta',
  failedSubmit: 'Error al enviar',
  failedSaveDecision: 'Error al guardar la decisión',
  failedUpdateLock: 'Error al actualizar el bloqueo',
  onlyDeleteOwnPendingAnswers: 'Solo puede eliminar sus propias respuestas pendientes en este navegador',
  onlyEditOwnPendingAnswers: 'Solo puede editar sus propias respuestas pendientes en este navegador',
  couldNotCopyClipboard: 'No se pudo copiar al portapapeles',
  flashcardShareCreated: 'Enlace de compartición de flashcards creado',
  shareLinkCreated: 'Enlace de compartición creado',
  shareRevoked: 'Compartición revocada',
  couldNotAddMember: 'No se pudo añadir el miembro',
  removeFailed: 'Error al quitar',
  couldNotAddAllUsers: 'No se pudo añadir a todos los usuarios',
  ownershipTransferFailed: 'Error al transferir la propiedad',
  labelAndDocxRequired: 'Se requieren etiqueta y fichero .docx',
  testFailed: 'Prueba fallida',
  actionFailed: 'Acción fallida',
  failedCreateGlobalTemplate: 'Error al crear la plantilla global',
  syncFailed: 'Error de sincronización',
  genericFailed: 'Error',
  noProfileChanges: 'No hay cambios de perfil que guardar',
  profileSaved: 'Perfil guardado',
  failedSaveAutoAssign: 'Error al guardar la preferencia de autoasignación',
  enterApiTokenOrClear: 'Introduzca un token API personal o marque Borrar',
  couldNotSaveApiToken: 'No se pudo guardar el token API',
  apiTokenCleared: 'Token API personal borrado',
  apiTokenSaved: 'Token API personal guardado',
  connectionTestFailed: 'Prueba de conexión fallida',
  connected: 'Conectado',
  enterNewPassword: 'Introduzca una contraseña nueva',
  passwordsDoNotMatch: 'Las contraseñas nuevas no coinciden',
  currentPasswordRequired: 'Se requiere la contraseña actual',
  passwordUpdateFailed: 'Error al actualizar la contraseña',
  passwordUpdated: 'Contraseña actualizada',
  localPasswordSet: 'Contraseña local establecida',
  templateSaved: 'Plantilla guardada',
  createdPersonalTemplate: 'Plantilla personal creada',
  shareRequestFailed: 'Error en la solicitud de compartición',
  shareRequestedPending: 'Compartición solicitada — a la espera de aprobación del administrador',
  withdrawFailed: 'Error al retirar',
  templatePrivateAgain: 'La plantilla vuelve a ser privada',
  templateDeleted: 'Plantilla eliminada',
  noteRequiresSignIn: 'Esta nota requiere iniciar sesión. Inicie sesión con Myelin y recargue.',
  noteUnavailable: 'Nota no disponible',
  notFound: 'No encontrado',
  graphUnavailable: 'Grafo no disponible',
  autosaving: 'Autoguardando…',
  autosaved: 'Autoguardado',
  saved: 'Guardado',
  couldNotRefreshMyelin: 'No se pudieron actualizar las tareas Myelin',
  whiteboardMovedTrash: 'Pizarra movida a la papelera',
  noteMovedTrash: 'Nota movida a la papelera',
  couldNotLoadRevision: 'No se pudo cargar la revisión',
  restored: 'Restaurada',
  restoreFailed: 'Error al restaurar',
  publicWikiDisabled: 'Wiki pública desactivada',
  failedDisablePublicWiki: 'Error al desactivar la wiki pública',
  publicWikiEnabled: 'Wiki pública activada',
  failedEnablePublicWiki: 'Error al activar la wiki pública',
  failedUpdatePublicWiki: 'Error al actualizar la wiki pública',
  currentNoteDirectLinks: 'Nota actual + enlaces directos',
  currentNoteLinks: 'Nota actual + enlaces',
  noWikisMatch: 'Ninguna wiki coincide con «{query}».',
  noWikisMatchFilter: 'Ninguna wiki coincide con el filtro.',
  noWikisVisibleYet: 'Aún no hay wikis visibles. Active la wiki pública en una bóveda y publique notas, o abra el directorio completo.',
  noTemplates: 'Sin plantillas',
  selectTemplate: 'Seleccione una plantilla',
  meetingMinutes: 'Acta de la reunión',
  selectNoteFocusMindmap: 'Seleccione una nota para enfocar el mapa mental',
  noLinkedNotesYet: 'Aún no hay notas vinculadas',
  noOrganizationsReturned: 'No se devolvieron organizaciones para su cuenta Myelin.',
  failedLoadOrganizations: 'Error al cargar organizaciones — vuelva a conectar el SSO o añada un token API personal en Perfil',
  networkErrorLoadingOrganizations: 'Error de red al cargar organizaciones',
  failedLoadProjects: 'Error al cargar proyectos',
  linkedMyelinProjectName: 'Proyecto Myelin «{name}» vinculado',
  linkedMyelinProjectId: 'Proyecto Myelin #{id} vinculado',
  alreadyLinkedAsMyelin: 'Ya vinculado como Myelin #{id}',
  createdMyelinTask: 'Tarea Myelin #{id} creada',
  linkedToMyelin: 'Vinculada a Myelin #{id}',
  unlinkedFromMyelin: 'Desvinculada de Myelin #{id}',
  bulkCreateFailed: 'Error en la creación masiva',
  creatingMissingTasks: 'Creando tareas faltantes…',
  preparingCreateTasks: 'Preparando la creación de hasta {count} tarea(s)…',
  bulkCreateSummary: 'Creadas {created}, omitidas {skipped}, fallidas {failed}',
  bulkCreateErrorsSuffix: ' · {count} error(es)',
  grantedRoleToUser: 'Concedido {role} a {username}',
  addedUsersAsRole: 'Añadidos {added} usuario(s) como {role}',
  alreadyMembersSuffix: ' · {count} ya eran miembros',
  syncedOneTaskFromMyelin: '1 tarea sincronizada desde Myelin',
  syncedTasksFromMyelin: '{count} tareas sincronizadas desde Myelin',
  clearedOneStaleMyelinLink: '1 enlace Myelin obsoleto eliminado',
  clearedStaleMyelinLinks: '{count} enlaces Myelin obsoletos eliminados',
  estimatesAlreadyUpToDate: 'Estimaciones ya actualizadas · {hours}h en total',
  noTaskHoursToRecalculate: 'No hay horas de tarea que recalcular',
  updatedEstimate: 'Estimación actualizada ({catCount} tareas + Total) · {hours}h',
  failedSuggestTodos: 'Error al sugerir tareas',
  networkErrorOllama: 'Error de red al hablar con Synapse / Ollama',
  chooseKeptTodoForMerge: 'Elija una tarea existente que conservar para cada fusión',
  failedApplyTodos: 'Error al aplicar tareas',
  failedLoadShares: 'Error al cargar comparticiones',
  failedCreateShare: 'Error al crear la compartición',
  failedRevokeShare: 'Error al revocar la compartición',
  transferFailed: 'Error en la transferencia',
  sent: 'Enviado',
  autoAssignOn: 'Las nuevas tareas Myelin se le asignarán a usted',
  autoAssignOff: 'Las nuevas tareas Myelin quedan sin asignar',
  createdInOtherVault: 'Creada «{title}» en la otra bóveda',
  createdAndLinked: 'Creada y vinculada «{title}»',
  tasksUpdatedHub: 'Tareas actualizadas · {added} añadidas · {removed} eliminadas · {updated} mantenidas',
  autoLinkSummary: 'Vinculadas automáticamente {linked} casilla(s) por descripción',
  autoLinkDetailed: 'Vinculadas automáticamente {linked} · {unmatched} sin coincidencia · {ambiguous} ambiguas{failedPart} — use Vincular / crear para el resto',
  syncUsersSummary: 'Creados {created}, actualizados {updated}, vinculados {linked}, omitidos {skipped}, fallidos {failed}',
  failedCountSuffix: ' · {count} fallaron',
  noteMovedDestination: 'Nota movida a la bóveda de destino',
  noteCopiedDestination: 'Nota copiada a la bóveda de destino',
  networkErrorListingOllama: 'Error de red al listar modelos Ollama',
  networkErrorListingOpenai: 'Error de red al listar modelos OpenAI',
  connectionOk: 'OK',
  uploadedNamed: 'Subido {name}',
  couldNotReadImage: 'No se pudo leer la imagen',
  failedListModels: 'Error al listar modelos',
};

export const statusFr: StatusMessages = {
  networkError: 'Erreur réseau',
  deleteFailed: 'Échec de la suppression',
  failedToLoadTemplates: 'Échec du chargement des modèles',
  uploadFailed: 'Échec du téléversement',
  updateFailed: 'Échec de la mise à jour',
  saveFailed: 'Échec de l’enregistrement',
  createFailed: 'Échec de la création',
  exportFailed: 'Échec de l’export',
  loginFailed: 'Échec de la connexion',
  registrationFailed: 'Échec de l’inscription',
  resetFailed: 'Échec de la réinitialisation',
  failedToLoad: 'Échec du chargement',
  failedToCreateVault: 'Échec de la création du coffre',
  failedToLoadWikis: 'Échec du chargement des wikis',
  failedToLoadSettings: 'Échec du chargement des paramètres',
  failedToLoadProfile: 'Échec du chargement du profil',
  failedToLoadNote: 'Échec du chargement de la note',
  failedToLoadAttachments: 'Échec du chargement des pièces jointes',
  failedToLoadFlashcards: 'Échec du chargement des flashcards',
  failedToLoadMembers: 'Échec du chargement des membres',
  failedToLoadMyelinTasks: 'Échec du chargement des tâches Myelin',
  networkErrorLoadingMyelinTasks: 'Erreur réseau lors du chargement des tâches Myelin',
  networkErrorBulkCreate: 'Erreur réseau pendant la création en masse',
  saveFailedBeforeExport: 'Échec de l’enregistrement — corrigez les erreurs avant d’exporter',
  failedDownloadMarkdown: 'Échec du téléchargement Markdown',
  failedOpenPrintWindow: 'Échec de l’ouverture de la fenêtre d’impression',
  failedOpenPrintDialog: 'Échec de l’ouverture de la boîte de dialogue d’impression',
  openVaultNoteToUpload: 'Ouvrez une note du coffre pour téléverser des fichiers',
  unsupportedFileType: 'Type de fichier non pris en charge',
  imageInserted: 'Image insérée',
  attachmentInserted: 'Pièce jointe insérée',
  attachmentRemoved: 'Pièce jointe supprimée',
  pullOnlyOverview: 'Cette vue d’ensemble est en lecture seule (pull). Utilisez Actualiser les tâches ci-dessus.',
  saveBeforeUpdatingTasks: 'Enregistrez la note avant de mettre à jour les tâches',
  saveBeforeCreatingTasks: 'Enregistrez la note avant de créer des tâches',
  saveBeforeLinkingTasks: 'Enregistrez la note avant de lier des tâches',
  markedOpen: 'Marquée ouverte',
  markedDone: 'Marquée terminée',
  couldNotUpdateCheckbox: 'Impossible de mettre à jour la case',
  couldNotCreateTask: 'Impossible de créer la tâche',
  couldNotLinkTask: 'Impossible de lier la tâche',
  couldNotUnlinkTask: 'Impossible de délier la tâche',
  linkMyelinInVaultSettings: 'Liez d’abord un projet Myelin dans les paramètres du coffre',
  linkMyelinProjectFirst: 'Liez d’abord un projet Myelin',
  pickOrgFirst: 'Choisissez d’abord une organisation',
  creatingProject: 'Création du projet…',
  alreadyLinked: 'Déjà lié',
  failedCreateProject: 'Échec de la création du projet',
  orgAndProjectRequired: 'Organisation et projet requis',
  linkFailed: 'Échec de la liaison',
  projectUnlinked: 'Projet délié du coffre',
  unlinkFailed: 'Échec du déliage',
  creatingTask: 'Création de la tâche…',
  linkingTask: 'Liaison de la tâche…',
  unlinking: 'Déliage…',
  noMissingTasks: 'Aucune tâche manquante — toutes les cases sont déjà liées',
  selectNoteFirst: 'Sélectionnez d’abord une note',
  noUnlinkedCheckboxes: 'Aucune case non liée dans cette note',
  matchingMyelinByDescription: 'Correspondance des tâches Myelin par description…',
  autoLinkFailed: 'Échec de la liaison automatique',
  aiTodoSuggestionsFailed: 'Échec des suggestions de tâches par IA',
  estimatesUpdatedSaveFailed: 'Estimations mises à jour dans l’éditeur, mais échec de l’enregistrement — enregistrez avant d’exporter',
  todosUpdatedSaveFailed: 'Tâches mises à jour dans l’éditeur, mais échec de l’enregistrement — enregistrez manuellement',
  frontmatterTodosUpdatedAi: 'Tâches du frontmatter mises à jour à partir des suggestions IA',
  writeAnswerFirst: 'Écrivez d’abord une réponse',
  failedSubmit: 'Échec de l’envoi',
  failedSaveDecision: 'Échec de l’enregistrement de la décision',
  failedUpdateLock: 'Échec de la mise à jour du verrou',
  onlyDeleteOwnPendingAnswers: 'Vous ne pouvez supprimer que vos propres réponses en attente depuis ce navigateur',
  onlyEditOwnPendingAnswers: 'Vous ne pouvez modifier que vos propres réponses en attente depuis ce navigateur',
  couldNotCopyClipboard: 'Impossible de copier dans le presse-papiers',
  flashcardShareCreated: 'Lien de partage de flashcards créé',
  shareLinkCreated: 'Lien de partage créé',
  shareRevoked: 'Partage révoqué',
  couldNotAddMember: 'Impossible d’ajouter le membre',
  removeFailed: 'Échec de la suppression',
  couldNotAddAllUsers: 'Impossible d’ajouter tous les utilisateurs',
  ownershipTransferFailed: 'Échec du transfert de propriété',
  labelAndDocxRequired: 'Libellé et fichier .docx requis',
  testFailed: 'Échec du test',
  actionFailed: 'Échec de l’action',
  failedCreateGlobalTemplate: 'Échec de la création du modèle global',
  syncFailed: 'Échec de la synchronisation',
  genericFailed: 'Échec',
  noProfileChanges: 'Aucun changement de profil à enregistrer',
  profileSaved: 'Profil enregistré',
  failedSaveAutoAssign: 'Échec de l’enregistrement de la préférence d’auto-affectation',
  enterApiTokenOrClear: 'Saisissez un jeton API personnel ou cochez Effacer',
  couldNotSaveApiToken: 'Impossible d’enregistrer le jeton API',
  apiTokenCleared: 'Jeton API personnel effacé',
  apiTokenSaved: 'Jeton API personnel enregistré',
  connectionTestFailed: 'Échec du test de connexion',
  connected: 'Connecté',
  enterNewPassword: 'Saisissez un nouveau mot de passe',
  passwordsDoNotMatch: 'Les nouveaux mots de passe ne correspondent pas',
  currentPasswordRequired: 'Le mot de passe actuel est requis',
  passwordUpdateFailed: 'Échec de la mise à jour du mot de passe',
  passwordUpdated: 'Mot de passe mis à jour',
  localPasswordSet: 'Mot de passe local défini',
  templateSaved: 'Modèle enregistré',
  createdPersonalTemplate: 'Modèle personnel créé',
  shareRequestFailed: 'Échec de la demande de partage',
  shareRequestedPending: 'Partage demandé — en attente d’approbation de l’administrateur',
  withdrawFailed: 'Échec du retrait',
  templatePrivateAgain: 'Le modèle est de nouveau privé',
  templateDeleted: 'Modèle supprimé',
  noteRequiresSignIn: 'Cette note nécessite une connexion. Connectez-vous avec Myelin, puis rechargez.',
  noteUnavailable: 'Note indisponible',
  notFound: 'Introuvable',
  graphUnavailable: 'Graphe indisponible',
  autosaving: 'Enregistrement automatique…',
  autosaved: 'Enregistré automatiquement',
  saved: 'Enregistré',
  couldNotRefreshMyelin: 'Impossible d’actualiser les tâches Myelin',
  whiteboardMovedTrash: 'Tableau blanc déplacé vers la corbeille',
  noteMovedTrash: 'Note déplacée vers la corbeille',
  couldNotLoadRevision: 'Impossible de charger la révision',
  restored: 'Restaurée',
  restoreFailed: 'Échec de la restauration',
  publicWikiDisabled: 'Wiki public désactivé',
  failedDisablePublicWiki: 'Échec de la désactivation du wiki public',
  publicWikiEnabled: 'Wiki public activé',
  failedEnablePublicWiki: 'Échec de l’activation du wiki public',
  failedUpdatePublicWiki: 'Échec de la mise à jour du wiki public',
  currentNoteDirectLinks: 'Note actuelle + liens directs',
  currentNoteLinks: 'Note actuelle + liens',
  noWikisMatch: 'Aucun wiki ne correspond à « {query} ».',
  noWikisMatchFilter: 'Aucun wiki ne correspond à votre filtre.',
  noWikisVisibleYet: 'Aucun wiki n’est encore visible. Activez le wiki public sur un coffre et publiez des notes, ou ouvrez l’annuaire complet.',
  noTemplates: 'Aucun modèle',
  selectTemplate: 'Sélectionnez un modèle',
  meetingMinutes: 'Compte rendu de réunion',
  selectNoteFocusMindmap: 'Sélectionnez une note pour centrer la carte mentale',
  noLinkedNotesYet: 'Aucune note liée pour l’instant',
  noOrganizationsReturned: 'Aucune organisation renvoyée pour votre compte Myelin.',
  failedLoadOrganizations: 'Échec du chargement des organisations — reconnectez le SSO ou ajoutez un jeton API personnel dans Profil',
  networkErrorLoadingOrganizations: 'Erreur réseau lors du chargement des organisations',
  failedLoadProjects: 'Échec du chargement des projets',
  linkedMyelinProjectName: 'Projet Myelin « {name} » lié',
  linkedMyelinProjectId: 'Projet Myelin #{id} lié',
  alreadyLinkedAsMyelin: 'Déjà lié comme Myelin #{id}',
  createdMyelinTask: 'Tâche Myelin #{id} créée',
  linkedToMyelin: 'Liée à Myelin #{id}',
  unlinkedFromMyelin: 'Déliée de Myelin #{id}',
  bulkCreateFailed: 'Échec de la création en masse',
  creatingMissingTasks: 'Création des tâches manquantes…',
  preparingCreateTasks: 'Préparation de la création jusqu’à {count} tâche(s)…',
  bulkCreateSummary: 'Créées {created}, ignorées {skipped}, échouées {failed}',
  bulkCreateErrorsSuffix: ' · {count} erreur(s)',
  grantedRoleToUser: 'Rôle {role} accordé à {username}',
  addedUsersAsRole: '{added} utilisateur(s) ajouté(s) en tant que {role}',
  alreadyMembersSuffix: ' · {count} déjà membres',
  syncedOneTaskFromMyelin: '1 tâche synchronisée depuis Myelin',
  syncedTasksFromMyelin: '{count} tâches synchronisées depuis Myelin',
  clearedOneStaleMyelinLink: '1 lien Myelin obsolète effacé',
  clearedStaleMyelinLinks: '{count} liens Myelin obsolètes effacés',
  estimatesAlreadyUpToDate: 'Estimations déjà à jour · {hours} h au total',
  noTaskHoursToRecalculate: 'Aucune heure de tâche à recalculer',
  updatedEstimate: 'Estimation mise à jour ({catCount} tâches + Total) · {hours} h',
  failedSuggestTodos: 'Échec de la suggestion de tâches',
  networkErrorOllama: 'Erreur réseau en communiquant avec Synapse / Ollama',
  chooseKeptTodoForMerge: 'Choisissez une tâche existante à conserver pour chaque fusion',
  failedApplyTodos: 'Échec de l’application des tâches',
  failedLoadShares: 'Échec du chargement des partages',
  failedCreateShare: 'Échec de la création du partage',
  failedRevokeShare: 'Échec de la révocation du partage',
  transferFailed: 'Échec du transfert',
  sent: 'Envoyé',
  autoAssignOn: 'Les nouvelles tâches Myelin vous seront assignées',
  autoAssignOff: 'Les nouvelles tâches Myelin restent non assignées',
  createdInOtherVault: '« {title} » créée dans l’autre coffre',
  createdAndLinked: '« {title} » créée et liée',
  tasksUpdatedHub: 'Tâches mises à jour · {added} ajoutées · {removed} retirées · {updated} conservées',
  autoLinkSummary: '{linked} case(s) liée(s) automatiquement par description',
  autoLinkDetailed: 'Liées automatiquement {linked} · {unmatched} sans correspondance · {ambiguous} ambiguës{failedPart} — utilisez Lier / créer pour le reste',
  syncUsersSummary: 'Créés {created}, mis à jour {updated}, liés {linked}, ignorés {skipped}, échoués {failed}',
  failedCountSuffix: ' · {count} ont échoué',
  noteMovedDestination: 'Note déplacée vers le coffre de destination',
  noteCopiedDestination: 'Note copiée vers le coffre de destination',
  networkErrorListingOllama: 'Erreur réseau lors de la liste des modèles Ollama',
  networkErrorListingOpenai: 'Erreur réseau lors de la liste des modèles OpenAI',
  connectionOk: 'OK',
  uploadedNamed: 'Téléversé {name}',
  couldNotReadImage: 'Impossible de lire l’image',
  failedListModels: 'Échec de la liste des modèles',
};
