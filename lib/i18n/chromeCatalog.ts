/** Vault workspace, editor, and shared modal chrome (pt/en/es/fr). */

export type ChromeMessages = {
  confirm: string;
  create: string;
  discardOpen: string;
  stay: string;
  jump: string;
  newNote: string;
  mindmap: string;
  editor: string;
  flashcards: string;
  cards: string;
  importZip: string;
  myelinTasks: string;
  publicWiki: string;
  enablePublicWiki: string;
  disablePublicWiki: string;
  filterNotes: string;
  filterNotesTitle: string;
  jumpTitle: string;
  quickSwitcherFooter: string;
  showMindmap: string;
  studyFlashcards: string;
  importZipTitle: string;
  closePanel: string;
  noteTitle: string;
  titlePlaceholder: string;
  titleHint: string;
  visibility: string;
  visPrivate: string;
  visAuthenticated: string;
  visUnlisted: string;
  visPublic: string;
  saveTitle: string;
  maximizeWhiteboard: string;
  exportNote: string;
  export: string;
  share: string;
  shareTitle: string;
  linkMyWork: string;
  linkMyWorkTitle: string;
  delete: string;
  deleteTitle: string;
  selectNote: string;
  info: string;
  references: string;
  backlinks: string;
  backlinksHint: string;
  noneYet: string;
  noAccess: string;
  history: string;
  focusedMindmap: string;
  saving: string;
  unsaved: string;
  accessSuffix: string;
  notes: string;
  moreActions: string;
  exitMaximize: string;
  unsavedTitle: string;
  unsavedMessage: string;
  trashTitle: string;
  trashMessage: string;
  importZipModalTitle: string;
  importZipMessage: string;
  importSkipExisting: string;
  importOverwrite: string;
  writeMarkdown: string;
  viewEdit: string;
  viewSplit: string;
  viewPreview: string;
  help: string;
  markdownLegend: string;
  bold: string;
  italic: string;
  wikilink: string;
  taskList: string;
  insertImage: string;
  attach: string;
  uploading: string;
  createNoteTitle: string;
  createWhiteboardTitle: string;
  manageTemplates: string;
  note: string;
  whiteboard: string;
  title: string;
  noMatchingTemplates: string;
  system: string;
  global: string;
  shared: string;
  shareModalTitle: string;
  shareFlashcard: string;
  temporaryLink: string;
  expires: string;
  requirePassword: string;
  close: string;
  linkTab: string;
  sendTab: string;
  searchVaults: string;
  exportModalTitle: string;
  tabMarkdown: string;
  tabPdf: string;
  tabWord: string;
  downloadMd: string;
  printPdf: string;
  noWordTemplates: string;
  compareRestore: string;
  onlyChanges: string;
  restoreAll: string;
  restoreChange: string;
  reviewAiTodos: string;
  analyzingAi: string;
  existingTodos: string;
  proposed: string;
  addAsNew: string;
  merge: string;
  discard: string;
  apply: string;
  vaultMyelin: string;
  myelinProject: string;
  checkboxTasks: string;
  unlinkMyelinTitle: string;
  vaultOptions: string;
  leaveVault: string;
  linkOrCreateTask: string;
  allProjects: string;
  searchTasks: string;
  removeAttachmentTitle: string;
  remove: string;
  templatesTitle: string;
  filterTemplates: string;
  mineOnly: string;
  newPersonalTemplate: string;
  publicWikis: string;
  filterWikis: string;
  allWikis: string;
  openVault: string;
  selectPublicNote: string;
  shareUnavailable: string;
  backSynapse: string;
  enterPassword: string;
  unlock: string;
  unlocking: string;
  noExpiry: string;
  installApp: string;
  installHintIosMenu: string;
  installHintDeferredMenu: string;
  installHintBrowserMenu: string;
  installHintIosBanner: string;
  installHintDeferredBanner: string;
  installHintBrowserBanner: string;
  installShort: string;
  installAction: string;
  notNow: string;
  linkedToPrefix: string;
  projectHashId: string;
  myelinProjectHashId: string;
  backToNotes: string;
  noMatchingNotes: string;
  noPublicNotes: string;
  browseNotes: string;
  linksFromThisNote: string;
  notesLinkedFromBoard: string;
  none: string;
  notesCount: string;
  noteCountOne: string;
  foldCardsEmptyWiki: string;
  publicWikisDirHint: string;
  noPublicWikisVisible: string;
  noPublicWikisSignIn: string;
  signedInUsers: string;
  myTemplateLabel: string;
  myTemplateDescription: string;
  vaultPmLinkHint: string;
  dismiss: string;
  reconnectSso: string;
  openProfile: string;
  pmCredentialsMissing: string;
  currentVault: string;
  switchVault: string;
  loadingMindmap: string;
  tasksPanel: string;
  refreshTasks: string;
  refreshing: string;
  deleteTemplateTitle: string;
  deleteTemplateMessage: string;
  shareVaultTitle: string;
  leaveVaultMessage: string;
  leave: string;
  find: string;
  prevMatch: string;
  nextMatch: string;
  insertLink: string;
  insert: string;
  searchCards: string;
  openSourceNote: string;
  activeShares: string;
  removeAttachmentMessage: string;
  sumEstimatesTitle: string;
  askOllamaTodosTitle: string;
  openNoteTaskMyelin: string;
  fromYamlTodos: string;
  categoryLabel: string;
  estimateLabel: string;
  openNoteTitle: string;
  missingNoteTitle: string;
  noAccessThisNote: string;
  openInMyelin: string;
  linkOrCreateMyelinTaskTitle: string;
  reconnectMyelinTasks: string;
  addPersonalTokenProfile: string;
  totalLabel: string;
  markAsOpen: string;
  markAsDone: string;
  taskDone: string;
  taskOpen: string;
  taskInProgress: string;
  pullOnlyRefreshHint: string;
  projectsAria: string;
  removeSynapseLinkTitle: string;
  selectNoteEllipsis: string;
  searchUsers: string;
  searchUsersPlaceholder: string;
  accessRoleNewMember: string;
  accessRoleBulkAdd: string;
  addAllUsersTitle: string;
  filterTasksExtended: string;
  shareModeAria: string;
  newVaultPlaceholder: string;
  nameOptional: string;
  yourNameOptional: string;
  writeReply: string;
  yourAnswer: string;
  deleteAnswerTitle: string;
  decisionHistory: string;
  describeDecisionPlaceholder: string;
  customDecision: string;
  askHistoryAria: string;
  diagramFullscreen: string;
  zoomOut: string;
  zoomIn: string;
  fitDiagram: string;
  enableZoom: string;
  disableZoom: string;
  imagePreview: string;
  linkToNote: string;
  mindmapView: string;
  filterFolders: string;
  filterByLinkKind: string;
  resetView: string;
  resetButton: string;
  viewFolders: string;
  viewAllNotes: string;
  linkWikilinks: string;
  linkAll: string;
  linkMentions: string;
  linkOther: string;
  folderClusters: string;
  backFolders: string;
  noteIcon: string;
  chooseNoteIcon: string;
  noteLinkSuggestions: string;
  findInNote: string;
  whiteboardPreview: string;
  notePreview: string;
  exitFullscreen: string;
  expandFullscreen: string;
  itemTypeAria: string;
  blankCanvasPreview: string;
  selectTemplatePreview: string;
  manageVaults: string;
  selectEllipsis: string;
  strikethrough: string;
  heading1: string;
  heading2: string;
  heading3: string;
  bulletList: string;
  numberedList: string;
  quote: string;
  inlineCode: string;
  codeBlock: string;
  linkCtrlK: string;
  tag: string;
  divider: string;
  nothingToPreview: string;
  studyFlashcardsWiki: string;
  exportFormatAria: string;
  toastRestoredChange: string;
  toastRefreshMyelinFailed: string;
  toastLinkedMyWork: string;
  toastLinkMyWorkFailed: string;
  toastFlashcardsFailed: string;
  toastLinkMyelinFirst: string;
  toastZipImportFailed: string;
  toastChooseZip: string;
  toastZipTooLarge: string;
  toastImportingZip: string;
  toastImportingZipOverwrite: string;
  toastImportSummary: string;
  scanningVault: string;
  deleteVault: string;
  vaultOptionsExport: string;
  vaultOptionsTrash: string;
  vaultOptionsLinks: string;
  vaultOptionsSubtitle: string;
  brokenLinksTab: string;
  vaultTab: string;
  refresh: string;
  noBrokenWikilinks: string;
  brokenLinksSummary: string;
  allWikilinksResolve: string;
  createNote: string;
  trashSoftDeletedHint: string;
  loadingTrash: string;
  trashEmpty: string;
  restore: string;
  deleteForever: string;
  vaultNameHeading: string;
  vaultNameHint: string;
  saveName: string;
  onlyOwnerRename: string;
  wikiAudienceHeading: string;
  wikiAudienceHint: string;
  vaultWikiAudience: string;
  visPrivateDetail: string;
  visAuthenticatedDetail: string;
  visUnlistedDetail: string;
  visPublicDetail: string;
  onlyOwnerChange: string;
  exportZipHint: string;
  exporting: string;
  exportZip: string;
  leaveVaultHint: string;
  deleteVaultHint: string;
  deleteVaultTypeConfirm: string;
  deleting: string;
  failedScanLinks: string;
  networkScanLinks: string;
  creatingNamedNote: string;
  createdNamedNote: string;
  couldNotCreateNote: string;
  failedRenameVault: string;
  failedUpdateVisibility: string;
  couldNotLeaveVault: string;
  restoreFailed: string;
  ownerLabel: string;
  fullAccess: string;
  wikiOnlyRead: string;
  vaultWikiEdit: string;
  addPeople: string;
  addPeopleHint: string;
  noUsersFound: string;
  alreadyAdded: string;
  add: string;
  closeList: string;
  addAllUsers: string;
  addAllUsersHint: string;
  addAll: string;
  addAllUsersMessage: string;
  shareOwnerOnlyHint: string;
  roleEditVaultWiki: string;
  roleReadWikiOnly: string;
  shareFlashcardHint: string;
  shareNoteHint: string;
  sharePasswordOnce: string;
  shareNoPassword: string;
  createShareLink: string;
  copyPasswordOnce: string;
  copyLinkNoPassword: string;
  linkLabel: string;
  passwordLabel: string;
  copyAction: string;
  copied: string;
  expiresAtLabel: string;
  duration1h: string;
  duration24h: string;
  duration7d: string;
  duration30d: string;
  never: string;
  transferCopy: string;
  transferMove: string;
  moveTrashHint: string;
  destination: string;
  existingVault: string;
  noOtherEditableVaults: string;
  working: string;
  moveNote: string;
  copyNoteAction: string;
  openLinkSuffix: string;
  passwordSuffix: string;
  createdAtLabel: string;
  revoke: string;
  recentEnded: string;
  sending: string;
  send: string;
  noApprovedAnswers: string;
  noAnswersYet: string;
  anonymous: string;
  approve: string;
  pendingStatus: string;
  reject: string;
  editAction: string;
  otherOption: string;
  saveDecision: string;
  lock: string;
  wikiOptionPrivate: string;
  wikiOptionAuthenticated: string;
  wikiOptionUnlisted: string;
  wikiOptionPublic: string;
  nameCannotBeEmpty: string;
  nameUnchanged: string;
  savingName: string;
  renamedTo: string;
  savingVisibility: string;
  visibilitySetTo: string;
  exportFailed: string;
  exportedSummary: string;
  noteRestored: string;
  deleteFailed: string;
  projectNotFoundOrg: string;
  projectNotFoundHint: string;
  unlinkProject: string;
  noProjectLinked: string;
  tasksLinkedSummary: string;
  openLinkedSuffix: string;
  loadingOrganizations: string;
  organizationEllipsis: string;
  noOrganizations: string;
  createProjectFromVault: string;
  orLinkExisting: string;
  pickOrgFirst: string;
  loadingProjects: string;
  searchProjects: string;
  selectOrgToList: string;
  noProjectsInOrg: string;
  noMatches: string;
  linkProjectFirst: string;
  allCheckboxesHaveTasks: string;
  autoLinkByDescription: string;
  selectNoteUnlinked: string;
  noUnlinkedInNote: string;
  preparing: string;
  creatingTasks: string;
  unlinkConfirmMessage: string;
  unlinking: string;
  unlink: string;
  expand: string;
  openBoard: string;
  openNoteAction: string;
  reply: string;
  deleteAnswerShareMsg: string;
  deleteAnswerEditorMsg: string;
  whiteboardNotFound: string;
  missingWhiteboard: string;
  createWhiteboardAction: string;
  editBoard: string;
  loadingBoard: string;
  noWhiteboardYet: string;
  hubPullOnlyBanner: string;
  linking: string;
  referencesFromNote: string;
  referencesFromBoard: string;
  linkKindBoard: string;
  revisionAutosave: string;
  revisionRefresh: string;
  revisionManual: string;
  compare: string;
  showLess: string;
  showOlder: string;
  publicPage: string;
  openNoteOnWiki: string;
  enablePublicWikiFirst: string;
  wikiAudienceNoteHint: string;
  doneCount: string;
  unlinkedSuffix: string;
  pullOnlyTasksHint: string;
  recalculateEstimates: string;
  suggestTodosAi: string;
  noteTaskLabel: string;
  noteTaskWithTitle: string;
  noNoteLevelTask: string;
  unlinkedUse: string;
  linkCreate: string;
  onTaskOrOpen: string;
  vaultMyelinSettings: string;
  forBulkActions: string;
  emptyPullOnlyTasks: string;
  emptyTasksHint: string;
  byCategory: string;
  noLinkableTasks: string;
  noTasksMatchFilter: string;
  createNewTask: string;
  linkSelected: string;
  vaultProjectSuffix: string;
  selectedLabel: string;
  linkSelectedProject: string;
  reconnectSsoArrow: string;
  addPersonalTokenArrow: string;
  filterUnlinked: string;
  filterOpen: string;
  filterAll: string;
  createAllMissing: string;
  createAllMissingCount: string;
  createMissingTitle: string;
  checkboxTasksHint: string;
  matchCheckboxesTitle: string;
  autoLinkNote: string;
  bulkCreated: string;
  bulkFailed: string;
  bulkSkipped: string;
  noMatchingCheckboxes: string;
  attachments: string;
  upload: string;
  emptyCheckbox: string;
  inFolder: string;
  emptyFoldCardsVault: string;
  visibilityDefault: string;
  crossFolderLinks: string;
  mindmapFolderBack: string;
  noBodyDiff: string;

  shareAccessHint: string;
  person: string;
  access: string;
  actionsCol: string;
  noPeopleOnVault: string;
  noAnswer: string;
  noNotesFound: string;
  noHistoryYet: string;
  chooseOption: string;
  createWhiteboardHint: string;
  createNoteHint: string;
  downloadDocx: string;
  exportFormatsHint: string;
  mindmapFolderHint: string;
  mindmapDashedHint: string;
  mindmapAllNotesHint: string;
  restoring: string;
  loadingRevision: string;
  revisionLabel: string;
  currentLabel: string;
  revisionBody: string;
  currentBody: string;
  pathLabel: string;
  defaultShort: string;
  mine: string;
  noPreview: string;
  legendIntro: string;
  legendBasics: string;
  legendCode: string;
  legendCallouts: string;
  legendCheckboxes: string;
  legendYaml: string;
  legendLinks: string;
  legendBlurbCheckboxes: string;
  selectNoteHintBefore: string;
  selectNoteHintAfter: string;
  restoreFieldFromRevision: string;
  revisionDiffIntro: string;
  diffAddedCount: string;
  diffRemovedCount: string;
  diffChangedCount: string;
  diffChangeBlocks: string;
  saveNoteBeforeAsk: string;
  answerHistoryTitle: string;
  askEventSubmitted: string;
  askEventEdited: string;
  askEventApproved: string;
  askEventRejected: string;
  askEventUnapproved: string;
  askEventDeleted: string;
  askEventGeneric: string;
  lockedBadge: string;
  saveNoteBeforeDecision: string;
  noDecisionYet: string;
  mindmapFolderStats: string;
  mindmapNoteStats: string;
  mindmapFolderEdgeTitle: string;
  mindmapFolderNodeTitle: string;
  mindmapNodeNoAccess: string;
  mindmapOtherFolderTitle: string;
  otherFolderFallback: string;
  exportMarkdownHint: string;
  exportPdfHintBefore: string;
  exportPdfSaveAsPdf: string;
  exportPdfHintAfter: string;
  loadingWordTemplates: string;
  wordTemplateField: string;
  exportDocxMarkersHint: string;
  iconDefault: string;
  reviewAiTodosIntro: string;
  noFrontmatterTodosYet: string;
  keepTodo: string;
  hoursLabel: string;
  statusLabel: string;
  noAiSuggestions: string;
  actionLabel: string;
  mergeTargetLabel: string;
  applying: string;
  linkToNoteEllipsis: string;
  createNoteEllipsis: string;
  createNewEllipsis: string;
  transferNoteIntro: string;
  thisCheckboxFallback: string;
  linkOrCreateTaskHint: string;
  reconnectOrTokenForTasks: string;
  projectLabel: string;
  requestShare: string;
  makePrivate: string;
  templateLabelField: string;
  templateDescriptionField: string;
  templateBodyField: string;
  paletteAria: string;
  whiteboardPrefix: string;
  couldNotLoadWhiteboard: string;
  previewError: string;
  legendBlurbYaml: string;
};

const en: ChromeMessages = {
  confirm: 'Confirm',
  create: 'Create',
  discardOpen: 'Discard & open',
  stay: 'Stay',
  jump: 'Jump',
  newNote: 'New…',
  mindmap: 'Mindmap',
  editor: 'Editor',
  flashcards: 'Flashcards',
  cards: 'Cards',
  importZip: 'Import ZIP',
  myelinTasks: 'Myelin tasks',
  publicWiki: 'Public wiki',
  enablePublicWiki: 'Enable public wiki',
  disablePublicWiki: 'Disable public wiki',
  filterNotes: 'Filter notes…',
  filterNotesTitle: 'Filters by title, path, or body',
  jumpTitle: 'Jump to note (Ctrl/Cmd+O)',
  quickSwitcherFooter: '↑↓ navigate · Enter open · Esc close · Ctrl/Cmd+O',
  showMindmap: 'Show full vault mindmap in the editor area',
  studyFlashcards: 'Study :::fold blocks across this vault as flashcards',
  importZipTitle: 'Import Markdown notes from a ZIP',
  closePanel: 'Close panel',
  noteTitle: 'Note title',
  titlePlaceholder: 'meta/risks',
  titleHint: 'Use folder/name for nesting (e.g. meta/risks)',
  visibility: 'Visibility',
  visPrivate: 'Private',
  visAuthenticated: 'Authenticated',
  visUnlisted: 'Unlisted',
  visPublic: 'Public',
  saveTitle: 'Save (Ctrl/Cmd+S)',
  maximizeWhiteboard: 'Maximize whiteboard',
  exportNote: 'Export note (Markdown, PDF/print, or Word)',
  export: 'Export',
  share: 'Share',
  shareTitle: 'Share link or send to another vault',
  linkMyWork: 'Link to My work',
  linkMyWorkTitle: 'Add a wikilink to this note on the My work overview',
  delete: 'Delete',
  deleteTitle: 'Move this note to trash',
  selectNote: 'Select a note',
  info: 'Info',
  references: 'References',
  backlinks: 'Backlinks',
  backlinksHint: 'Notes that link here',
  noneYet: 'None yet',
  noAccess: 'No access',
  history: 'History',
  focusedMindmap: 'Focused mindmap',
  saving: 'Saving…',
  unsaved: 'Unsaved',
  accessSuffix: 'access',
  notes: 'Notes',
  moreActions: 'More actions',
  exitMaximize: 'Exit maximize',
  unsavedTitle: 'Unsaved changes',
  unsavedMessage:
    'You have unsaved edits on this note. Discard them and open the other note, or cancel and save first.',
  trashTitle: 'Move to trash',
  trashMessage: 'This note will be moved to trash. You can restore it later from Vault options.',
  importZipModalTitle: 'Import ZIP',
  importZipMessage:
    'Markdown files become notes; folders become paths (e.g. meta/risks.md). Images in the ZIP are uploaded and relative image links are rewritten when possible.',
  importSkipExisting: 'Import (skip existing)',
  importOverwrite: 'Import (overwrite)',
  writeMarkdown: 'Write in Markdown…',
  viewEdit: 'Edit',
  viewSplit: 'Split',
  viewPreview: 'Preview',
  help: 'Help',
  markdownLegend: 'Markdown legend',
  bold: 'Bold (Ctrl+B)',
  italic: 'Italic (Ctrl+I)',
  wikilink: 'Wikilink',
  taskList: 'Task list',
  insertImage: 'Insert image',
  attach: 'Attach',
  uploading: 'Uploading…',
  createNoteTitle: 'New note',
  createWhiteboardTitle: 'New whiteboard',
  manageTemplates: 'Manage templates',
  note: 'Note',
  whiteboard: 'Whiteboard',
  title: 'Title',
  noMatchingTemplates: 'No matching templates',
  system: 'System',
  global: 'Global',
  shared: 'Shared',
  shareModalTitle: 'Share',
  shareFlashcard: 'Share flashcard',
  temporaryLink: 'Temporary link',
  expires: 'Expires',
  requirePassword: 'Require password',
  close: 'Close',
  linkTab: 'Link',
  sendTab: 'Send',
  searchVaults: 'Search vaults…',
  exportModalTitle: 'Export note',
  tabMarkdown: 'Markdown',
  tabPdf: 'PDF / Print',
  tabWord: 'Word',
  downloadMd: 'Download MD',
  printPdf: 'Print / Save PDF',
  noWordTemplates: 'No Word templates yet. Admins can upload them in Settings → Word export.',
  compareRestore: 'Compare & restore',
  onlyChanges: 'Only changes',
  restoreAll: 'Restore all',
  restoreChange: 'Restore only this change',
  reviewAiTodos: 'Review AI todo suggestions',
  analyzingAi: 'Analyzing note with AI…',
  existingTodos: 'Existing frontmatter todos',
  proposed: 'Proposed',
  addAsNew: 'Add as new',
  merge: 'Merge',
  discard: 'Discard',
  apply: 'Apply',
  vaultMyelin: 'Vault · Myelin',
  myelinProject: 'Myelin project',
  checkboxTasks: 'Checkbox tasks',
  unlinkMyelinTitle: 'Unlink from Myelin?',
  vaultOptions: 'Vault options',
  leaveVault: 'Leave vault',
  linkOrCreateTask: 'Link or create Myelin task',
  allProjects: 'All projects',
  searchTasks: 'Search existing tasks',
  removeAttachmentTitle: 'Remove attachment?',
  remove: 'Remove',
  templatesTitle: 'Note templates',
  filterTemplates: 'Filter…',
  mineOnly: 'Mine only',
  newPersonalTemplate: 'New personal template',
  publicWikis: 'Public wikis',
  filterWikis: 'Filter wikis…',
  allWikis: 'All wikis',
  openVault: 'Open this vault in Synapse',
  selectPublicNote: 'Select a public note',
  shareUnavailable: 'Share unavailable',
  backSynapse: 'Back to Synapse',
  enterPassword: 'Enter the password to view this note.',
  unlock: 'Unlock',
  unlocking: 'Unlocking…',
  noExpiry: 'No expiry',
  installApp: 'Install Synapse',
  installHintIosMenu: 'Tap Share, then Add to Home Screen for the app experience.',
  installHintDeferredMenu: 'Add Synapse to your home screen for quick access.',
  installHintBrowserMenu: 'Use your browser menu to Install app or Add to Home Screen.',
  installHintIosBanner: 'On iPhone/iPad: tap Share in Safari, then Add to Home Screen.',
  installHintDeferredBanner: 'Install the app on this device for a full-screen vault experience.',
  installHintBrowserBanner: 'Use your browser menu to Install app or Add to Home Screen for a full-screen vault experience.',
  installShort: 'Install',
  installAction: 'Install app',
  notNow: 'Not now',
  linkedToPrefix: 'Linked to',
  projectHashId: 'Project #{id}',
  myelinProjectHashId: 'Myelin project #{id}',
  backToNotes: 'Back to notes',
  noMatchingNotes: 'No matching notes',
  noPublicNotes: 'No public notes',
  browseNotes: 'Browse notes',
  linksFromThisNote: 'Links from this note',
  notesLinkedFromBoard: 'Notes linked from this board',
  none: 'None',
  notesCount: '{count} notes',
  noteCountOne: '{count} note',
  foldCardsEmptyWiki: 'No fold cards on visible wiki pages. Use :::fold- Question … ::: in a public (or authenticated) note.',
  publicWikisDirHint: 'Vaults with the public wiki enabled. What you see depends on note visibility: public for everyone, authenticated for signed-in users, and full contents if you have vault access.',
  noPublicWikisVisible: 'No public wikis are visible yet. Enable the public wiki on a vault and publish notes.',
  noPublicWikisSignIn: 'No public wikis yet. Sign in to see authenticated wikis you can access.',
  signedInUsers: 'Signed-in users',
  myTemplateLabel: 'My template',
  myTemplateDescription: 'Personal note template',
  vaultPmLinkHint: 'Link one Myelin project to this vault, then create tasks from note checkboxes.',
  dismiss: 'Dismiss',
  reconnectSso: 'Reconnect SSO',
  openProfile: 'Open Profile',
  pmCredentialsMissing: 'Myelin credentials missing or expired.',
  currentVault: 'Current vault',
  switchVault: 'Switch vault',
  loadingMindmap: 'Loading mindmap…',
  tasksPanel: 'Tasks',
  refreshTasks: 'Refresh tasks',
  refreshing: 'Refreshing…',
  deleteTemplateTitle: 'Delete template?',
  deleteTemplateMessage: 'This cannot be undone.',
  shareVaultTitle: 'Share vault',
  leaveVaultMessage: 'Leave “{name}”? You will lose access until invited again.',
  leave: 'Leave',
  find: 'Find…',
  prevMatch: 'Previous match',
  nextMatch: 'Next match',
  insertLink: 'Insert link into note',
  insert: 'Insert',
  searchCards: 'Search cards…',
  openSourceNote: 'Open source note',
  activeShares: 'Active shares',
  removeAttachmentMessage: 'The file will be removed from this note. This cannot be undone.',
  sumEstimatesTitle:
    'Sum checkbox + YAML todo hours by category into estimate (missing → Other; Total indent 0)',
  askOllamaTodosTitle: 'Ask external Ollama to propose YAML todos (review before save)',
  openNoteTaskMyelin: 'Open note task in Myelin',
  fromYamlTodos: 'From YAML frontmatter todos',
  categoryLabel: 'Category',
  estimateLabel: 'Estimate',
  openNoteTitle: 'Open note {name}',
  missingNoteTitle: 'Missing note: {name}',
  noAccessThisNote: "You don't have access to this note",
  openInMyelin: 'Open in Myelin',
  linkOrCreateMyelinTaskTitle: 'Create a new Myelin task or link an existing one',
  reconnectMyelinTasks: 'Reconnect Myelin to create or sync tasks.',
  addPersonalTokenProfile: 'Add personal token in Profile',
  totalLabel: 'Total',
  markAsOpen: 'Mark as open',
  markAsDone: 'Mark as done',
  taskDone: 'Done',
  taskOpen: 'Open',
  taskInProgress: 'In progress',
  pullOnlyRefreshHint: 'Pull-only — refresh from Myelin to update',
  projectsAria: 'Projects',
  removeSynapseLinkTitle: 'Remove Synapse link; keep the Myelin task',
  selectNoteEllipsis: 'Select note…',
  searchUsers: 'Search users',
  searchUsersPlaceholder: 'Search users…',
  accessRoleNewMember: 'Access role for new member',
  accessRoleBulkAdd: 'Access role for bulk add',
  addAllUsersTitle: 'Add all users?',
  filterTasksExtended: 'Filter by name, project, or id…',
  shareModeAria: 'Share mode',
  newVaultPlaceholder: 'New vault',
  nameOptional: 'Name (optional)',
  yourNameOptional: 'Your name (optional)',
  writeReply: 'Write a reply…',
  yourAnswer: 'Your answer',
  deleteAnswerTitle: 'Delete answer?',
  decisionHistory: 'Decision history',
  describeDecisionPlaceholder: 'Describe the decision…',
  customDecision: 'Custom decision',
  askHistoryAria: 'History: {question}',
  diagramFullscreen: 'Diagram fullscreen',
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  fitDiagram: 'Fit diagram to screen',
  enableZoom: 'Enable zoom',
  disableZoom: 'Disable zoom',
  imagePreview: 'Image preview',
  linkToNote: 'Link to note',
  mindmapView: 'Mindmap view',
  filterFolders: 'Filter folders…',
  filterByLinkKind: 'Filter by link kind',
  resetView: 'Reset view',
  resetButton: 'Reset',
  viewFolders: 'Folders',
  viewAllNotes: 'All notes',
  linkWikilinks: 'Wikilinks',
  linkAll: 'All links',
  linkMentions: 'Mentions',
  linkOther: 'Other',
  folderClusters: 'Folder clusters',
  backFolders: '← Folders',
  noteIcon: 'Note icon',
  chooseNoteIcon: 'Choose note icon',
  noteLinkSuggestions: 'Note link suggestions',
  findInNote: 'Find in note',
  whiteboardPreview: 'Whiteboard preview',
  notePreview: 'Note preview',
  exitFullscreen: 'Exit full screen (Esc)',
  expandFullscreen: 'Expand to full screen',
  itemTypeAria: 'Item type',
  blankCanvasPreview: 'A blank drawing canvas will be created.',
  selectTemplatePreview: 'Select a template',
  manageVaults: 'Manage vaults…',
  selectEllipsis: 'Select…',
  strikethrough: 'Strikethrough',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  bulletList: 'Bullet list',
  numberedList: 'Numbered list',
  quote: 'Quote',
  inlineCode: 'Inline code',
  codeBlock: 'Code block',
  linkCtrlK: 'Link (Ctrl+K)',
  tag: 'Tag',
  divider: 'Divider',
  nothingToPreview: 'Nothing to preview yet.',
  studyFlashcardsWiki: 'Study :::fold blocks from visible wiki pages',
  exportFormatAria: 'Export format',
  toastRestoredChange: 'Restored selected change',
  toastRefreshMyelinFailed: 'Could not refresh Myelin tasks',
  toastLinkedMyWork: 'Linked to My work overview',
  toastLinkMyWorkFailed: 'Could not link to My work',
  toastFlashcardsFailed: 'Failed to load flashcards',
  toastLinkMyelinFirst: 'Link a Myelin project in Vault options first',
  toastZipImportFailed: 'ZIP import failed',
  toastChooseZip: 'Please choose a .zip file',
  toastZipTooLarge: 'ZIP too large (max 20 MB)',
  toastImportingZip: 'Importing ZIP…',
  toastImportingZipOverwrite: 'Importing ZIP (overwrite)…',
  toastImportSummary:
    'Import: {created} created, {updated} updated, {skipped} skipped, {images} images',
  scanningVault: 'Scanning vault…',
  deleteVault: 'Delete vault',
  vaultOptionsExport: 'Export',
  vaultOptionsTrash: 'Trash',
  vaultOptionsLinks: 'Links',
  vaultOptionsSubtitle: '{name} — links, sharing, trash, export, and Myelin.',
  brokenLinksTab: 'Broken links',
  vaultTab: 'Vault',
  refresh: 'Refresh',
  noBrokenWikilinks: 'No broken [[wikilinks]] found.',
  brokenLinksSummary: '{count} broken links · {unique} unique targets',
  allWikilinksResolve: 'All wikilinks resolve to existing notes.',
  createNote: 'Create note',
  trashSoftDeletedHint: 'Soft-deleted notes. Restore to bring them back, or delete permanently.',
  loadingTrash: 'Loading trash…',
  trashEmpty: 'Trash is empty.',
  restore: 'Restore',
  deleteForever: 'Delete forever',
  vaultNameHeading: 'Name',
  vaultNameHint:
    'Display name for this vault. The wiki slug stays the same so existing links keep working.',
  saveName: 'Save name',
  onlyOwnerRename: 'Only the vault owner can rename.',
  wikiAudienceHeading: 'Wiki audience (default visibility)',
  wikiAudienceHint:
    'Who may open this vault’s wiki when public pages are enabled. Also the default for notes that use “Vault default”. Per-note overrides still apply inside the wiki.',
  vaultWikiAudience: 'Vault wiki audience',
  visPrivateDetail: 'Private — Share only',
  visAuthenticatedDetail: 'Authenticated — any signed-in user',
  visUnlistedDetail: 'Unlisted — link only (hidden from /w)',
  visPublicDetail: 'Public — everyone',
  onlyOwnerChange: 'Only the vault owner can change this.',
  exportZipHint: 'Download all notes as Markdown plus images (compatible with ZIP import).',
  exporting: 'Exporting…',
  exportZip: 'Export ZIP',
  leaveVaultHint: 'Remove your access. You can be invited again later.',
  deleteVaultHint:
    'Permanently deletes this vault, all notes, revisions, and media. This cannot be undone.',
  deleteVaultTypeConfirm: 'Type {name} to confirm permanent deletion.',
  deleting: 'Deleting…',
  failedScanLinks: 'Failed to scan links',
  networkScanLinks: 'Network error while scanning links',
  creatingNamedNote: 'Creating “{title}”…',
  createdNamedNote: 'Created “{title}”',
  couldNotCreateNote: 'Could not create note',
  failedRenameVault: 'Failed to rename vault',
  failedUpdateVisibility: 'Failed to update default visibility',
  couldNotLeaveVault: 'Could not leave vault',
  restoreFailed: 'Restore failed',
  ownerLabel: 'Owner',
  fullAccess: 'Full access',
  wikiOnlyRead: 'Wiki only (Read)',
  vaultWikiEdit: 'Vault + wiki (Edit)',
  addPeople: 'Add people',
  addPeopleHint: 'Search Synapse users and grant wiki Read or vault Edit access.',
  noUsersFound: 'No users found.',
  alreadyAdded: 'Already added',
  add: 'Add',
  closeList: 'Close list',
  addAllUsers: 'Add all users',
  addAllUsersHint:
    'Grant access to every active Synapse user who is not already a member. Existing members keep their current role.',
  addAll: 'Add all',
  addAllUsersMessage:
    'Grant {role} to all active Synapse users who are not already members of “{name}”? Existing members will not be changed.',
  shareOwnerOnlyHint:
    'Only the vault owner can change sharing. Ask the owner for Edit access if you need to manage members.',
  roleEditVaultWiki: 'Edit (vault + wiki)',
  roleReadWikiOnly: 'Read (wiki only)',
  shareFlashcardHint:
    'Anyone with the link can study this flashcard until it expires (or indefinitely).',
  shareNoteHint: 'Anyone with the link can view this note until it expires (or indefinitely).',
  sharePasswordOnce: ' Password is shown once.',
  shareNoPassword: ' No password — the link alone is enough.',
  createShareLink: 'Create share link',
  copyPasswordOnce: 'Copy now — the password will not be shown again.',
  copyLinkNoPassword: 'Copy the link — no password required.',
  linkLabel: 'Link',
  passwordLabel: 'Password',
  copyAction: 'Copy',
  copied: 'Copied',
  expiresAtLabel: 'Expires {date}',
  duration1h: '1 hour',
  duration24h: '24 hours',
  duration7d: '7 days',
  duration30d: '30 days',
  never: 'Never',
  transferCopy: 'Copy',
  transferMove: 'Move',
  moveTrashHint:
    'The original note will be moved to trash in this vault after a successful transfer.',
  destination: 'Destination',
  existingVault: 'Existing vault',
  noOtherEditableVaults: 'No other editable vaults',
  working: 'Working…',
  moveNote: 'Move note',
  copyNoteAction: 'Copy note',
  openLinkSuffix: ' · open link',
  passwordSuffix: ' · password',
  createdAtLabel: 'Created {date}',
  revoke: 'Revoke',
  recentEnded: 'Recent ended',
  sending: 'Sending…',
  send: 'Send',
  noApprovedAnswers: 'No approved answers yet.',
  noAnswersYet: 'No answers yet.',
  anonymous: 'Anonymous',
  approve: 'Approve',
  pendingStatus: 'Pending',
  reject: 'Reject',
  editAction: 'Edit',
  otherOption: 'Other',
  saveDecision: 'Save decision',
  lock: 'Lock',
  wikiOptionPrivate: 'Wiki: Private (Share only)',
  wikiOptionAuthenticated: 'Wiki: Authenticated',
  wikiOptionUnlisted: 'Wiki: Unlisted',
  wikiOptionPublic: 'Wiki: Public',
  nameCannotBeEmpty: 'Name cannot be empty',
  nameUnchanged: 'Name unchanged',
  savingName: 'Saving name…',
  renamedTo: 'Renamed to “{name}”',
  savingVisibility: 'Saving default visibility…',
  visibilitySetTo: 'Default visibility set to {value}',
  exportFailed: 'Export failed',
  exportedSummary: 'Exported {notes} notes · {images} images',
  noteRestored: 'Note restored',
  deleteFailed: 'Delete failed',
  projectNotFoundOrg: 'Project not found in this organization',
  projectNotFoundHint: 'It may have been deleted or moved in Myelin. Unlink and link another project.',
  unlinkProject: 'Unlink project',
  noProjectLinked: 'No project linked yet.',
  tasksLinkedSummary: 'Tasks: {linked} linked · {missing} unlinked',
  openLinkedSuffix: ' · {count} open linked',
  loadingOrganizations: 'Loading organizations…',
  organizationEllipsis: 'Organization…',
  noOrganizations: 'No organizations',
  createProjectFromVault: 'Create project from vault',
  orLinkExisting: 'Or link an existing project',
  pickOrgFirst: 'Pick an organization first…',
  loadingProjects: 'Loading projects…',
  searchProjects: 'Search projects by name…',
  selectOrgToList: 'Select an organization to list projects.',
  noProjectsInOrg: 'No projects in this organization.',
  noMatches: 'No matches.',
  linkProjectFirst: 'Link a project first',
  allCheckboxesHaveTasks: 'All checkboxes already have Myelin tasks',
  autoLinkByDescription: 'Auto-link by description',
  selectNoteUnlinked: 'Select a note with unlinked checkboxes',
  noUnlinkedInNote: 'No unlinked checkboxes in this note',
  preparing: 'Preparing…',
  creatingTasks: 'Creating tasks…',
  unlinkConfirmMessage: 'This removes the Synapse association. The Myelin task is kept and can be linked again later.',
  unlinking: 'Unlinking…',
  unlink: 'Unlink',
  expand: 'Expand',
  openBoard: 'Open board',
  openNoteAction: 'Open note',
  reply: 'Reply',
  deleteAnswerShareMsg: 'This removes your pending answer from the shared note.',
  deleteAnswerEditorMsg: 'This hides the answer from shares and the wiki. History is kept.',
  whiteboardNotFound: 'Whiteboard not found',
  missingWhiteboard: 'Missing whiteboard',
  createWhiteboardAction: 'Create whiteboard',
  editBoard: 'Edit board',
  loadingBoard: 'Loading board…',
  noWhiteboardYet: 'No whiteboard with this name yet. Create one to embed it here.',
  hubPullOnlyBanner: 'Pull-only from Myelin. Use Refresh tasks in the tasks panel (right sidebar) to update work assigned to you. Linked notes below the task block are kept.',
  linking: 'Linking…',
  referencesFromNote: 'Links from this note',
  referencesFromBoard: 'Notes linked from this board',
  linkKindBoard: 'board',
  revisionAutosave: 'Autosave',
  revisionRefresh: 'Refresh',
  revisionManual: 'Manual',
  compare: 'Compare',
  showLess: 'Show less',
  showOlder: 'Show {count} older…',
  publicPage: 'Public page',
  openNoteOnWiki: 'Open this note on the wiki →',
  enablePublicWikiFirst: 'Enable the public wiki in the vault header first.',
  wikiAudienceNoteHint: 'Wiki audience is set by vault default visibility. Override this note to public, unlisted, or authenticated to publish it; private notes stay hidden from Share Read viewers.',
  doneCount: '{count} done',
  unlinkedSuffix: ' · {count} unlinked',
  pullOnlyTasksHint: 'Pull-only from Myelin — adds, removes, and updates tasks assigned to you. Linked notes on the overview are kept.',
  recalculateEstimates: 'Recalculate estimates',
  suggestTodosAi: 'Suggest todos with AI',
  noteTaskLabel: 'Note task',
  noteTaskWithTitle: 'Note task · {title}',
  noNoteLevelTask: 'No note-level Myelin task',
  unlinkedUse: '{count} unlinked — use',
  linkCreate: 'Link / create',
  onTaskOrOpen: 'on a task, or open',
  vaultMyelinSettings: 'Vault → Myelin settings',
  forBulkActions: 'for bulk actions.',
  emptyPullOnlyTasks: 'No Myelin tasks assigned to you right now. Use Refresh tasks when work is assigned in Myelin.',
  emptyTasksHint: 'Add - [ ] / [-] / [x] lines or YAML todos: for tasks. Indent nested checkboxes to create Myelin subtasks.',
  byCategory: 'By category',
  noLinkableTasks: 'No linkable Myelin tasks in this organization.',
  noTasksMatchFilter: 'No tasks match this filter.',
  createNewTask: 'Create new task',
  linkSelected: 'Link selected',
  vaultProjectSuffix: ' (vault)',
  selectedLabel: 'Selected: {name}',
  linkSelectedProject: 'Link selected project',
  reconnectSsoArrow: 'Reconnect SSO →',
  addPersonalTokenArrow: 'Add personal token in Profile →',
  filterUnlinked: 'unlinked',
  filterOpen: 'open',
  filterAll: 'all',
  createAllMissing: 'Create all missing',
  createAllMissingCount: 'Create all missing ({count})',
  createMissingTitle: 'Create {count} missing Myelin tasks',
  checkboxTasksHint: 'From notes with - [ ] lines. Create a new Myelin task or link an existing one (no Synapse reference). Unlink keeps the Myelin task. Indented checkboxes become Myelin subtasks when created.',
  matchCheckboxesTitle: 'Match {count} checkboxes to Myelin tasks by name / description',
  autoLinkNote: 'Auto-link note',
  bulkCreated: 'created {count}',
  bulkFailed: ' · failed {count}',
  bulkSkipped: ' · skipped {count}',
  noMatchingCheckboxes: 'No matching checkboxes for this filter.',
  attachments: 'Attachments',
  upload: 'Upload',
  emptyCheckbox: '(empty)',
  inFolder: 'in folder',
  emptyFoldCardsVault: 'No fold cards in this vault. Use :::fold- Question … ::: with the answer in the body.',
  visibilityDefault: 'Default ({value})',
  shareAccessHint: '{name} — Read = wiki only; Edit = vault + wiki.',
  person: 'Person',
  access: 'Access',
  actionsCol: 'Actions',
  noPeopleOnVault: 'No people on this vault yet.',
  noAnswer: 'No answer',
  noNotesFound: 'No notes found',
  noHistoryYet: 'No history yet.',
  chooseOption: 'Choose an option',
  createWhiteboardHint: 'Name the board. Nested paths like meta/board are supported.',
  createNoteHint: 'Pick a template, then set the title. Nested paths like meta/risks are supported.',
  downloadDocx: 'Download DOCX',
  exportFormatsHint: 'Markdown, PDF/print, or Word template',
  mindmapFolderHint: 'Click a folder to open · drag background to pan',
  mindmapDashedHint: 'Dashed = other folder · ← Folders to go back',
  crossFolderLinks: 'Cross-folder links',
  mindmapFolderBack: 'Dashed = other folder · ← Folders to go back',
  noBodyDiff: 'No differences in body.',
  mindmapAllNotesHint: 'All-notes view · pan / zoom · click to open',
  restoring: 'Restoring…',
  loadingRevision: 'Loading revision…',
  revisionLabel: 'Revision #{number}',
  currentLabel: 'Current',
  revisionBody: 'Revision body',
  currentBody: 'Current body',
  pathLabel: 'Path',
  defaultShort: 'default',
  mine: 'Mine',
  noPreview: 'No preview',
  legendIntro: 'Toolbar + Ctrl/Cmd+B, I, K. Enter continues lists and tasks. Paste or drop images/files. Type [[attach to insert an attachment link.',
  legendBasics: 'Basics',
  legendCode: 'Code & diagrams',
  legendCallouts: 'Callouts & structure',
  legendCheckboxes: 'Checkboxes',
  legendYaml: 'Properties (YAML)',
  legendLinks: 'Synapse links & tags',
  legendBlurbCheckboxes: 'Task list markers in the note body. Linked Myelin tasks sync status into these marks.',
  selectNoteHintBefore: 'Or create one. Wikilinks like',
  selectNoteHintAfter: 'resolve in the live preview.',
  restoreFieldFromRevision: 'Restore {field} from this revision',
  revisionDiffIntro: 'Meld-style diff · left is revision #{number} · right is the current note · restore individual changes or the whole revision',
  diffAddedCount: '+{count} added',
  diffRemovedCount: '−{count} removed',
  diffChangedCount: '~{count} changed',
  diffChangeBlocks: '{count} change block(s)',
  saveNoteBeforeAsk: 'Save the note to enable answers for this question.',
  answerHistoryTitle: 'Answer history',
  askEventSubmitted: 'Submitted by {actor}',
  askEventEdited: 'Edited by {actor}',
  askEventApproved: 'Approved by {actor}',
  askEventRejected: 'Rejected by {actor}',
  askEventUnapproved: 'Unapproved by {actor}',
  askEventDeleted: 'Deleted by {actor}',
  askEventGeneric: '{event} · {actor}',
  lockedBadge: 'Locked',
  saveNoteBeforeDecision: 'Save the note to enable this decision.',
  noDecisionYet: 'No decision yet.',
  mindmapFolderStats: '{folders} folders · {links} cross-folder links',
  mindmapNoteStats: '{notes} notes · {links} links',
  mindmapFolderEdgeTitle: '{from} ↔ {to} · {count} links',
  mindmapFolderNodeTitle: '{title} — {notes} notes · {links} links to other folders. Click to open.',
  mindmapNodeNoAccess: '{title} — no access',
  mindmapOtherFolderTitle: '{title} ({folder})',
  otherFolderFallback: 'other folder',
  exportMarkdownHint: 'Downloads the note body as a .md file (including frontmatter and checkboxes).',
  exportPdfHintBefore: 'Opens the system print dialog. Choose',
  exportPdfSaveAsPdf: 'Save as PDF',
  exportPdfHintAfter: 'or send to a printer. Layout uses the rendered note preview.',
  loadingWordTemplates: 'Loading templates…',
  wordTemplateField: 'Template',
  exportDocxMarkersHint: 'Use Carbone markers such as {d.title}, {d.body}, {d.fm.<key>}, and {d.<list>[i].<field>} for grids. See Settings → Word export → How to create templates.',
  iconDefault: 'Default',
  reviewAiTodosIntro: 'Edit, merge into existing, or discard before updating the note. Nothing is saved until you apply.',
  noFrontmatterTodosYet: 'No frontmatter todos yet.',
  keepTodo: 'Keep',
  hoursLabel: 'Hours',
  statusLabel: 'Status',
  noAiSuggestions: 'No suggestions returned.',
  actionLabel: 'Action',
  mergeTargetLabel: 'Target',
  applying: 'Applying…',
  linkToNoteEllipsis: 'Link to note…',
  createNoteEllipsis: 'Create note…',
  createNewEllipsis: 'Create new…',
  transferNoteIntro: 'Copy or move this note to another vault. Media in the note is included; Myelin links are not.',
  thisCheckboxFallback: 'this checkbox',
  linkOrCreateTaskHint: 'For {label}. Link any Synapse-free task in the organization (including other projects).',
  reconnectOrTokenForTasks: 'Reconnect SSO or add a personal API token in Profile to load Myelin tasks.',
  projectLabel: 'Project',
  requestShare: 'Request share',
  makePrivate: 'Make private',
  templateLabelField: 'Label',
  templateDescriptionField: 'Description',
  templateBodyField: 'Body (use {{title}} for the note title)',
  paletteAria: 'Palette {name}',
  whiteboardPrefix: 'Whiteboard',
  couldNotLoadWhiteboard: 'Could not load whiteboard: {title}',
  previewError: 'Preview error',
  legendBlurbYaml: 'Optional block at the very top of the note, between --- fences. Shown as the Properties card in preview.',
};

const pt: ChromeMessages = {
  confirm: 'Confirmar',
  create: 'Criar',
  discardOpen: 'Descartar e abrir',
  stay: 'Ficar',
  jump: 'Ir',
  newNote: 'Novo…',
  mindmap: 'Mapa mental',
  editor: 'Editor',
  flashcards: 'Flashcards',
  cards: 'Cartões',
  importZip: 'Importar ZIP',
  myelinTasks: 'Tarefas Myelin',
  publicWiki: 'Wiki pública',
  enablePublicWiki: 'Activar wiki pública',
  disablePublicWiki: 'Desactivar wiki pública',
  filterNotes: 'Filtrar notas…',
  filterNotesTitle: 'Filtra por título, caminho ou corpo',
  jumpTitle: 'Ir para a nota (Ctrl/Cmd+O)',
  quickSwitcherFooter: '↑↓ navegar · Enter abrir · Esc fechar · Ctrl/Cmd+O',
  showMindmap: 'Mostrar o mapa mental do cofre na área do editor',
  studyFlashcards: 'Estudar blocos :::fold deste cofre como flashcards',
  importZipTitle: 'Importar notas Markdown de um ZIP',
  closePanel: 'Fechar painel',
  noteTitle: 'Título da nota',
  titlePlaceholder: 'meta/riscos',
  titleHint: 'Use pasta/nome para aninhamento (ex.: meta/riscos)',
  visibility: 'Visibilidade',
  visPrivate: 'Privada',
  visAuthenticated: 'Autenticados',
  visUnlisted: 'Não listada',
  visPublic: 'Pública',
  saveTitle: 'Guardar (Ctrl/Cmd+S)',
  maximizeWhiteboard: 'Maximizar quadro',
  exportNote: 'Exportar nota (Markdown, PDF/impressão ou Word)',
  export: 'Exportar',
  share: 'Partilhar',
  shareTitle: 'Partilhar ligação ou enviar para outro cofre',
  linkMyWork: 'Ligar ao Meu trabalho',
  linkMyWorkTitle: 'Adicionar uma wikilink a esta nota na visão Meu trabalho',
  delete: 'Eliminar',
  deleteTitle: 'Mover esta nota para o lixo',
  selectNote: 'Seleccione uma nota',
  info: 'Info',
  references: 'Referências',
  backlinks: 'Retroligações',
  backlinksHint: 'Notas que ligam aqui',
  noneYet: 'Ainda nenhuma',
  noAccess: 'Sem acesso',
  history: 'Histórico',
  focusedMindmap: 'Mapa mental focado',
  saving: 'A guardar…',
  unsaved: 'Por guardar',
  accessSuffix: 'acesso',
  notes: 'Notas',
  moreActions: 'Mais acções',
  exitMaximize: 'Sair da maximização',
  unsavedTitle: 'Alterações por guardar',
  unsavedMessage:
    'Tem edições por guardar nesta nota. Descarte-as e abra a outra nota, ou cancele e guarde primeiro.',
  trashTitle: 'Mover para o lixo',
  trashMessage: 'Esta nota será movida para o lixo. Pode restaurá-la depois em Opções do cofre.',
  importZipModalTitle: 'Importar ZIP',
  importZipMessage:
    'Ficheiros Markdown tornam-se notas; pastas tornam-se caminhos (ex.: meta/riscos.md). Imagens no ZIP são enviadas e ligações relativas reescritas quando possível.',
  importSkipExisting: 'Importar (ignorar existentes)',
  importOverwrite: 'Importar (substituir)',
  writeMarkdown: 'Escreva em Markdown…',
  viewEdit: 'Editar',
  viewSplit: 'Dividido',
  viewPreview: 'Pré-visualizar',
  help: 'Ajuda',
  markdownLegend: 'Legenda Markdown',
  bold: 'Negrito (Ctrl+B)',
  italic: 'Itálico (Ctrl+I)',
  wikilink: 'Wikilink',
  taskList: 'Lista de tarefas',
  insertImage: 'Inserir imagem',
  attach: 'Anexar',
  uploading: 'A enviar…',
  createNoteTitle: 'Nova nota',
  createWhiteboardTitle: 'Novo quadro',
  manageTemplates: 'Gerir modelos',
  note: 'Nota',
  whiteboard: 'Quadro',
  title: 'Título',
  noMatchingTemplates: 'Sem modelos correspondentes',
  system: 'Sistema',
  global: 'Global',
  shared: 'Partilhado',
  shareModalTitle: 'Partilhar',
  shareFlashcard: 'Partilhar flashcard',
  temporaryLink: 'Ligação temporária',
  expires: 'Expira',
  requirePassword: 'Exigir palavra-passe',
  close: 'Fechar',
  linkTab: 'Ligação',
  sendTab: 'Enviar',
  searchVaults: 'Pesquisar cofres…',
  exportModalTitle: 'Exportar nota',
  tabMarkdown: 'Markdown',
  tabPdf: 'PDF / Imprimir',
  tabWord: 'Word',
  downloadMd: 'Descarregar MD',
  printPdf: 'Imprimir / Guardar PDF',
  noWordTemplates: 'Ainda sem modelos Word. Os administradores podem enviá-los em Definições → Exportação Word.',
  compareRestore: 'Comparar e restaurar',
  onlyChanges: 'Só alterações',
  restoreAll: 'Restaurar tudo',
  restoreChange: 'Restaurar só esta alteração',
  reviewAiTodos: 'Rever sugestões de tarefas IA',
  analyzingAi: 'A analisar a nota com IA…',
  existingTodos: 'Tarefas existentes no frontmatter',
  proposed: 'Propostas',
  addAsNew: 'Adicionar como nova',
  merge: 'Fundir',
  discard: 'Descartar',
  apply: 'Aplicar',
  vaultMyelin: 'Cofre · Myelin',
  myelinProject: 'Projecto Myelin',
  checkboxTasks: 'Tarefas de caixas de verificação',
  unlinkMyelinTitle: 'Desligar do Myelin?',
  vaultOptions: 'Opções do cofre',
  leaveVault: 'Sair do cofre',
  linkOrCreateTask: 'Ligar ou criar tarefa Myelin',
  allProjects: 'Todos os projectos',
  searchTasks: 'Pesquisar tarefas existentes',
  removeAttachmentTitle: 'Remover anexo?',
  remove: 'Remover',
  templatesTitle: 'Modelos de nota',
  filterTemplates: 'Filtrar…',
  mineOnly: 'Só meus',
  newPersonalTemplate: 'Novo modelo pessoal',
  publicWikis: 'Wikis públicas',
  filterWikis: 'Filtrar wikis…',
  allWikis: 'Todas as wikis',
  openVault: 'Abrir este cofre no Synapse',
  selectPublicNote: 'Seleccione uma nota pública',
  shareUnavailable: 'Partilha indisponível',
  backSynapse: 'Voltar ao Synapse',
  enterPassword: 'Introduza a palavra-passe para ver esta nota.',
  unlock: 'Desbloquear',
  unlocking: 'A desbloquear…',
  noExpiry: 'Sem expiração',
  installApp: 'Instalar Synapse',
  installHintIosMenu: 'Toque em Partilhar e depois em Adicionar ao ecrã principal para a experiência de aplicação.',
  installHintDeferredMenu: 'Adicione o Synapse ao ecrã principal para acesso rápido.',
  installHintBrowserMenu: 'Use o menu do navegador para Instalar aplicação ou Adicionar ao ecrã principal.',
  installHintIosBanner: 'No iPhone/iPad: toque em Partilhar no Safari e depois em Adicionar ao ecrã principal.',
  installHintDeferredBanner: 'Instale a aplicação neste dispositivo para uma experiência de cofre em ecrã inteiro.',
  installHintBrowserBanner: 'Use o menu do navegador para Instalar aplicação ou Adicionar ao ecrã principal para uma experiência de cofre em ecrã inteiro.',
  installShort: 'Instalar',
  installAction: 'Instalar aplicação',
  notNow: 'Agora não',
  linkedToPrefix: 'Associado a',
  projectHashId: 'Projecto #{id}',
  myelinProjectHashId: 'Projecto Myelin #{id}',
  backToNotes: 'Voltar às notas',
  noMatchingNotes: 'Sem notas correspondentes',
  noPublicNotes: 'Sem notas públicas',
  browseNotes: 'Explorar notas',
  linksFromThisNote: 'Ligações desta nota',
  notesLinkedFromBoard: 'Notas ligadas a partir deste quadro',
  none: 'Nenhuma',
  notesCount: '{count} notas',
  noteCountOne: '{count} nota',
  foldCardsEmptyWiki: 'Sem cartões fold nas páginas wiki visíveis. Use :::fold- Pergunta … ::: numa nota pública (ou autenticada).',
  publicWikisDirHint: 'Cofres com a wiki pública activada. O que vê depende da visibilidade das notas: pública para todos, autenticada para utilizadores com sessão, e conteúdos completos se tiver acesso ao cofre.',
  noPublicWikisVisible: 'Ainda não há wikis públicas visíveis. Active a wiki pública num cofre e publique notas.',
  noPublicWikisSignIn: 'Ainda sem wikis públicas. Inicie sessão para ver wikis autenticadas a que tenha acesso.',
  signedInUsers: 'Utilizadores com sessão',
  myTemplateLabel: 'O meu modelo',
  myTemplateDescription: 'Modelo de nota pessoal',
  vaultPmLinkHint: 'Associe um projecto Myelin a este cofre e depois crie tarefas a partir das caixas de verificação das notas.',
  dismiss: 'Dispensar',
  reconnectSso: 'Voltar a ligar SSO',
  openProfile: 'Abrir perfil',
  pmCredentialsMissing: 'Credenciais Myelin em falta ou expiradas.',
  currentVault: 'Cofre actual',
  switchVault: 'Mudar de cofre',
  loadingMindmap: 'A carregar o mapa mental…',
  tasksPanel: 'Tarefas',
  refreshTasks: 'Actualizar tarefas',
  refreshing: 'A actualizar…',
  deleteTemplateTitle: 'Eliminar modelo?',
  deleteTemplateMessage: 'Isto não pode ser anulado.',
  shareVaultTitle: 'Partilhar cofre',
  leaveVaultMessage: 'Sair de «{name}»? Perderá o acesso até ser convidado novamente.',
  leave: 'Sair',
  find: 'Localizar…',
  prevMatch: 'Correspondência anterior',
  nextMatch: 'Correspondência seguinte',
  insertLink: 'Inserir ligação na nota',
  insert: 'Inserir',
  searchCards: 'Pesquisar cartões…',
  openSourceNote: 'Abrir nota de origem',
  activeShares: 'Partilhas activas',
  removeAttachmentMessage: 'O ficheiro será removido desta nota. Isto não pode ser anulado.',
  sumEstimatesTitle:
    'Somar horas de caixas de verificação + todos YAML por categoria na estimativa (em falta → Other; Total indent 0)',
  askOllamaTodosTitle: 'Pedir ao Ollama externo todos YAML propostos (rever antes de guardar)',
  openNoteTaskMyelin: 'Abrir tarefa da nota no Myelin',
  fromYamlTodos: 'Dos todos YAML no frontmatter',
  categoryLabel: 'Categoria',
  estimateLabel: 'Estimativa',
  openNoteTitle: 'Abrir nota {name}',
  missingNoteTitle: 'Nota em falta: {name}',
  noAccessThisNote: 'Não tem acesso a esta nota',
  openInMyelin: 'Abrir no Myelin',
  linkOrCreateMyelinTaskTitle: 'Criar nova tarefa Myelin ou ligar uma existente',
  reconnectMyelinTasks: 'Volte a ligar o Myelin para criar ou sincronizar tarefas.',
  addPersonalTokenProfile: 'Adicionar token pessoal no Perfil',
  totalLabel: 'Total',
  markAsOpen: 'Marcar como aberta',
  markAsDone: 'Marcar como concluída',
  taskDone: 'Concluída',
  taskOpen: 'Aberta',
  taskInProgress: 'Em progresso',
  pullOnlyRefreshHint: 'Só pull — actualize a partir do Myelin',
  projectsAria: 'Projectos',
  removeSynapseLinkTitle: 'Remover ligação Synapse; manter a tarefa Myelin',
  selectNoteEllipsis: 'Seleccionar nota…',
  searchUsers: 'Pesquisar utilizadores',
  searchUsersPlaceholder: 'Pesquisar utilizadores…',
  accessRoleNewMember: 'Papel de acesso para novo membro',
  accessRoleBulkAdd: 'Papel de acesso para adição em massa',
  addAllUsersTitle: 'Adicionar todos os utilizadores?',
  filterTasksExtended: 'Filtrar por nome, projecto ou id…',
  shareModeAria: 'Modo de partilha',
  newVaultPlaceholder: 'Novo cofre',
  nameOptional: 'Nome (opcional)',
  yourNameOptional: 'O seu nome (opcional)',
  writeReply: 'Escreva uma resposta…',
  yourAnswer: 'A sua resposta',
  deleteAnswerTitle: 'Eliminar resposta?',
  decisionHistory: 'Histórico de decisões',
  describeDecisionPlaceholder: 'Descreva a decisão…',
  customDecision: 'Decisão personalizada',
  askHistoryAria: 'Histórico: {question}',
  diagramFullscreen: 'Diagrama em ecrã completo',
  zoomOut: 'Reduzir zoom',
  zoomIn: 'Aumentar zoom',
  fitDiagram: 'Ajustar diagrama ao ecrã',
  enableZoom: 'Activar zoom',
  disableZoom: 'Desactivar zoom',
  imagePreview: 'Pré-visualização da imagem',
  linkToNote: 'Ligar à nota',
  mindmapView: 'Vista de mapa mental',
  filterFolders: 'Filtrar pastas…',
  filterByLinkKind: 'Filtrar por tipo de ligação',
  resetView: 'Repor vista',
  resetButton: 'Repor',
  viewFolders: 'Pastas',
  viewAllNotes: 'Todas as notas',
  linkWikilinks: 'Wikilinks',
  linkAll: 'Todas as ligações',
  linkMentions: 'Menções',
  linkOther: 'Outras',
  folderClusters: 'Agrupamentos por pasta',
  backFolders: '← Pastas',
  noteIcon: 'Ícone da nota',
  chooseNoteIcon: 'Escolher ícone da nota',
  noteLinkSuggestions: 'Sugestões de ligação a notas',
  findInNote: 'Localizar na nota',
  whiteboardPreview: 'Pré-visualização do quadro',
  notePreview: 'Pré-visualização da nota',
  exitFullscreen: 'Sair de ecrã completo (Esc)',
  expandFullscreen: 'Expandir para ecrã completo',
  itemTypeAria: 'Tipo de item',
  blankCanvasPreview: 'Será criado um quadro em branco.',
  selectTemplatePreview: 'Seleccione um modelo',
  manageVaults: 'Gerir cofres…',
  selectEllipsis: 'Seleccionar…',
  strikethrough: 'Riscado',
  heading1: 'Título 1',
  heading2: 'Título 2',
  heading3: 'Título 3',
  bulletList: 'Lista com marcas',
  numberedList: 'Lista numerada',
  quote: 'Citação',
  inlineCode: 'Código inline',
  codeBlock: 'Bloco de código',
  linkCtrlK: 'Ligação (Ctrl+K)',
  tag: 'Etiqueta',
  divider: 'Separador',
  nothingToPreview: 'Ainda nada para pré-visualizar.',
  studyFlashcardsWiki: 'Estudar blocos :::fold das páginas wiki visíveis',
  exportFormatAria: 'Formato de exportação',
  toastRestoredChange: 'Alteração seleccionada restaurada',
  toastRefreshMyelinFailed: 'Não foi possível actualizar as tarefas Myelin',
  toastLinkedMyWork: 'Ligada à visão O meu trabalho',
  toastLinkMyWorkFailed: 'Não foi possível ligar ao Meu trabalho',
  toastFlashcardsFailed: 'Falha ao carregar flashcards',
  toastLinkMyelinFirst: 'Ligue primeiro um projecto Myelin nas Opções do cofre',
  toastZipImportFailed: 'Falha na importação ZIP',
  toastChooseZip: 'Escolha um ficheiro .zip',
  toastZipTooLarge: 'ZIP demasiado grande (máx. 20 MB)',
  toastImportingZip: 'A importar ZIP…',
  toastImportingZipOverwrite: 'A importar ZIP (substituir)…',
  toastImportSummary:
    'Importação: {created} criadas, {updated} actualizadas, {skipped} ignoradas, {images} imagens',
  scanningVault: 'A analisar o cofre…',
  deleteVault: 'Eliminar cofre',
  vaultOptionsExport: 'Exportar',
  vaultOptionsTrash: 'Lixo',
  vaultOptionsLinks: 'Ligações',
  vaultOptionsSubtitle: '{name} — ligações, partilha, lixo, exportação e Myelin.',
  brokenLinksTab: 'Ligações quebradas',
  vaultTab: 'Cofre',
  refresh: 'Actualizar',
  noBrokenWikilinks: 'Nenhuma [[wikilink]] quebrada encontrada.',
  brokenLinksSummary: '{count} ligações quebradas · {unique} destinos únicos',
  allWikilinksResolve: 'Todas as wikilinks resolvem para notas existentes.',
  createNote: 'Criar nota',
  trashSoftDeletedHint:
    'Notas eliminadas temporariamente. Restaure para as recuperar, ou elimine definitivamente.',
  loadingTrash: 'A carregar o lixo…',
  trashEmpty: 'O lixo está vazio.',
  restore: 'Restaurar',
  deleteForever: 'Eliminar definitivamente',
  vaultNameHeading: 'Nome',
  vaultNameHint:
    'Nome apresentado deste cofre. O slug da wiki mantém-se para as ligações existentes continuarem a funcionar.',
  saveName: 'Guardar nome',
  onlyOwnerRename: 'Só o proprietário do cofre pode mudar o nome.',
  wikiAudienceHeading: 'Audiência da wiki (visibilidade predefinida)',
  wikiAudienceHint:
    'Quem pode abrir a wiki deste cofre quando as páginas públicas estão activas. Também é a predefinição das notas com «Predefinição do cofre». As sobreposições por nota continuam a aplicar-se na wiki.',
  vaultWikiAudience: 'Audiência da wiki do cofre',
  visPrivateDetail: 'Privada — só partilha',
  visAuthenticatedDetail: 'Autenticados — qualquer utilizador com sessão',
  visUnlistedDetail: 'Não listada — só com ligação (oculta em /w)',
  visPublicDetail: 'Pública — todos',
  onlyOwnerChange: 'Só o proprietário do cofre pode alterar isto.',
  exportZipHint: 'Descarregar todas as notas em Markdown e imagens (compatível com importação ZIP).',
  exporting: 'A exportar…',
  exportZip: 'Exportar ZIP',
  leaveVaultHint: 'Retira o seu acesso. Pode ser convidado novamente mais tarde.',
  deleteVaultHint:
    'Elimina permanentemente este cofre, todas as notas, revisões e multimédia. Não pode ser anulado.',
  deleteVaultTypeConfirm: 'Escreva {name} para confirmar a eliminação permanente.',
  deleting: 'A eliminar…',
  failedScanLinks: 'Falha ao analisar ligações',
  networkScanLinks: 'Erro de rede ao analisar ligações',
  creatingNamedNote: 'A criar «{title}»…',
  createdNamedNote: 'Criada «{title}»',
  couldNotCreateNote: 'Não foi possível criar a nota',
  failedRenameVault: 'Falha ao mudar o nome do cofre',
  failedUpdateVisibility: 'Falha ao actualizar a visibilidade predefinida',
  couldNotLeaveVault: 'Não foi possível sair do cofre',
  restoreFailed: 'Falha ao restaurar',
  ownerLabel: 'Proprietário',
  fullAccess: 'Acesso total',
  wikiOnlyRead: 'Só wiki (Leitura)',
  vaultWikiEdit: 'Cofre + wiki (Edição)',
  addPeople: 'Adicionar pessoas',
  addPeopleHint: 'Pesquise utilizadores Synapse e conceda Leitura na wiki ou Edição no cofre.',
  noUsersFound: 'Nenhum utilizador encontrado.',
  alreadyAdded: 'Já adicionado',
  add: 'Adicionar',
  closeList: 'Fechar lista',
  addAllUsers: 'Adicionar todos os utilizadores',
  addAllUsersHint:
    'Concede acesso a todos os utilizadores Synapse activos que ainda não são membros. Os membros existentes mantêm o papel actual.',
  addAll: 'Adicionar todos',
  addAllUsersMessage:
    'Conceder {role} a todos os utilizadores Synapse activos que ainda não são membros de «{name}»? Os membros existentes não serão alterados.',
  shareOwnerOnlyHint:
    'Só o proprietário do cofre pode alterar a partilha. Peça acesso de Edição se precisar de gerir membros.',
  roleEditVaultWiki: 'Edição (cofre + wiki)',
  roleReadWikiOnly: 'Leitura (só wiki)',
  shareFlashcardHint:
    'Qualquer pessoa com a ligação pode estudar este flashcard até expirar (ou indefinidamente).',
  shareNoteHint:
    'Qualquer pessoa com a ligação pode ver esta nota até expirar (ou indefinidamente).',
  sharePasswordOnce: ' A palavra-passe é mostrada uma vez.',
  shareNoPassword: ' Sem palavra-passe — a ligação basta.',
  createShareLink: 'Criar ligação de partilha',
  copyPasswordOnce: 'Copie agora — a palavra-passe não será mostrada de novo.',
  copyLinkNoPassword: 'Copie a ligação — sem palavra-passe.',
  linkLabel: 'Ligação',
  passwordLabel: 'Palavra-passe',
  copyAction: 'Copiar',
  copied: 'Copiado',
  expiresAtLabel: 'Expira {date}',
  duration1h: '1 hora',
  duration24h: '24 horas',
  duration7d: '7 dias',
  duration30d: '30 dias',
  never: 'Nunca',
  transferCopy: 'Copiar',
  transferMove: 'Mover',
  moveTrashHint:
    'A nota original será movida para o lixo neste cofre após uma transferência bem-sucedida.',
  destination: 'Destino',
  existingVault: 'Cofre existente',
  noOtherEditableVaults: 'Nenhum outro cofre editável',
  working: 'A trabalhar…',
  moveNote: 'Mover nota',
  copyNoteAction: 'Copiar nota',
  openLinkSuffix: ' · ligação aberta',
  passwordSuffix: ' · palavra-passe',
  createdAtLabel: 'Criada {date}',
  revoke: 'Revogar',
  recentEnded: 'Terminadas recentemente',
  sending: 'A enviar…',
  send: 'Enviar',
  noApprovedAnswers: 'Ainda sem respostas aprovadas.',
  noAnswersYet: 'Ainda sem respostas.',
  anonymous: 'Anónimo',
  approve: 'Aprovar',
  pendingStatus: 'Pendente',
  reject: 'Rejeitar',
  editAction: 'Editar',
  otherOption: 'Outra',
  saveDecision: 'Guardar decisão',
  lock: 'Bloquear',
  wikiOptionPrivate: 'Wiki: Privada (só partilha)',
  wikiOptionAuthenticated: 'Wiki: Autenticados',
  wikiOptionUnlisted: 'Wiki: Não listada',
  wikiOptionPublic: 'Wiki: Pública',
  nameCannotBeEmpty: 'O nome não pode estar vazio',
  nameUnchanged: 'Nome inalterado',
  savingName: 'A guardar o nome…',
  renamedTo: 'Nome alterado para «{name}»',
  savingVisibility: 'A guardar a visibilidade predefinida…',
  visibilitySetTo: 'Visibilidade predefinida definida para {value}',
  exportFailed: 'Falha na exportação',
  exportedSummary: 'Exportadas {notes} notas · {images} imagens',
  noteRestored: 'Nota restaurada',
  deleteFailed: 'Falha ao eliminar',
  projectNotFoundOrg: 'Projecto não encontrado nesta organização',
  projectNotFoundHint: 'Pode ter sido eliminado ou movido no Myelin. Desligue e associe outro projecto.',
  unlinkProject: 'Desligar projecto',
  noProjectLinked: 'Ainda sem projecto associado.',
  tasksLinkedSummary: 'Tarefas: {linked} ligadas · {missing} sem ligação',
  openLinkedSuffix: ' · {count} abertas ligadas',
  loadingOrganizations: 'A carregar organizações…',
  organizationEllipsis: 'Organização…',
  noOrganizations: 'Sem organizações',
  createProjectFromVault: 'Criar projecto a partir do cofre',
  orLinkExisting: 'Ou associar um projecto existente',
  pickOrgFirst: 'Escolha primeiro uma organização…',
  loadingProjects: 'A carregar projectos…',
  searchProjects: 'Pesquisar projectos por nome…',
  selectOrgToList: 'Seleccione uma organização para listar projectos.',
  noProjectsInOrg: 'Sem projectos nesta organização.',
  noMatches: 'Sem resultados.',
  linkProjectFirst: 'Associe primeiro um projecto',
  allCheckboxesHaveTasks: 'Todas as caixas já têm tarefas Myelin',
  autoLinkByDescription: 'Associar automaticamente por descrição',
  selectNoteUnlinked: 'Seleccione uma nota com caixas sem ligação',
  noUnlinkedInNote: 'Sem caixas sem ligação nesta nota',
  preparing: 'A preparar…',
  creatingTasks: 'A criar tarefas…',
  unlinkConfirmMessage: 'Isto retira a associação Synapse. A tarefa Myelin mantém-se e pode ser associada de novo.',
  unlinking: 'A desligar…',
  unlink: 'Desligar',
  expand: 'Expandir',
  openBoard: 'Abrir quadro',
  openNoteAction: 'Abrir nota',
  reply: 'Responder',
  deleteAnswerShareMsg: 'Isto retira a sua resposta pendente da nota partilhada.',
  deleteAnswerEditorMsg: 'Isto oculta a resposta das partilhas e da wiki. O histórico é mantido.',
  whiteboardNotFound: 'Quadro branco não encontrado',
  missingWhiteboard: 'Quadro branco em falta',
  createWhiteboardAction: 'Criar quadro branco',
  editBoard: 'Editar quadro',
  loadingBoard: 'A carregar quadro…',
  noWhiteboardYet: 'Ainda não há quadro branco com este nome. Crie um para o incorporar aqui.',
  hubPullOnlyBanner: 'Só leitura a partir do Myelin. Use Actualizar tarefas no painel de tarefas (barra lateral direita) para actualizar o trabalho atribuído. As notas ligadas abaixo do bloco de tarefas são mantidas.',
  linking: 'A associar…',
  referencesFromNote: 'Ligações desta nota',
  referencesFromBoard: 'Notas ligadas a partir deste quadro',
  linkKindBoard: 'quadro',
  revisionAutosave: 'Autoguardar',
  revisionRefresh: 'Actualizar',
  revisionManual: 'Manual',
  compare: 'Comparar',
  showLess: 'Mostrar menos',
  showOlder: 'Mostrar {count} mais antigas…',
  publicPage: 'Página pública',
  openNoteOnWiki: 'Abrir esta nota na wiki →',
  enablePublicWikiFirst: 'Ative primeiro a wiki pública no cabeçalho do cofre.',
  wikiAudienceNoteHint: 'A audiência da wiki segue a visibilidade predefinida do cofre. Altere esta nota para pública, não listada ou autenticados para a publicar; notas privadas ficam ocultas para leitores de Partilha.',
  doneCount: '{count} concluídas',
  unlinkedSuffix: ' · {count} sem ligação',
  pullOnlyTasksHint: 'Só leitura a partir do Myelin — adiciona, remove e actualiza tarefas atribuídas a si. As notas ligadas na visão geral são mantidas.',
  recalculateEstimates: 'Recalcular estimativas',
  suggestTodosAi: 'Sugerir todos com IA',
  noteTaskLabel: 'Tarefa da nota',
  noteTaskWithTitle: 'Tarefa da nota · {title}',
  noNoteLevelTask: 'Sem tarefa Myelin ao nível da nota',
  unlinkedUse: '{count} sem ligação — use',
  linkCreate: 'Ligar / criar',
  onTaskOrOpen: 'numa tarefa, ou abra',
  vaultMyelinSettings: 'Cofre → Definições Myelin',
  forBulkActions: 'para acções em massa.',
  emptyPullOnlyTasks: 'Não tem tarefas Myelin atribuídas de momento. Use Actualizar tarefas quando houver trabalho no Myelin.',
  emptyTasksHint: 'Adicione linhas - [ ] / [-] / [x] ou YAML todos: para tarefas. Indente caixas aninhadas para criar subtarefas Myelin.',
  byCategory: 'Por categoria',
  noLinkableTasks: 'Não há tarefas Myelin associáveis nesta organização.',
  noTasksMatchFilter: 'Nenhuma tarefa corresponde a este filtro.',
  createNewTask: 'Criar nova tarefa',
  linkSelected: 'Ligar seleccionada',
  vaultProjectSuffix: ' (cofre)',
  selectedLabel: 'Seleccionado: {name}',
  linkSelectedProject: 'Ligar projecto seleccionado',
  reconnectSsoArrow: 'Reconectar SSO →',
  addPersonalTokenArrow: 'Adicionar token pessoal no Perfil →',
  filterUnlinked: 'sem ligação',
  filterOpen: 'abertas',
  filterAll: 'todas',
  createAllMissing: 'Criar todas em falta',
  createAllMissingCount: 'Criar todas em falta ({count})',
  createMissingTitle: 'Criar {count} tarefas Myelin em falta',
  checkboxTasksHint: 'De notas com linhas - [ ]. Crie uma nova tarefa Myelin ou associe uma existente (sem referência Synapse). Desligar mantém a tarefa Myelin. Caixas indentadas tornam-se subtarefas Myelin ao criar.',
  matchCheckboxesTitle: 'Associar {count} caixas a tarefas Myelin por nome / descrição',
  autoLinkNote: 'Associar nota automaticamente',
  bulkCreated: 'criadas {count}',
  bulkFailed: ' · falhas {count}',
  bulkSkipped: ' · ignoradas {count}',
  noMatchingCheckboxes: 'Nenhuma caixa corresponde a este filtro.',
  attachments: 'Anexos',
  upload: 'Enviar',
  emptyCheckbox: '(vazio)',
  inFolder: 'na pasta',
  emptyFoldCardsVault: 'Sem cartões fold neste cofre. Use :::fold- Pergunta … ::: com a resposta no corpo.',
  visibilityDefault: 'Predefinição ({value})',
  shareAccessHint: '{name} — Leitura = só wiki; Edição = cofre + wiki.',
  person: 'Pessoa',
  access: 'Acesso',
  actionsCol: 'Acções',
  noPeopleOnVault: 'Ainda sem pessoas neste cofre.',
  noAnswer: 'Sem resposta',
  noNotesFound: 'Nenhuma nota encontrada',
  noHistoryYet: 'Ainda sem histórico.',
  chooseOption: 'Escolha uma opção',
  createWhiteboardHint: 'Dê um nome ao quadro. São aceites caminhos aninhados como meta/board.',
  createNoteHint: 'Escolha um modelo e defina o título. São aceites caminhos aninhados como meta/riscos.',
  downloadDocx: 'Descarregar DOCX',
  exportFormatsHint: 'Markdown, PDF/imprimir ou modelo Word',
  mindmapFolderHint: 'Clique numa pasta para abrir · arraste o fundo para deslocar',
  mindmapDashedHint: 'Tracejado = outra pasta · ← Pastas para voltar',
  crossFolderLinks: 'Ligações entre pastas',
  mindmapFolderBack: 'Tracejado = outra pasta · ← Pastas para voltar',
  noBodyDiff: 'Sem diferenças no corpo.',
  mindmapAllNotesHint: 'Vista de todas as notas · deslocar / zoom · clique para abrir',
  restoring: 'A restaurar…',
  loadingRevision: 'A carregar revisão…',
  revisionLabel: 'Revisão #{number}',
  currentLabel: 'Actual',
  revisionBody: 'Corpo da revisão',
  currentBody: 'Corpo actual',
  pathLabel: 'Caminho',
  defaultShort: 'predefinição',
  mine: 'Meu',
  noPreview: 'Sem pré-visualização',
  legendIntro: 'Barra de ferramentas + Ctrl/Cmd+B, I, K. Enter continua listas e tarefas. Cole ou largue imagens/ficheiros. Escreva [[attach para inserir uma ligação de anexo.',
  legendBasics: 'Básicos',
  legendCode: 'Código e diagramas',
  legendCallouts: 'Avisos (callouts) e estrutura',
  legendCheckboxes: 'Caixas de verificação',
  legendYaml: 'Propriedades (YAML)',
  legendLinks: 'Ligações Synapse e etiquetas',
  legendBlurbCheckboxes: 'Marcadores de lista de tarefas no corpo da nota. Tarefas Myelin ligadas sincronizam o estado nestes marcadores.',
  selectNoteHintBefore: 'Ou crie uma. Wikilinks como',
  selectNoteHintAfter: 'resolvem-se na pré-visualização em directo.',
  restoreFieldFromRevision: 'Restaurar {field} a partir desta revisão',
  revisionDiffIntro: 'Diferença ao estilo Meld · à esquerda a revisão #{number} · à direita a nota actual · restaure alterações individuais ou a revisão inteira',
  diffAddedCount: '+{count} adicionadas',
  diffRemovedCount: '−{count} removidas',
  diffChangedCount: '~{count} alteradas',
  diffChangeBlocks: '{count} bloco(s) de alteração',
  saveNoteBeforeAsk: 'Guarde a nota para activar respostas a esta pergunta.',
  answerHistoryTitle: 'Histórico de respostas',
  askEventSubmitted: 'Enviada por {actor}',
  askEventEdited: 'Editada por {actor}',
  askEventApproved: 'Aprovada por {actor}',
  askEventRejected: 'Rejeitada por {actor}',
  askEventUnapproved: 'Desaprovada por {actor}',
  askEventDeleted: 'Eliminada por {actor}',
  askEventGeneric: '{event} · {actor}',
  lockedBadge: 'Bloqueada',
  saveNoteBeforeDecision: 'Guarde a nota para activar esta decisão.',
  noDecisionYet: 'Ainda sem decisão.',
  mindmapFolderStats: '{folders} pastas · {links} ligações entre pastas',
  mindmapNoteStats: '{notes} notas · {links} ligações',
  mindmapFolderEdgeTitle: '{from} ↔ {to} · {count} ligações',
  mindmapFolderNodeTitle: '{title} — {notes} notas · {links} ligações a outras pastas. Clique para abrir.',
  mindmapNodeNoAccess: '{title} — sem acesso',
  mindmapOtherFolderTitle: '{title} ({folder})',
  otherFolderFallback: 'outra pasta',
  exportMarkdownHint: 'Descarrega o corpo da nota como ficheiro .md (incluindo frontmatter e caixas de verificação).',
  exportPdfHintBefore: 'Abre o diálogo de impressão do sistema. Escolha',
  exportPdfSaveAsPdf: 'Guardar como PDF',
  exportPdfHintAfter: 'ou envie para uma impressora. O esquema usa a pré-visualização da nota.',
  loadingWordTemplates: 'A carregar modelos…',
  wordTemplateField: 'Modelo',
  exportDocxMarkersHint: 'Use marcadores Carbone como {d.title}, {d.body}, {d.fm.<key>} e {d.<list>[i].<field>} para grelhas. Veja Definições → Exportação Word → Como criar modelos.',
  iconDefault: 'Predefinição',
  reviewAiTodosIntro: 'Edite, una com existentes ou descarte antes de actualizar a nota. Nada é guardado até aplicar.',
  noFrontmatterTodosYet: 'Ainda sem todos no frontmatter.',
  keepTodo: 'Manter',
  hoursLabel: 'Horas',
  statusLabel: 'Estado',
  noAiSuggestions: 'Nenhuma sugestão devolvida.',
  actionLabel: 'Acção',
  mergeTargetLabel: 'Destino',
  applying: 'A aplicar…',
  linkToNoteEllipsis: 'Ligar à nota…',
  createNoteEllipsis: 'Criar nota…',
  createNewEllipsis: 'Criar nova…',
  transferNoteIntro: 'Copie ou mova esta nota para outro cofre. Os media na nota são incluídos; as ligações Myelin não.',
  thisCheckboxFallback: 'esta caixa',
  linkOrCreateTaskHint: 'Para {label}. Associe qualquer tarefa sem Synapse na organização (incluindo outros projectos).',
  reconnectOrTokenForTasks: 'Volte a ligar o SSO ou adicione um token API pessoal no Perfil para carregar tarefas Myelin.',
  projectLabel: 'Projecto',
  requestShare: 'Pedir partilha',
  makePrivate: 'Tornar privado',
  templateLabelField: 'Etiqueta',
  templateDescriptionField: 'Descrição',
  templateBodyField: 'Corpo (use {{title}} para o título da nota)',
  paletteAria: 'Paleta {name}',
  whiteboardPrefix: 'Quadro branco',
  couldNotLoadWhiteboard: 'Não foi possível carregar o quadro branco: {title}',
  previewError: 'Erro de pré-visualização',
  legendBlurbYaml: 'Bloco opcional no topo da nota, entre barreiras ---. Aparece como cartão Propriedades na pré-visualização.',
};

const es: ChromeMessages = {
  ...en,
  confirm: 'Confirmar',
  create: 'Crear',
  discardOpen: 'Descartar y abrir',
  stay: 'Quedarse',
  jump: 'Ir',
  newNote: 'Nuevo…',
  mindmap: 'Mapa mental',
  editor: 'Editor',
  flashcards: 'Flashcards',
  cards: 'Tarjetas',
  importZip: 'Importar ZIP',
  myelinTasks: 'Tareas Myelin',
  publicWiki: 'Wiki pública',
  enablePublicWiki: 'Activar wiki pública',
  disablePublicWiki: 'Desactivar wiki pública',
  filterNotes: 'Filtrar notas…',
  filterNotesTitle: 'Filtra por título, ruta o cuerpo',
  jumpTitle: 'Ir a la nota (Ctrl/Cmd+O)',
  quickSwitcherFooter: '↑↓ navegar · Enter abrir · Esc cerrar · Ctrl/Cmd+O',
  showMindmap: 'Mostrar el mapa mental de la bóveda en el editor',
  studyFlashcards: 'Estudiar bloques :::fold de esta bóveda como flashcards',
  importZipTitle: 'Importar notas Markdown desde un ZIP',
  closePanel: 'Cerrar panel',
  noteTitle: 'Título de la nota',
  titlePlaceholder: 'meta/riesgos',
  titleHint: 'Usa carpeta/nombre para anidar (p. ej. meta/riesgos)',
  visibility: 'Visibilidad',
  visPrivate: 'Privada',
  visAuthenticated: 'Autenticados',
  visUnlisted: 'No listada',
  visPublic: 'Pública',
  saveTitle: 'Guardar (Ctrl/Cmd+S)',
  maximizeWhiteboard: 'Maximizar pizarra',
  exportNote: 'Exportar nota (Markdown, PDF/impresión o Word)',
  export: 'Exportar',
  share: 'Compartir',
  shareTitle: 'Compartir enlace o enviar a otra bóveda',
  linkMyWork: 'Enlazar a Mi trabajo',
  linkMyWorkTitle: 'Añadir un wikilink a esta nota en Mi trabajo',
  delete: 'Eliminar',
  deleteTitle: 'Mover esta nota a la papelera',
  selectNote: 'Selecciona una nota',
  info: 'Info',
  references: 'Referencias',
  backlinks: 'Retroenlaces',
  backlinksHint: 'Notas que enlazan aquí',
  noneYet: 'Ninguno aún',
  noAccess: 'Sin acceso',
  history: 'Historial',
  focusedMindmap: 'Mapa mental enfocado',
  saving: 'Guardando…',
  unsaved: 'Sin guardar',
  accessSuffix: 'acceso',
  notes: 'Notas',
  moreActions: 'Más acciones',
  exitMaximize: 'Salir de la maximización',
  unsavedTitle: 'Cambios sin guardar',
  unsavedMessage:
    'Tienes ediciones sin guardar. Descártalas y abre la otra nota, o cancela y guarda primero.',
  trashTitle: 'Mover a la papelera',
  trashMessage: 'Esta nota se moverá a la papelera. Puedes restaurarla después en Opciones de la bóveda.',
  importZipModalTitle: 'Importar ZIP',
  importZipMessage:
    'Los archivos Markdown se convierten en notas; las carpetas en rutas. Las imágenes del ZIP se suben y los enlaces relativos se reescriben cuando es posible.',
  importSkipExisting: 'Importar (omitir existentes)',
  importOverwrite: 'Importar (sobrescribir)',
  writeMarkdown: 'Escribe en Markdown…',
  viewEdit: 'Editar',
  viewSplit: 'Dividido',
  viewPreview: 'Vista previa',
  help: 'Ayuda',
  markdownLegend: 'Leyenda Markdown',
  bold: 'Negrita (Ctrl+B)',
  italic: 'Cursiva (Ctrl+I)',
  wikilink: 'Wikilink',
  taskList: 'Lista de tareas',
  insertImage: 'Insertar imagen',
  attach: 'Adjuntar',
  uploading: 'Subiendo…',
  createNoteTitle: 'Nueva nota',
  createWhiteboardTitle: 'Nueva pizarra',
  manageTemplates: 'Gestionar plantillas',
  note: 'Nota',
  whiteboard: 'Pizarra',
  title: 'Título',
  noMatchingTemplates: 'No hay plantillas coincidentes',
  system: 'Sistema',
  global: 'Global',
  shared: 'Compartido',
  shareModalTitle: 'Compartir',
  shareFlashcard: 'Compartir flashcard',
  temporaryLink: 'Enlace temporal',
  expires: 'Caduca',
  requirePassword: 'Requerir contraseña',
  close: 'Cerrar',
  linkTab: 'Enlace',
  sendTab: 'Enviar',
  searchVaults: 'Buscar bóvedas…',
  exportModalTitle: 'Exportar nota',
  tabMarkdown: 'Markdown',
  tabPdf: 'PDF / Imprimir',
  tabWord: 'Word',
  downloadMd: 'Descargar MD',
  printPdf: 'Imprimir / Guardar PDF',
  noWordTemplates: 'Aún no hay plantillas Word. Los admins pueden subirlas en Ajustes → Exportación Word.',
  compareRestore: 'Comparar y restaurar',
  onlyChanges: 'Solo cambios',
  restoreAll: 'Restaurar todo',
  restoreChange: 'Restaurar solo este cambio',
  reviewAiTodos: 'Revisar sugerencias de tareas IA',
  analyzingAi: 'Analizando la nota con IA…',
  existingTodos: 'Todos existentes en el frontmatter',
  proposed: 'Propuestas',
  addAsNew: 'Añadir como nueva',
  merge: 'Fusionar',
  discard: 'Descartar',
  apply: 'Aplicar',
  vaultMyelin: 'Bóveda · Myelin',
  myelinProject: 'Proyecto Myelin',
  checkboxTasks: 'Tareas de casilla',
  unlinkMyelinTitle: '¿Desvincular de Myelin?',
  vaultOptions: 'Opciones de la bóveda',
  leaveVault: 'Abandonar bóveda',
  linkOrCreateTask: 'Enlazar o crear tarea Myelin',
  allProjects: 'Todos los proyectos',
  searchTasks: 'Buscar tareas existentes',
  removeAttachmentTitle: '¿Eliminar adjunto?',
  remove: 'Eliminar',
  templatesTitle: 'Plantillas de notas',
  filterTemplates: 'Filtrar…',
  mineOnly: 'Solo mías',
  newPersonalTemplate: 'Nueva plantilla personal',
  publicWikis: 'Wikis públicas',
  filterWikis: 'Filtrar wikis…',
  allWikis: 'Todas las wikis',
  openVault: 'Abrir esta bóveda en Synapse',
  selectPublicNote: 'Selecciona una nota pública',
  shareUnavailable: 'Compartición no disponible',
  backSynapse: 'Volver a Synapse',
  enterPassword: 'Introduce la contraseña para ver esta nota.',
  unlock: 'Desbloquear',
  unlocking: 'Desbloqueando…',
  noExpiry: 'Sin caducidad',
  installApp: 'Instalar Synapse',
  installHintIosMenu: 'Pulse Compartir y luego Añadir a la pantalla de inicio para la experiencia de aplicación.',
  installHintDeferredMenu: 'Añada Synapse a la pantalla de inicio para un acceso rápido.',
  installHintBrowserMenu: 'Use el menú del navegador para Instalar aplicación o Añadir a la pantalla de inicio.',
  installHintIosBanner: 'En iPhone/iPad: pulse Compartir en Safari y luego Añadir a la pantalla de inicio.',
  installHintDeferredBanner: 'Instale la aplicación en este dispositivo para una experiencia de bóveda a pantalla completa.',
  installHintBrowserBanner: 'Use el menú del navegador para Instalar aplicación o Añadir a la pantalla de inicio y disfrutar de la bóveda a pantalla completa.',
  installShort: 'Instalar',
  installAction: 'Instalar aplicación',
  notNow: 'Ahora no',
  linkedToPrefix: 'Vinculado a',
  projectHashId: 'Proyecto #{id}',
  myelinProjectHashId: 'Proyecto Myelin #{id}',
  backToNotes: 'Volver a las notas',
  noMatchingNotes: 'No hay notas coincidentes',
  noPublicNotes: 'No hay notas públicas',
  browseNotes: 'Explorar notas',
  linksFromThisNote: 'Enlaces de esta nota',
  notesLinkedFromBoard: 'Notas enlazadas desde esta pizarra',
  none: 'Ninguno',
  notesCount: '{count} notas',
  noteCountOne: '{count} nota',
  foldCardsEmptyWiki: 'No hay tarjetas fold en las páginas wiki visibles. Use :::fold- Pregunta … ::: en una nota pública (o autenticada).',
  publicWikisDirHint: 'Bóvedas con la wiki pública activada. Lo que ve depende de la visibilidad de las notas: pública para todos, autenticada para usuarios con sesión, y contenidos completos si tiene acceso a la bóveda.',
  noPublicWikisVisible: 'Aún no hay wikis públicas visibles. Active la wiki pública en una bóveda y publique notas.',
  noPublicWikisSignIn: 'Aún no hay wikis públicas. Inicie sesión para ver wikis autenticadas a las que tenga acceso.',
  signedInUsers: 'Usuarios con sesión',
  myTemplateLabel: 'Mi plantilla',
  myTemplateDescription: 'Plantilla de nota personal',
  vaultPmLinkHint: 'Vincule un proyecto Myelin a esta bóveda y luego cree tareas desde las casillas de las notas.',
  dismiss: 'Descartar',
  reconnectSso: 'Reconectar SSO',
  openProfile: 'Abrir perfil',
  pmCredentialsMissing: 'Credenciales Myelin ausentes o caducadas.',
  currentVault: 'Bóveda actual',
  switchVault: 'Cambiar de bóveda',
  loadingMindmap: 'Cargando mapa mental…',
  tasksPanel: 'Tareas',
  refreshTasks: 'Actualizar tareas',
  refreshing: 'Actualizando…',
  deleteTemplateTitle: '¿Eliminar plantilla?',
  deleteTemplateMessage: 'Esto no se puede deshacer.',
  shareVaultTitle: 'Compartir bóveda',
  leaveVaultMessage: '¿Abandonar «{name}»? Perderás el acceso hasta que te inviten de nuevo.',
  leave: 'Abandonar',
  find: 'Buscar…',
  prevMatch: 'Coincidencia anterior',
  nextMatch: 'Coincidencia siguiente',
  insertLink: 'Insertar enlace en la nota',
  insert: 'Insertar',
  searchCards: 'Buscar tarjetas…',
  openSourceNote: 'Abrir nota de origen',
  activeShares: 'Comparticiones activas',
  removeAttachmentMessage: 'El archivo se eliminará de esta nota. Esto no se puede deshacer.',
  sumEstimatesTitle:
    'Sumar horas de casillas + todos YAML por categoría en la estimación (faltantes → Other; Total indentación 0)',
  askOllamaTodosTitle: 'Pedir a Ollama externo que proponga todos YAML (revisar antes de guardar)',
  openNoteTaskMyelin: 'Abrir tarea de la nota en Myelin',
  fromYamlTodos: 'Desde todos del frontmatter YAML',
  categoryLabel: 'Categoría',
  estimateLabel: 'Estimación',
  openNoteTitle: 'Abrir nota {name}',
  missingNoteTitle: 'Nota ausente: {name}',
  noAccessThisNote: 'No tienes acceso a esta nota',
  openInMyelin: 'Abrir en Myelin',
  linkOrCreateMyelinTaskTitle: 'Crear una tarea Myelin nueva o enlazar una existente',
  reconnectMyelinTasks: 'Vuelve a conectar Myelin para crear o sincronizar tareas.',
  addPersonalTokenProfile: 'Añade el token personal en Perfil',
  totalLabel: 'Total',
  markAsOpen: 'Marcar como abierta',
  markAsDone: 'Marcar como hecha',
  taskDone: 'Hecha',
  taskOpen: 'Abierta',
  taskInProgress: 'En curso',
  pullOnlyRefreshHint: 'Solo lectura — actualiza desde Myelin para refrescar',
  projectsAria: 'Proyectos',
  removeSynapseLinkTitle: 'Quitar enlace Synapse; mantener la tarea Myelin',
  selectNoteEllipsis: 'Seleccionar nota…',
  searchUsers: 'Buscar usuarios',
  searchUsersPlaceholder: 'Buscar usuarios…',
  accessRoleNewMember: 'Rol de acceso para el nuevo miembro',
  accessRoleBulkAdd: 'Rol de acceso para añadir en bloque',
  addAllUsersTitle: '¿Añadir a todos los usuarios?',
  filterTasksExtended: 'Filtrar por nombre, proyecto o id…',
  shareModeAria: 'Modo de compartición',
  newVaultPlaceholder: 'Nueva bóveda',
  nameOptional: 'Nombre (opcional)',
  yourNameOptional: 'Tu nombre (opcional)',
  writeReply: 'Escribe una respuesta…',
  yourAnswer: 'Tu respuesta',
  deleteAnswerTitle: '¿Eliminar respuesta?',
  decisionHistory: 'Historial de decisiones',
  describeDecisionPlaceholder: 'Describe la decisión…',
  customDecision: 'Decisión personalizada',
  askHistoryAria: 'Historial: {question}',
  diagramFullscreen: 'Diagrama a pantalla completa',
  zoomOut: 'Alejar',
  zoomIn: 'Acercar',
  fitDiagram: 'Ajustar diagrama a la pantalla',
  enableZoom: 'Activar zoom',
  disableZoom: 'Desactivar zoom',
  imagePreview: 'Vista previa de imagen',
  linkToNote: 'Enlazar a nota',
  mindmapView: 'Vista de mapa mental',
  filterFolders: 'Filtrar carpetas…',
  filterByLinkKind: 'Filtrar por tipo de enlace',
  resetView: 'Restablecer vista',
  resetButton: 'Restablecer',
  viewFolders: 'Carpetas',
  viewAllNotes: 'Todas las notas',
  linkWikilinks: 'Wikilinks',
  linkAll: 'Todos los enlaces',
  linkMentions: 'Menciones',
  linkOther: 'Otros',
  folderClusters: 'Grupos de carpetas',
  backFolders: '← Carpetas',
  noteIcon: 'Icono de nota',
  chooseNoteIcon: 'Elegir icono de nota',
  noteLinkSuggestions: 'Sugerencias de enlace a notas',
  findInNote: 'Buscar en la nota',
  whiteboardPreview: 'Vista previa de la pizarra',
  notePreview: 'Vista previa de la nota',
  exitFullscreen: 'Salir de pantalla completa (Esc)',
  expandFullscreen: 'Expandir a pantalla completa',
  itemTypeAria: 'Tipo de elemento',
  blankCanvasPreview: 'Se creará un lienzo en blanco.',
  selectTemplatePreview: 'Selecciona una plantilla',
  manageVaults: 'Gestionar bóvedas…',
  selectEllipsis: 'Seleccionar…',
  strikethrough: 'Tachado',
  heading1: 'Título 1',
  heading2: 'Título 2',
  heading3: 'Título 3',
  bulletList: 'Lista con viñetas',
  numberedList: 'Lista numerada',
  quote: 'Cita',
  inlineCode: 'Código en línea',
  codeBlock: 'Bloque de código',
  linkCtrlK: 'Enlace (Ctrl+K)',
  tag: 'Etiqueta',
  divider: 'Separador',
  nothingToPreview: 'Aún no hay nada que previsualizar.',
  studyFlashcardsWiki: 'Estudiar bloques :::fold de las páginas wiki visibles',
  exportFormatAria: 'Formato de exportación',
  toastRestoredChange: 'Cambio seleccionado restaurado',
  toastRefreshMyelinFailed: 'No se pudieron actualizar las tareas Myelin',
  toastLinkedMyWork: 'Enlazado a Mi trabajo',
  toastLinkMyWorkFailed: 'No se pudo enlazar a Mi trabajo',
  toastFlashcardsFailed: 'Error al cargar flashcards',
  toastLinkMyelinFirst: 'Enlaza primero un proyecto Myelin en Opciones de la bóveda',
  toastZipImportFailed: 'Error al importar el ZIP',
  toastChooseZip: 'Elige un archivo .zip',
  toastZipTooLarge: 'ZIP demasiado grande (máx. 20 MB)',
  toastImportingZip: 'Importando ZIP…',
  toastImportingZipOverwrite: 'Importando ZIP (sobrescribir)…',
  toastImportSummary:
    'Importación: {created} creadas, {updated} actualizadas, {skipped} omitidas, {images} imágenes',
  scanningVault: 'Analizando la bóveda…',
  deleteVault: 'Eliminar bóveda',
  vaultOptionsExport: 'Exportar',
  vaultOptionsTrash: 'Papelera',
  vaultOptionsLinks: 'Enlaces',
  vaultOptionsSubtitle: '{name} — enlaces, uso compartido, papelera, exportación y Myelin.',
  brokenLinksTab: 'Enlaces rotos',
  vaultTab: 'Bóveda',
  refresh: 'Actualizar',
  noBrokenWikilinks: 'No se encontraron [[wikilinks]] rotos.',
  brokenLinksSummary: '{count} enlaces rotos · {unique} destinos únicos',
  allWikilinksResolve: 'Todos los wikilinks resuelven a notas existentes.',
  createNote: 'Crear nota',
  trashSoftDeletedHint:
    'Notas eliminadas temporalmente. Restaura para recuperarlas o elimínalas permanentemente.',
  loadingTrash: 'Cargando papelera…',
  trashEmpty: 'La papelera está vacía.',
  restore: 'Restaurar',
  deleteForever: 'Eliminar para siempre',
  vaultNameHeading: 'Nombre',
  vaultNameHint:
    'Nombre visible de esta bóveda. El slug del wiki se mantiene para que los enlaces existentes sigan funcionando.',
  saveName: 'Guardar nombre',
  onlyOwnerRename: 'Solo el propietario puede cambiar el nombre.',
  wikiAudienceHeading: 'Audiencia del wiki (visibilidad predeterminada)',
  wikiAudienceHint:
    'Quién puede abrir el wiki de esta bóveda cuando las páginas públicas están activas. También es el valor predeterminado de las notas con «Predeterminado de la bóveda». Las excepciones por nota siguen aplicando en el wiki.',
  vaultWikiAudience: 'Audiencia del wiki de la bóveda',
  visPrivateDetail: 'Privada — solo compartición',
  visAuthenticatedDetail: 'Autenticados — cualquier usuario con sesión',
  visUnlistedDetail: 'No listada — solo con enlace (oculta en /w)',
  visPublicDetail: 'Pública — todos',
  onlyOwnerChange: 'Solo el propietario puede cambiar esto.',
  exportZipHint: 'Descargar todas las notas en Markdown e imágenes (compatible con importación ZIP).',
  exporting: 'Exportando…',
  exportZip: 'Exportar ZIP',
  leaveVaultHint: 'Elimina tu acceso. Pueden volver a invitarte más tarde.',
  deleteVaultHint:
    'Elimina permanentemente esta bóveda, todas las notas, revisiones y multimedia. No se puede deshacer.',
  deleteVaultTypeConfirm: 'Escribe {name} para confirmar la eliminación permanente.',
  deleting: 'Eliminando…',
  failedScanLinks: 'Error al analizar enlaces',
  networkScanLinks: 'Error de red al analizar enlaces',
  creatingNamedNote: 'Creando «{title}»…',
  createdNamedNote: 'Creada «{title}»',
  couldNotCreateNote: 'No se pudo crear la nota',
  failedRenameVault: 'Error al renombrar la bóveda',
  failedUpdateVisibility: 'Error al actualizar la visibilidad predeterminada',
  couldNotLeaveVault: 'No se pudo abandonar la bóveda',
  restoreFailed: 'Error al restaurar',
  ownerLabel: 'Propietario',
  fullAccess: 'Acceso completo',
  wikiOnlyRead: 'Solo wiki (Lectura)',
  vaultWikiEdit: 'Bóveda + wiki (Edición)',
  addPeople: 'Añadir personas',
  addPeopleHint: 'Busca usuarios de Synapse y concede Lectura en el wiki o Edición en la bóveda.',
  noUsersFound: 'No se encontraron usuarios.',
  alreadyAdded: 'Ya añadido',
  add: 'Añadir',
  closeList: 'Cerrar lista',
  addAllUsers: 'Añadir todos los usuarios',
  addAllUsersHint:
    'Concede acceso a todos los usuarios activos de Synapse que aún no son miembros. Los miembros existentes conservan su rol.',
  addAll: 'Añadir todos',
  addAllUsersMessage:
    '¿Conceder {role} a todos los usuarios activos de Synapse que aún no son miembros de «{name}»? Los miembros existentes no cambiarán.',
  shareOwnerOnlyHint:
    'Solo el propietario puede cambiar el uso compartido. Pide acceso de Edición si necesitas gestionar miembros.',
  roleEditVaultWiki: 'Edición (bóveda + wiki)',
  roleReadWikiOnly: 'Lectura (solo wiki)',
  shareFlashcardHint:
    'Cualquiera con el enlace puede estudiar esta flashcard hasta que caduque (o indefinidamente).',
  shareNoteHint:
    'Cualquiera con el enlace puede ver esta nota hasta que caduque (o indefinidamente).',
  sharePasswordOnce: ' La contraseña se muestra una vez.',
  shareNoPassword: ' Sin contraseña: basta con el enlace.',
  createShareLink: 'Crear enlace de compartición',
  copyPasswordOnce: 'Copia ahora: la contraseña no se mostrará de nuevo.',
  copyLinkNoPassword: 'Copia el enlace: no requiere contraseña.',
  linkLabel: 'Enlace',
  passwordLabel: 'Contraseña',
  copyAction: 'Copiar',
  copied: 'Copiado',
  expiresAtLabel: 'Caduca {date}',
  duration1h: '1 hora',
  duration24h: '24 horas',
  duration7d: '7 días',
  duration30d: '30 días',
  never: 'Nunca',
  transferCopy: 'Copiar',
  transferMove: 'Mover',
  moveTrashHint:
    'La nota original se moverá a la papelera de esta bóveda tras una transferencia correcta.',
  destination: 'Destino',
  existingVault: 'Bóveda existente',
  noOtherEditableVaults: 'No hay otras bóvedas editables',
  working: 'Trabajando…',
  moveNote: 'Mover nota',
  copyNoteAction: 'Copiar nota',
  openLinkSuffix: ' · enlace abierto',
  passwordSuffix: ' · contraseña',
  createdAtLabel: 'Creada {date}',
  revoke: 'Revocar',
  recentEnded: 'Finalizadas recientemente',
  sending: 'Enviando…',
  send: 'Enviar',
  noApprovedAnswers: 'Aún no hay respuestas aprobadas.',
  noAnswersYet: 'Aún no hay respuestas.',
  anonymous: 'Anónimo',
  approve: 'Aprobar',
  pendingStatus: 'Pendiente',
  reject: 'Rechazar',
  editAction: 'Editar',
  otherOption: 'Otra',
  saveDecision: 'Guardar decisión',
  lock: 'Bloquear',
  wikiOptionPrivate: 'Wiki: Privada (solo compartición)',
  wikiOptionAuthenticated: 'Wiki: Autenticados',
  wikiOptionUnlisted: 'Wiki: No listada',
  wikiOptionPublic: 'Wiki: Pública',
  nameCannotBeEmpty: 'El nombre no puede estar vacío',
  nameUnchanged: 'Nombre sin cambios',
  savingName: 'Guardando nombre…',
  renamedTo: 'Renombrada a «{name}»',
  savingVisibility: 'Guardando visibilidad predeterminada…',
  visibilitySetTo: 'Visibilidad predeterminada: {value}',
  exportFailed: 'Error al exportar',
  exportedSummary: 'Exportadas {notes} notas · {images} imágenes',
  noteRestored: 'Nota restaurada',
  deleteFailed: 'Error al eliminar',
  projectNotFoundOrg: 'Proyecto no encontrado en esta organización',
  projectNotFoundHint: 'Puede haberse eliminado o movido en Myelin. Desvincula y vincula otro proyecto.',
  unlinkProject: 'Desvincular proyecto',
  noProjectLinked: 'Aún no hay proyecto vinculado.',
  tasksLinkedSummary: 'Tareas: {linked} vinculadas · {missing} sin vincular',
  openLinkedSuffix: ' · {count} abiertas vinculadas',
  loadingOrganizations: 'Cargando organizaciones…',
  organizationEllipsis: 'Organización…',
  noOrganizations: 'Sin organizaciones',
  createProjectFromVault: 'Crear proyecto desde la bóveda',
  orLinkExisting: 'O vincular un proyecto existente',
  pickOrgFirst: 'Elige primero una organización…',
  loadingProjects: 'Cargando proyectos…',
  searchProjects: 'Buscar proyectos por nombre…',
  selectOrgToList: 'Selecciona una organización para listar proyectos.',
  noProjectsInOrg: 'No hay proyectos en esta organización.',
  noMatches: 'Sin coincidencias.',
  linkProjectFirst: 'Vincula primero un proyecto',
  allCheckboxesHaveTasks: 'Todas las casillas ya tienen tareas Myelin',
  autoLinkByDescription: 'Autovincular por descripción',
  selectNoteUnlinked: 'Selecciona una nota con casillas sin vincular',
  noUnlinkedInNote: 'No hay casillas sin vincular en esta nota',
  preparing: 'Preparando…',
  creatingTasks: 'Creando tareas…',
  unlinkConfirmMessage: 'Esto elimina la asociación de Synapse. La tarea de Myelin se conserva y puede vincularse de nuevo.',
  unlinking: 'Desvinculando…',
  unlink: 'Desvincular',
  expand: 'Ampliar',
  openBoard: 'Abrir tablero',
  openNoteAction: 'Abrir nota',
  reply: 'Responder',
  deleteAnswerShareMsg: 'Esto elimina tu respuesta pendiente de la nota compartida.',
  deleteAnswerEditorMsg: 'Esto oculta la respuesta de las comparticiones y del wiki. Se conserva el historial.',
  whiteboardNotFound: 'Pizarra no encontrada',
  missingWhiteboard: 'Falta la pizarra',
  createWhiteboardAction: 'Crear pizarra',
  editBoard: 'Editar tablero',
  loadingBoard: 'Cargando tablero…',
  noWhiteboardYet: 'Aún no hay una pizarra con este nombre. Crea una para incrustarla aquí.',
  hubPullOnlyBanner: 'Solo lectura desde Myelin. Usa Actualizar tareas en el panel de tareas (barra lateral derecha) para actualizar el trabajo asignado. Las notas vinculadas bajo el bloque de tareas se conservan.',
  linking: 'Vinculando…',
  referencesFromNote: 'Enlaces de esta nota',
  referencesFromBoard: 'Notas enlazadas desde este tablero',
  linkKindBoard: 'tablero',
  revisionAutosave: 'Autoguardado',
  revisionRefresh: 'Actualizar',
  revisionManual: 'Manual',
  compare: 'Comparar',
  showLess: 'Mostrar menos',
  showOlder: 'Mostrar {count} anteriores…',
  publicPage: 'Página pública',
  openNoteOnWiki: 'Abrir esta nota en el wiki →',
  enablePublicWikiFirst: 'Activa primero el wiki público en la cabecera de la bóveda.',
  wikiAudienceNoteHint: 'La audiencia del wiki sigue la visibilidad predeterminada de la bóveda. Cambia esta nota a pública, no listada o autenticados para publicarla; las notas privadas quedan ocultas para lectores de Compartir.',
  doneCount: '{count} hechas',
  unlinkedSuffix: ' · {count} sin vincular',
  pullOnlyTasksHint: 'Solo lectura desde Myelin: añade, quita y actualiza tareas asignadas a ti. Las notas vinculadas en la vista general se conservan.',
  recalculateEstimates: 'Recalcular estimaciones',
  suggestTodosAi: 'Sugerir todos con IA',
  noteTaskLabel: 'Tarea de la nota',
  noteTaskWithTitle: 'Tarea de la nota · {title}',
  noNoteLevelTask: 'Sin tarea Myelin a nivel de nota',
  unlinkedUse: '{count} sin vincular — usa',
  linkCreate: 'Vincular / crear',
  onTaskOrOpen: 'en una tarea, o abre',
  vaultMyelinSettings: 'Bóveda → Ajustes Myelin',
  forBulkActions: 'para acciones masivas.',
  emptyPullOnlyTasks: 'No tienes tareas Myelin asignadas ahora. Usa Actualizar tareas cuando haya trabajo en Myelin.',
  emptyTasksHint: 'Añade líneas - [ ] / [-] / [x] o YAML todos: para tareas. Indenta casillas anidadas para crear subtareas Myelin.',
  byCategory: 'Por categoría',
  noLinkableTasks: 'No hay tareas Myelin vinculables en esta organización.',
  noTasksMatchFilter: 'Ninguna tarea coincide con este filtro.',
  createNewTask: 'Crear tarea nueva',
  linkSelected: 'Vincular seleccionada',
  vaultProjectSuffix: ' (bóveda)',
  selectedLabel: 'Seleccionado: {name}',
  linkSelectedProject: 'Vincular proyecto seleccionado',
  reconnectSsoArrow: 'Reconectar SSO →',
  addPersonalTokenArrow: 'Añadir token personal en Perfil →',
  filterUnlinked: 'sin vincular',
  filterOpen: 'abiertas',
  filterAll: 'todas',
  createAllMissing: 'Crear todas las faltantes',
  createAllMissingCount: 'Crear todas las faltantes ({count})',
  createMissingTitle: 'Crear {count} tareas Myelin faltantes',
  checkboxTasksHint: 'De notas con líneas - [ ]. Crea una tarea Myelin nueva o vincula una existente (sin referencia Synapse). Desvincular conserva la tarea Myelin. Las casillas indentadas se convierten en subtareas Myelin al crearlas.',
  matchCheckboxesTitle: 'Emparejar {count} casillas con tareas Myelin por nombre / descripción',
  autoLinkNote: 'Autovincular nota',
  bulkCreated: 'creadas {count}',
  bulkFailed: ' · fallidas {count}',
  bulkSkipped: ' · omitidas {count}',
  noMatchingCheckboxes: 'Ninguna casilla coincide con este filtro.',
  attachments: 'Adjuntos',
  upload: 'Subir',
  emptyCheckbox: '(vacío)',
  inFolder: 'en la carpeta',
  emptyFoldCardsVault: 'No hay tarjetas fold en esta bóveda. Usa :::fold- Pregunta … ::: con la respuesta en el cuerpo.',
  visibilityDefault: 'Predeterminado ({value})',
  shareAccessHint: '{name} — Lectura = solo wiki; Edición = bóveda + wiki.',
  person: 'Persona',
  access: 'Acceso',
  actionsCol: 'Acciones',
  noPeopleOnVault: 'Aún no hay personas en esta bóveda.',
  noAnswer: 'Sin respuesta',
  noNotesFound: 'No se encontraron notas',
  noHistoryYet: 'Aún no hay historial.',
  chooseOption: 'Elija una opción',
  createWhiteboardHint: 'Nombra el tablero. Se admiten rutas anidadas como meta/board.',
  createNoteHint: 'Elige una plantilla y define el título. Se admiten rutas anidadas como meta/risks.',
  downloadDocx: 'Descargar DOCX',
  exportFormatsHint: 'Markdown, PDF/imprimir o plantilla Word',
  mindmapFolderHint: 'Pulse en una carpeta para abrir · arrastre el fondo para desplazarse',
  mindmapDashedHint: 'Discontinuo = otra carpeta · ← Carpetas para volver',
  crossFolderLinks: 'Enlaces entre carpetas',
  mindmapFolderBack: 'Discontinuo = otra carpeta · ← Carpetas para volver',
  noBodyDiff: 'Sin diferencias en el cuerpo.',
  mindmapAllNotesHint: 'Vista de todas las notas · desplazar / zoom · pulse para abrir',
  restoring: 'Restaurando…',
  loadingRevision: 'Cargando revisión…',
  revisionLabel: 'Revisión #{number}',
  currentLabel: 'Actual',
  revisionBody: 'Cuerpo de la revisión',
  currentBody: 'Cuerpo actual',
  pathLabel: 'Ruta',
  defaultShort: 'predeterminado',
  mine: 'Mía',
  noPreview: 'Sin vista previa',
  legendIntro: 'Barra + Ctrl/Cmd+B, I, K. Enter continúa listas y tareas. Pega o suelta imágenes/archivos. Escribe [[attach para insertar un enlace de adjunto.',
  legendBasics: 'Básicos',
  legendCode: 'Código y diagramas',
  legendCallouts: 'Avisos (callouts) y estructura',
  legendCheckboxes: 'Casillas',
  legendYaml: 'Propiedades (YAML)',
  legendLinks: 'Enlaces Synapse y etiquetas',
  legendBlurbCheckboxes: 'Marcadores de lista de tareas en el cuerpo. Las tareas Myelin vinculadas sincronizan el estado en estas marcas.',
  selectNoteHintBefore: 'O cree una. Los wikilinks como',
  selectNoteHintAfter: 'se resuelven en la vista previa en directo.',
  restoreFieldFromRevision: 'Restaurar {field} desde esta revisión',
  revisionDiffIntro: 'Diff al estilo Meld · a la izquierda la revisión #{number} · a la derecha la nota actual · restaure cambios individuales o toda la revisión',
  diffAddedCount: '+{count} añadidas',
  diffRemovedCount: '−{count} eliminadas',
  diffChangedCount: '~{count} cambiadas',
  diffChangeBlocks: '{count} bloque(s) de cambio',
  saveNoteBeforeAsk: 'Guarde la nota para activar las respuestas a esta pregunta.',
  answerHistoryTitle: 'Historial de respuestas',
  askEventSubmitted: 'Enviada por {actor}',
  askEventEdited: 'Editada por {actor}',
  askEventApproved: 'Aprobada por {actor}',
  askEventRejected: 'Rechazada por {actor}',
  askEventUnapproved: 'Desaprobada por {actor}',
  askEventDeleted: 'Eliminada por {actor}',
  askEventGeneric: '{event} · {actor}',
  lockedBadge: 'Bloqueada',
  saveNoteBeforeDecision: 'Guarde la nota para activar esta decisión.',
  noDecisionYet: 'Aún no hay decisión.',
  mindmapFolderStats: '{folders} carpetas · {links} enlaces entre carpetas',
  mindmapNoteStats: '{notes} notas · {links} enlaces',
  mindmapFolderEdgeTitle: '{from} ↔ {to} · {count} enlaces',
  mindmapFolderNodeTitle: '{title} — {notes} notas · {links} enlaces a otras carpetas. Pulse para abrir.',
  mindmapNodeNoAccess: '{title} — sin acceso',
  mindmapOtherFolderTitle: '{title} ({folder})',
  otherFolderFallback: 'otra carpeta',
  exportMarkdownHint: 'Descarga el cuerpo de la nota como archivo .md (incluido el frontmatter y las casillas).',
  exportPdfHintBefore: 'Abre el diálogo de impresión del sistema. Elija',
  exportPdfSaveAsPdf: 'Guardar como PDF',
  exportPdfHintAfter: 'o envíe a una impresora. El diseño usa la vista previa de la nota.',
  loadingWordTemplates: 'Cargando plantillas…',
  wordTemplateField: 'Plantilla',
  exportDocxMarkersHint: 'Use marcadores Carbone como {d.title}, {d.body}, {d.fm.<key>} y {d.<list>[i].<field>} para cuadrículas. Vea Ajustes → Exportación Word → Cómo crear plantillas.',
  iconDefault: 'Predeterminado',
  reviewAiTodosIntro: 'Edite, combine con existentes o descarte antes de actualizar la nota. Nada se guarda hasta aplicar.',
  noFrontmatterTodosYet: 'Aún no hay todos en el frontmatter.',
  keepTodo: 'Conservar',
  hoursLabel: 'Horas',
  statusLabel: 'Estado',
  noAiSuggestions: 'No se devolvieron sugerencias.',
  actionLabel: 'Acción',
  mergeTargetLabel: 'Destino',
  applying: 'Aplicando…',
  linkToNoteEllipsis: 'Enlazar a nota…',
  createNoteEllipsis: 'Crear nota…',
  createNewEllipsis: 'Crear nueva…',
  transferNoteIntro: 'Copie o mueva esta nota a otra bóveda. Los medios de la nota se incluyen; los enlaces Myelin no.',
  thisCheckboxFallback: 'esta casilla',
  linkOrCreateTaskHint: 'Para {label}. Vincule cualquier tarea sin Synapse de la organización (incluidos otros proyectos).',
  reconnectOrTokenForTasks: 'Reconecte el SSO o añada un token API personal en Perfil para cargar tareas Myelin.',
  projectLabel: 'Proyecto',
  requestShare: 'Solicitar compartir',
  makePrivate: 'Hacer privado',
  templateLabelField: 'Etiqueta',
  templateDescriptionField: 'Descripción',
  templateBodyField: 'Cuerpo (use {{title}} para el título de la nota)',
  paletteAria: 'Paleta {name}',
  whiteboardPrefix: 'Pizarra',
  couldNotLoadWhiteboard: 'No se pudo cargar la pizarra: {title}',
  previewError: 'Error de vista previa',
  legendBlurbYaml: 'Bloque opcional al inicio de la nota, entre ---. Se muestra como tarjeta Propiedades en la vista previa.',
};

const fr: ChromeMessages = {
  ...en,
  confirm: 'Confirmer',
  create: 'Créer',
  discardOpen: 'Abandonner et ouvrir',
  stay: 'Rester',
  jump: 'Aller',
  newNote: 'Nouveau…',
  mindmap: 'Carte mentale',
  editor: 'Éditeur',
  flashcards: 'Flashcards',
  cards: 'Cartes',
  importZip: 'Importer ZIP',
  myelinTasks: 'Tâches Myelin',
  publicWiki: 'Wiki public',
  enablePublicWiki: 'Activer le wiki public',
  disablePublicWiki: 'Désactiver le wiki public',
  filterNotes: 'Filtrer les notes…',
  filterNotesTitle: 'Filtre par titre, chemin ou corps',
  jumpTitle: 'Aller à la note (Ctrl/Cmd+O)',
  quickSwitcherFooter: '↑↓ naviguer · Entrée ouvrir · Échap fermer · Ctrl/Cmd+O',
  showMindmap: 'Afficher la carte mentale du coffre dans l’éditeur',
  studyFlashcards: 'Étudier les blocs :::fold de ce coffre en flashcards',
  importZipTitle: 'Importer des notes Markdown depuis un ZIP',
  closePanel: 'Fermer le panneau',
  noteTitle: 'Titre de la note',
  titlePlaceholder: 'meta/risques',
  titleHint: 'Utilisez dossier/nom pour l’imbrication (ex. meta/risques)',
  visibility: 'Visibilité',
  visPrivate: 'Privée',
  visAuthenticated: 'Authentifiés',
  visUnlisted: 'Non listée',
  visPublic: 'Publique',
  saveTitle: 'Enregistrer (Ctrl/Cmd+S)',
  maximizeWhiteboard: 'Maximiser le tableau',
  exportNote: 'Exporter la note (Markdown, PDF/impression ou Word)',
  export: 'Exporter',
  share: 'Partager',
  shareTitle: 'Partager un lien ou envoyer vers un autre coffre',
  linkMyWork: 'Lier à Mon travail',
  linkMyWorkTitle: 'Ajouter un wikilink vers cette note dans Mon travail',
  delete: 'Supprimer',
  deleteTitle: 'Déplacer cette note vers la corbeille',
  selectNote: 'Sélectionnez une note',
  info: 'Info',
  references: 'Références',
  backlinks: 'Rétroliens',
  backlinksHint: 'Notes qui pointent ici',
  noneYet: 'Aucune pour l’instant',
  noAccess: 'Sans accès',
  history: 'Historique',
  focusedMindmap: 'Carte mentale ciblée',
  saving: 'Enregistrement…',
  unsaved: 'Non enregistré',
  accessSuffix: 'accès',
  notes: 'Notes',
  moreActions: 'Plus d’actions',
  exitMaximize: 'Quitter le plein écran',
  unsavedTitle: 'Modifications non enregistrées',
  unsavedMessage:
    'Vous avez des modifications non enregistrées. Abandonnez-les et ouvrez l’autre note, ou annulez et enregistrez d’abord.',
  trashTitle: 'Déplacer vers la corbeille',
  trashMessage: 'Cette note sera déplacée vers la corbeille. Vous pourrez la restaurer plus tard dans Options du coffre.',
  importZipModalTitle: 'Importer ZIP',
  importZipMessage:
    'Les fichiers Markdown deviennent des notes ; les dossiers des chemins. Les images du ZIP sont téléversées et les liens relatifs réécrits si possible.',
  importSkipExisting: 'Importer (ignorer existants)',
  importOverwrite: 'Importer (écraser)',
  writeMarkdown: 'Écrire en Markdown…',
  viewEdit: 'Éditer',
  viewSplit: 'Divisé',
  viewPreview: 'Aperçu',
  help: 'Aide',
  markdownLegend: 'Légende Markdown',
  bold: 'Gras (Ctrl+B)',
  italic: 'Italique (Ctrl+I)',
  wikilink: 'Wikilink',
  taskList: 'Liste de tâches',
  insertImage: 'Insérer une image',
  attach: 'Joindre',
  uploading: 'Téléversement…',
  createNoteTitle: 'Nouvelle note',
  createWhiteboardTitle: 'Nouveau tableau',
  manageTemplates: 'Gérer les modèles',
  note: 'Note',
  whiteboard: 'Tableau',
  title: 'Titre',
  noMatchingTemplates: 'Aucun modèle correspondant',
  system: 'Système',
  global: 'Global',
  shared: 'Partagé',
  shareModalTitle: 'Partager',
  shareFlashcard: 'Partager la flashcard',
  temporaryLink: 'Lien temporaire',
  expires: 'Expire',
  requirePassword: 'Exiger un mot de passe',
  close: 'Fermer',
  linkTab: 'Lien',
  sendTab: 'Envoyer',
  searchVaults: 'Rechercher des coffres…',
  exportModalTitle: 'Exporter la note',
  tabMarkdown: 'Markdown',
  tabPdf: 'PDF / Imprimer',
  tabWord: 'Word',
  downloadMd: 'Télécharger MD',
  printPdf: 'Imprimer / Enregistrer PDF',
  noWordTemplates: 'Aucun modèle Word pour l’instant. Les admins peuvent en téléverser dans Paramètres → Export Word.',
  compareRestore: 'Comparer et restaurer',
  onlyChanges: 'Uniquement les changements',
  restoreAll: 'Tout restaurer',
  restoreChange: 'Restaurer uniquement ce changement',
  reviewAiTodos: 'Examiner les suggestions de tâches IA',
  analyzingAi: 'Analyse de la note avec l’IA…',
  existingTodos: 'Todos frontmatter existants',
  proposed: 'Proposées',
  addAsNew: 'Ajouter comme nouvelle',
  merge: 'Fusionner',
  discard: 'Abandonner',
  apply: 'Appliquer',
  vaultMyelin: 'Coffre · Myelin',
  myelinProject: 'Projet Myelin',
  checkboxTasks: 'Tâches case à cocher',
  unlinkMyelinTitle: 'Délier de Myelin ?',
  vaultOptions: 'Options du coffre',
  leaveVault: 'Quitter le coffre',
  linkOrCreateTask: 'Lier ou créer une tâche Myelin',
  allProjects: 'Tous les projets',
  searchTasks: 'Rechercher des tâches existantes',
  removeAttachmentTitle: 'Retirer la pièce jointe ?',
  remove: 'Retirer',
  templatesTitle: 'Modèles de notes',
  filterTemplates: 'Filtrer…',
  mineOnly: 'Les miens seulement',
  newPersonalTemplate: 'Nouveau modèle personnel',
  publicWikis: 'Wikis publics',
  filterWikis: 'Filtrer les wikis…',
  allWikis: 'Tous les wikis',
  openVault: 'Ouvrir ce coffre dans Synapse',
  selectPublicNote: 'Sélectionnez une note publique',
  shareUnavailable: 'Partage indisponible',
  backSynapse: 'Retour à Synapse',
  enterPassword: 'Saisissez le mot de passe pour voir cette note.',
  unlock: 'Déverrouiller',
  unlocking: 'Déverrouillage…',
  noExpiry: 'Sans expiration',
  installApp: 'Installer Synapse',
  installHintIosMenu: 'Appuyez sur Partager, puis sur Ajouter à l’écran d’accueil pour l’expérience application.',
  installHintDeferredMenu: 'Ajoutez Synapse à l’écran d’accueil pour un accès rapide.',
  installHintBrowserMenu: 'Utilisez le menu du navigateur pour Installer l’application ou Ajouter à l’écran d’accueil.',
  installHintIosBanner: 'Sur iPhone/iPad : appuyez sur Partager dans Safari, puis Ajouter à l’écran d’accueil.',
  installHintDeferredBanner: 'Installez l’application sur cet appareil pour une expérience de coffre en plein écran.',
  installHintBrowserBanner: 'Utilisez le menu du navigateur pour Installer l’application ou Ajouter à l’écran d’accueil pour une expérience de coffre en plein écran.',
  installShort: 'Installer',
  installAction: 'Installer l’application',
  notNow: 'Pas maintenant',
  linkedToPrefix: 'Lié à',
  projectHashId: 'Projet #{id}',
  myelinProjectHashId: 'Projet Myelin #{id}',
  backToNotes: 'Retour aux notes',
  noMatchingNotes: 'Aucune note correspondante',
  noPublicNotes: 'Aucune note publique',
  browseNotes: 'Parcourir les notes',
  linksFromThisNote: 'Liens depuis cette note',
  notesLinkedFromBoard: 'Notes liées depuis ce tableau',
  none: 'Aucun',
  notesCount: '{count} notes',
  noteCountOne: '{count} note',
  foldCardsEmptyWiki: 'Aucune carte fold sur les pages wiki visibles. Utilisez :::fold- Question … ::: dans une note publique (ou authentifiée).',
  publicWikisDirHint: 'Coffres avec le wiki public activé. Ce que vous voyez dépend de la visibilité des notes : publique pour tous, authentifiée pour les utilisateurs connectés, et contenus complets si vous avez accès au coffre.',
  noPublicWikisVisible: 'Aucun wiki public n’est encore visible. Activez le wiki public sur un coffre et publiez des notes.',
  noPublicWikisSignIn: 'Aucun wiki public pour l’instant. Connectez-vous pour voir les wikis authentifiés auxquels vous avez accès.',
  signedInUsers: 'Utilisateurs connectés',
  myTemplateLabel: 'Mon modèle',
  myTemplateDescription: 'Modèle de note personnel',
  vaultPmLinkHint: 'Liez un projet Myelin à ce coffre, puis créez des tâches à partir des cases des notes.',
  dismiss: 'Ignorer',
  reconnectSso: 'Reconnecter le SSO',
  openProfile: 'Ouvrir le profil',
  pmCredentialsMissing: 'Identifiants Myelin manquants ou expirés.',
  currentVault: 'Coffre actuel',
  switchVault: 'Changer de coffre',
  loadingMindmap: 'Chargement de la carte mentale…',
  tasksPanel: 'Tâches',
  refreshTasks: 'Actualiser les tâches',
  refreshing: 'Actualisation…',
  deleteTemplateTitle: 'Supprimer le modèle ?',
  deleteTemplateMessage: 'Cette action est irréversible.',
  shareVaultTitle: 'Partager le coffre',
  leaveVaultMessage: 'Quitter « {name} » ? Vous perdrez l’accès jusqu’à une nouvelle invitation.',
  leave: 'Quitter',
  find: 'Rechercher…',
  prevMatch: 'Occurrence précédente',
  nextMatch: 'Occurrence suivante',
  insertLink: 'Insérer le lien dans la note',
  insert: 'Insérer',
  searchCards: 'Rechercher des cartes…',
  openSourceNote: 'Ouvrir la note source',
  activeShares: 'Partages actifs',
  removeAttachmentMessage: 'Le fichier sera retiré de cette note. Cette action est irréversible.',
  sumEstimatesTitle:
    'Sommer les heures des cases + todos YAML par catégorie dans l’estimation (manquants → Other ; Total indent 0)',
  askOllamaTodosTitle: 'Demander à Ollama externe de proposer des todos YAML (examiner avant enregistrement)',
  openNoteTaskMyelin: 'Ouvrir la tâche de la note dans Myelin',
  fromYamlTodos: 'Depuis les todos du frontmatter YAML',
  categoryLabel: 'Catégorie',
  estimateLabel: 'Estimation',
  openNoteTitle: 'Ouvrir la note {name}',
  missingNoteTitle: 'Note manquante : {name}',
  noAccessThisNote: 'Vous n’avez pas accès à cette note',
  openInMyelin: 'Ouvrir dans Myelin',
  linkOrCreateMyelinTaskTitle: 'Créer une nouvelle tâche Myelin ou lier une existante',
  reconnectMyelinTasks: 'Reconnectez Myelin pour créer ou synchroniser des tâches.',
  addPersonalTokenProfile: 'Ajoutez un jeton personnel dans le Profil',
  totalLabel: 'Total',
  markAsOpen: 'Marquer comme ouverte',
  markAsDone: 'Marquer comme terminée',
  taskDone: 'Terminée',
  taskOpen: 'Ouverte',
  taskInProgress: 'En cours',
  pullOnlyRefreshHint: 'Lecture seule — actualisez depuis Myelin pour mettre à jour',
  projectsAria: 'Projets',
  removeSynapseLinkTitle: 'Retirer le lien Synapse ; conserver la tâche Myelin',
  selectNoteEllipsis: 'Sélectionner une note…',
  searchUsers: 'Rechercher des utilisateurs',
  searchUsersPlaceholder: 'Rechercher des utilisateurs…',
  accessRoleNewMember: 'Rôle d’accès pour le nouveau membre',
  accessRoleBulkAdd: 'Rôle d’accès pour l’ajout en masse',
  addAllUsersTitle: 'Ajouter tous les utilisateurs ?',
  filterTasksExtended: 'Filtrer par nom, projet ou id…',
  shareModeAria: 'Mode de partage',
  newVaultPlaceholder: 'Nouveau coffre',
  nameOptional: 'Nom (facultatif)',
  yourNameOptional: 'Votre nom (facultatif)',
  writeReply: 'Écrire une réponse…',
  yourAnswer: 'Votre réponse',
  deleteAnswerTitle: 'Supprimer la réponse ?',
  decisionHistory: 'Historique des décisions',
  describeDecisionPlaceholder: 'Décrire la décision…',
  customDecision: 'Décision personnalisée',
  askHistoryAria: 'Historique : {question}',
  diagramFullscreen: 'Diagramme en plein écran',
  zoomOut: 'Zoom arrière',
  zoomIn: 'Zoom avant',
  fitDiagram: 'Ajuster le diagramme à l’écran',
  enableZoom: 'Activer le zoom',
  disableZoom: 'Désactiver le zoom',
  imagePreview: 'Aperçu de l’image',
  linkToNote: 'Lier à une note',
  mindmapView: 'Vue carte mentale',
  filterFolders: 'Filtrer les dossiers…',
  filterByLinkKind: 'Filtrer par type de lien',
  resetView: 'Réinitialiser la vue',
  resetButton: 'Réinitialiser',
  viewFolders: 'Dossiers',
  viewAllNotes: 'Toutes les notes',
  linkWikilinks: 'Wikilinks',
  linkAll: 'Tous les liens',
  linkMentions: 'Mentions',
  linkOther: 'Autres',
  folderClusters: 'Groupes de dossiers',
  backFolders: '← Dossiers',
  noteIcon: 'Icône de note',
  chooseNoteIcon: 'Choisir l’icône de note',
  noteLinkSuggestions: 'Suggestions de liens vers des notes',
  findInNote: 'Rechercher dans la note',
  whiteboardPreview: 'Aperçu du tableau',
  notePreview: 'Aperçu de la note',
  exitFullscreen: 'Quitter le plein écran (Échap)',
  expandFullscreen: 'Passer en plein écran',
  itemTypeAria: 'Type d’élément',
  blankCanvasPreview: 'Un canevas de dessin vide sera créé.',
  selectTemplatePreview: 'Sélectionnez un modèle',
  manageVaults: 'Gérer les coffres…',
  selectEllipsis: 'Sélectionner…',
  strikethrough: 'Barré',
  heading1: 'Titre 1',
  heading2: 'Titre 2',
  heading3: 'Titre 3',
  bulletList: 'Liste à puces',
  numberedList: 'Liste numérotée',
  quote: 'Citation',
  inlineCode: 'Code en ligne',
  codeBlock: 'Bloc de code',
  linkCtrlK: 'Lien (Ctrl+K)',
  tag: 'Étiquette',
  divider: 'Séparateur',
  nothingToPreview: 'Rien à prévisualiser pour l’instant.',
  studyFlashcardsWiki: 'Étudier les blocs :::fold des pages wiki visibles',
  exportFormatAria: 'Format d’export',
  toastRestoredChange: 'Modification sélectionnée restaurée',
  toastRefreshMyelinFailed: 'Impossible d’actualiser les tâches Myelin',
  toastLinkedMyWork: 'Lié à Mon travail',
  toastLinkMyWorkFailed: 'Impossible de lier à Mon travail',
  toastFlashcardsFailed: 'Échec du chargement des flashcards',
  toastLinkMyelinFirst: 'Liez d’abord un projet Myelin dans Options du coffre',
  toastZipImportFailed: 'Échec de l’import ZIP',
  toastChooseZip: 'Veuillez choisir un fichier .zip',
  toastZipTooLarge: 'ZIP trop volumineux (max. 20 Mo)',
  toastImportingZip: 'Import ZIP…',
  toastImportingZipOverwrite: 'Import ZIP (écrasement)…',
  toastImportSummary:
    'Import : {created} créées, {updated} mises à jour, {skipped} ignorées, {images} images',
  scanningVault: 'Analyse du coffre…',
  deleteVault: 'Supprimer le coffre',
  vaultOptionsExport: 'Exporter',
  vaultOptionsTrash: 'Corbeille',
  vaultOptionsLinks: 'Liens',
  vaultOptionsSubtitle: '{name} — liens, partage, corbeille, exportation et Myelin.',
  brokenLinksTab: 'Liens brisés',
  vaultTab: 'Coffre',
  refresh: 'Actualiser',
  noBrokenWikilinks: 'Aucun [[wikilink]] brisé trouvé.',
  brokenLinksSummary: '{count} liens brisés · {unique} cibles uniques',
  allWikilinksResolve: 'Tous les wikilinks pointent vers des notes existantes.',
  createNote: 'Créer une note',
  trashSoftDeletedHint:
    'Notes supprimées temporairement. Restaurez-les ou supprimez-les définitivement.',
  loadingTrash: 'Chargement de la corbeille…',
  trashEmpty: 'La corbeille est vide.',
  restore: 'Restaurer',
  deleteForever: 'Supprimer définitivement',
  vaultNameHeading: 'Nom',
  vaultNameHint:
    'Nom affiché de ce coffre. Le slug du wiki reste inchangé pour que les liens existants fonctionnent.',
  saveName: 'Enregistrer le nom',
  onlyOwnerRename: 'Seul le propriétaire peut renommer.',
  wikiAudienceHeading: 'Audience du wiki (visibilité par défaut)',
  wikiAudienceHint:
    'Qui peut ouvrir le wiki de ce coffre lorsque les pages publiques sont activées. Aussi la valeur par défaut des notes « Défaut du coffre ». Les exceptions par note s’appliquent toujours dans le wiki.',
  vaultWikiAudience: 'Audience du wiki du coffre',
  visPrivateDetail: 'Privé — partage uniquement',
  visAuthenticatedDetail: 'Authentifiés — tout utilisateur connecté',
  visUnlistedDetail: 'Non listé — lien seulement (masqué de /w)',
  visPublicDetail: 'Public — tout le monde',
  onlyOwnerChange: 'Seul le propriétaire peut modifier ceci.',
  exportZipHint: 'Télécharger toutes les notes en Markdown et images (compatible import ZIP).',
  exporting: 'Export…',
  exportZip: 'Exporter ZIP',
  leaveVaultHint: 'Retire votre accès. Vous pourrez être invité de nouveau plus tard.',
  deleteVaultHint:
    'Supprime définitivement ce coffre, toutes les notes, révisions et médias. Irréversible.',
  deleteVaultTypeConfirm: 'Tapez {name} pour confirmer la suppression définitive.',
  deleting: 'Suppression…',
  failedScanLinks: 'Échec de l’analyse des liens',
  networkScanLinks: 'Erreur réseau lors de l’analyse des liens',
  creatingNamedNote: 'Création de « {title} »…',
  createdNamedNote: '« {title} » créée',
  couldNotCreateNote: 'Impossible de créer la note',
  failedRenameVault: 'Échec du renommage du coffre',
  failedUpdateVisibility: 'Échec de la mise à jour de la visibilité par défaut',
  couldNotLeaveVault: 'Impossible de quitter le coffre',
  restoreFailed: 'Échec de la restauration',
  ownerLabel: 'Propriétaire',
  fullAccess: 'Accès complet',
  wikiOnlyRead: 'Wiki seul (Lecture)',
  vaultWikiEdit: 'Coffre + wiki (Édition)',
  addPeople: 'Ajouter des personnes',
  addPeopleHint: 'Recherchez des utilisateurs Synapse et accordez Lecture wiki ou Édition coffre.',
  noUsersFound: 'Aucun utilisateur trouvé.',
  alreadyAdded: 'Déjà ajouté',
  add: 'Ajouter',
  closeList: 'Fermer la liste',
  addAllUsers: 'Ajouter tous les utilisateurs',
  addAllUsersHint:
    'Accorde l’accès à tous les utilisateurs Synapse actifs qui ne sont pas encore membres. Les membres existants gardent leur rôle.',
  addAll: 'Tout ajouter',
  addAllUsersMessage:
    'Accorder {role} à tous les utilisateurs Synapse actifs qui ne sont pas déjà membres de « {name} » ? Les membres existants ne seront pas modifiés.',
  shareOwnerOnlyHint:
    'Seul le propriétaire peut modifier le partage. Demandez un accès Édition pour gérer les membres.',
  roleEditVaultWiki: 'Édition (coffre + wiki)',
  roleReadWikiOnly: 'Lecture (wiki seul)',
  shareFlashcardHint:
    'Toute personne avec le lien peut étudier cette flashcard jusqu’à expiration (ou indéfiniment).',
  shareNoteHint:
    'Toute personne avec le lien peut voir cette note jusqu’à expiration (ou indéfiniment).',
  sharePasswordOnce: ' Le mot de passe n’est affiché qu’une fois.',
  shareNoPassword: ' Sans mot de passe — le lien suffit.',
  createShareLink: 'Créer un lien de partage',
  copyPasswordOnce: 'Copiez maintenant — le mot de passe ne sera plus affiché.',
  copyLinkNoPassword: 'Copiez le lien — aucun mot de passe requis.',
  linkLabel: 'Lien',
  passwordLabel: 'Mot de passe',
  copyAction: 'Copier',
  copied: 'Copié',
  expiresAtLabel: 'Expire le {date}',
  duration1h: '1 heure',
  duration24h: '24 heures',
  duration7d: '7 jours',
  duration30d: '30 jours',
  never: 'Jamais',
  transferCopy: 'Copier',
  transferMove: 'Déplacer',
  moveTrashHint:
    'La note d’origine sera déplacée vers la corbeille de ce coffre après un transfert réussi.',
  destination: 'Destination',
  existingVault: 'Coffre existant',
  noOtherEditableVaults: 'Aucun autre coffre modifiable',
  working: 'Traitement…',
  moveNote: 'Déplacer la note',
  copyNoteAction: 'Copier la note',
  openLinkSuffix: ' · lien ouvert',
  passwordSuffix: ' · mot de passe',
  createdAtLabel: 'Créé le {date}',
  revoke: 'Révoquer',
  recentEnded: 'Récemment terminés',
  sending: 'Envoi…',
  send: 'Envoyer',
  noApprovedAnswers: 'Aucune réponse approuvée pour l’instant.',
  noAnswersYet: 'Aucune réponse pour l’instant.',
  anonymous: 'Anonyme',
  approve: 'Approuver',
  pendingStatus: 'En attente',
  reject: 'Rejeter',
  editAction: 'Modifier',
  otherOption: 'Autre',
  saveDecision: 'Enregistrer la décision',
  lock: 'Verrouiller',
  wikiOptionPrivate: 'Wiki : Privé (partage seul)',
  wikiOptionAuthenticated: 'Wiki : Authentifiés',
  wikiOptionUnlisted: 'Wiki : Non listé',
  wikiOptionPublic: 'Wiki : Public',
  nameCannotBeEmpty: 'Le nom ne peut pas être vide',
  nameUnchanged: 'Nom inchangé',
  savingName: 'Enregistrement du nom…',
  renamedTo: 'Renommé en « {name} »',
  savingVisibility: 'Enregistrement de la visibilité par défaut…',
  visibilitySetTo: 'Visibilité par défaut définie sur {value}',
  exportFailed: 'Échec de l’export',
  exportedSummary: 'Exporté : {notes} notes · {images} images',
  noteRestored: 'Note restaurée',
  deleteFailed: 'Échec de la suppression',
  projectNotFoundOrg: 'Projet introuvable dans cette organisation',
  projectNotFoundHint: 'Il a peut-être été supprimé ou déplacé dans Myelin. Déliez et liez un autre projet.',
  unlinkProject: 'Délier le projet',
  noProjectLinked: 'Aucun projet lié pour l’instant.',
  tasksLinkedSummary: 'Tâches : {linked} liées · {missing} non liées',
  openLinkedSuffix: ' · {count} ouvertes liées',
  loadingOrganizations: 'Chargement des organisations…',
  organizationEllipsis: 'Organisation…',
  noOrganizations: 'Aucune organisation',
  createProjectFromVault: 'Créer un projet depuis le coffre',
  orLinkExisting: 'Ou lier un projet existant',
  pickOrgFirst: 'Choisissez d’abord une organisation…',
  loadingProjects: 'Chargement des projets…',
  searchProjects: 'Rechercher des projets par nom…',
  selectOrgToList: 'Sélectionnez une organisation pour lister les projets.',
  noProjectsInOrg: 'Aucun projet dans cette organisation.',
  noMatches: 'Aucune correspondance.',
  linkProjectFirst: 'Liez d’abord un projet',
  allCheckboxesHaveTasks: 'Toutes les cases ont déjà des tâches Myelin',
  autoLinkByDescription: 'Lier automatiquement par description',
  selectNoteUnlinked: 'Sélectionnez une note avec des cases non liées',
  noUnlinkedInNote: 'Aucune case non liée dans cette note',
  preparing: 'Préparation…',
  creatingTasks: 'Création des tâches…',
  unlinkConfirmMessage: 'Cela retire l’association Synapse. La tâche Myelin est conservée et peut être reliée plus tard.',
  unlinking: 'Dissociation…',
  unlink: 'Délier',
  expand: 'Agrandir',
  openBoard: 'Ouvrir le tableau',
  openNoteAction: 'Ouvrir la note',
  reply: 'Répondre',
  deleteAnswerShareMsg: 'Cela retire votre réponse en attente de la note partagée.',
  deleteAnswerEditorMsg: 'Cela masque la réponse des partages et du wiki. L’historique est conservé.',
  whiteboardNotFound: 'Tableau blanc introuvable',
  missingWhiteboard: 'Tableau blanc manquant',
  createWhiteboardAction: 'Créer un tableau blanc',
  editBoard: 'Modifier le tableau',
  loadingBoard: 'Chargement du tableau…',
  noWhiteboardYet: 'Aucun tableau blanc avec ce nom. Créez-en un pour l’intégrer ici.',
  hubPullOnlyBanner: 'Lecture seule depuis Myelin. Utilisez Actualiser les tâches dans le panneau des tâches (barre latérale droite) pour mettre à jour le travail qui vous est assigné. Les notes liées sous le bloc de tâches sont conservées.',
  linking: 'Liaison…',
  referencesFromNote: 'Liens depuis cette note',
  referencesFromBoard: 'Notes liées depuis ce tableau',
  linkKindBoard: 'tableau',
  revisionAutosave: 'Enregistrement auto',
  revisionRefresh: 'Actualisation',
  revisionManual: 'Manuel',
  compare: 'Comparer',
  showLess: 'Afficher moins',
  showOlder: 'Afficher {count} plus anciennes…',
  publicPage: 'Page publique',
  openNoteOnWiki: 'Ouvrir cette note sur le wiki →',
  enablePublicWikiFirst: 'Activez d’abord le wiki public dans l’en-tête du coffre.',
  wikiAudienceNoteHint: 'L’audience du wiki suit la visibilité par défaut du coffre. Passez cette note en public, non listé ou authentifié pour la publier ; les notes privées restent masquées aux lecteurs Partage.',
  doneCount: '{count} terminées',
  unlinkedSuffix: ' · {count} non liées',
  pullOnlyTasksHint: 'Lecture seule depuis Myelin — ajoute, retire et met à jour les tâches qui vous sont assignées. Les notes liées de la vue d’ensemble sont conservées.',
  recalculateEstimates: 'Recalculer les estimations',
  suggestTodosAi: 'Suggérer des todos avec l’IA',
  noteTaskLabel: 'Tâche de la note',
  noteTaskWithTitle: 'Tâche de la note · {title}',
  noNoteLevelTask: 'Aucune tâche Myelin au niveau de la note',
  unlinkedUse: '{count} non liées — utilisez',
  linkCreate: 'Lier / créer',
  onTaskOrOpen: 'sur une tâche, ou ouvrez',
  vaultMyelinSettings: 'Coffre → Paramètres Myelin',
  forBulkActions: 'pour les actions en masse.',
  emptyPullOnlyTasks: 'Aucune tâche Myelin ne vous est assignée pour l’instant. Utilisez Actualiser les tâches quand du travail est assigné dans Myelin.',
  emptyTasksHint: 'Ajoutez des lignes - [ ] / [-] / [x] ou YAML todos: pour les tâches. Indentez les cases imbriquées pour créer des sous-tâches Myelin.',
  byCategory: 'Par catégorie',
  noLinkableTasks: 'Aucune tâche Myelin liaisonnable dans cette organisation.',
  noTasksMatchFilter: 'Aucune tâche ne correspond à ce filtre.',
  createNewTask: 'Créer une nouvelle tâche',
  linkSelected: 'Lier la sélection',
  vaultProjectSuffix: ' (coffre)',
  selectedLabel: 'Sélectionné : {name}',
  linkSelectedProject: 'Lier le projet sélectionné',
  reconnectSsoArrow: 'Reconnecter SSO →',
  addPersonalTokenArrow: 'Ajouter un jeton personnel dans Profil →',
  filterUnlinked: 'non liées',
  filterOpen: 'ouvertes',
  filterAll: 'toutes',
  createAllMissing: 'Créer toutes les manquantes',
  createAllMissingCount: 'Créer toutes les manquantes ({count})',
  createMissingTitle: 'Créer {count} tâches Myelin manquantes',
  checkboxTasksHint: 'Depuis les notes avec des lignes - [ ]. Créez une nouvelle tâche Myelin ou liez-en une existante (sans référence Synapse). Délier conserve la tâche Myelin. Les cases indentées deviennent des sous-tâches Myelin à la création.',
  matchCheckboxesTitle: 'Associer {count} cases aux tâches Myelin par nom / description',
  autoLinkNote: 'Lier automatiquement la note',
  bulkCreated: 'créées {count}',
  bulkFailed: ' · échecs {count}',
  bulkSkipped: ' · ignorées {count}',
  noMatchingCheckboxes: 'Aucune case ne correspond à ce filtre.',
  attachments: 'Pièces jointes',
  upload: 'Téléverser',
  emptyCheckbox: '(vide)',
  inFolder: 'dans le dossier',
  emptyFoldCardsVault: 'Aucune carte fold dans ce coffre. Utilisez :::fold- Question … ::: avec la réponse dans le corps.',
  visibilityDefault: 'Défaut ({value})',
  shareAccessHint: '{name} — Lecture = wiki seul ; Édition = coffre + wiki.',
  person: 'Personne',
  access: 'Accès',
  actionsCol: 'Actions',
  noPeopleOnVault: 'Aucune personne sur ce coffre pour l’instant.',
  noAnswer: 'Pas de réponse',
  noNotesFound: 'Aucune note trouvée',
  noHistoryYet: 'Pas encore d’historique.',
  chooseOption: 'Choisissez une option',
  createWhiteboardHint: 'Nommez le tableau. Les chemins imbriqués comme meta/board sont pris en charge.',
  createNoteHint: 'Choisissez un modèle, puis le titre. Les chemins imbriqués comme meta/risks sont pris en charge.',
  downloadDocx: 'Télécharger DOCX',
  exportFormatsHint: 'Markdown, PDF/impression ou modèle Word',
  mindmapFolderHint: 'Cliquez sur un dossier pour ouvrir · glissez l’arrière-plan pour déplacer',
  mindmapDashedHint: 'Pointillé = autre dossier · ← Dossiers pour revenir',
  crossFolderLinks: 'Liens entre dossiers',
  mindmapFolderBack: 'Pointillé = autre dossier · ← Dossiers pour revenir',
  noBodyDiff: 'Aucune différence dans le corps.',
  mindmapAllNotesHint: 'Vue de toutes les notes · déplacement / zoom · clic pour ouvrir',
  restoring: 'Restauration…',
  loadingRevision: 'Chargement de la révision…',
  revisionLabel: 'Révision #{number}',
  currentLabel: 'Actuel',
  revisionBody: 'Corps de la révision',
  currentBody: 'Corps actuel',
  pathLabel: 'Chemin',
  defaultShort: 'défaut',
  mine: 'Mien',
  noPreview: 'Aucun aperçu',
  legendIntro: 'Barre + Ctrl/Cmd+B, I, K. Entrée continue listes et tâches. Collez ou déposez images/fichiers. Tapez [[attach pour insérer un lien de pièce jointe.',
  legendBasics: 'Bases',
  legendCode: 'Code et diagrammes',
  legendCallouts: 'Encadrés (callouts) et structure',
  legendCheckboxes: 'Cases à cocher',
  legendYaml: 'Propriétés (YAML)',
  legendLinks: 'Liens Synapse et tags',
  legendBlurbCheckboxes: 'Marqueurs de liste de tâches dans le corps. Les tâches Myelin liées synchronisent l’état dans ces marques.',
  selectNoteHintBefore: 'Ou créez-en une. Les wikilinks comme',
  selectNoteHintAfter: 'se résolvent dans l’aperçu en direct.',
  restoreFieldFromRevision: 'Restaurer {field} depuis cette révision',
  revisionDiffIntro: 'Diff façon Meld · à gauche la révision #{number} · à droite la note actuelle · restaurez des changements individuels ou toute la révision',
  diffAddedCount: '+{count} ajoutées',
  diffRemovedCount: '−{count} supprimées',
  diffChangedCount: '~{count} modifiées',
  diffChangeBlocks: '{count} bloc(s) de modification',
  saveNoteBeforeAsk: 'Enregistrez la note pour activer les réponses à cette question.',
  answerHistoryTitle: 'Historique des réponses',
  askEventSubmitted: 'Envoyée par {actor}',
  askEventEdited: 'Modifiée par {actor}',
  askEventApproved: 'Approuvée par {actor}',
  askEventRejected: 'Rejetée par {actor}',
  askEventUnapproved: 'Désapprouvée par {actor}',
  askEventDeleted: 'Supprimée par {actor}',
  askEventGeneric: '{event} · {actor}',
  lockedBadge: 'Verrouillée',
  saveNoteBeforeDecision: 'Enregistrez la note pour activer cette décision.',
  noDecisionYet: 'Pas encore de décision.',
  mindmapFolderStats: '{folders} dossiers · {links} liens entre dossiers',
  mindmapNoteStats: '{notes} notes · {links} liens',
  mindmapFolderEdgeTitle: '{from} ↔ {to} · {count} liens',
  mindmapFolderNodeTitle: '{title} — {notes} notes · {links} liens vers d’autres dossiers. Cliquez pour ouvrir.',
  mindmapNodeNoAccess: '{title} — aucun accès',
  mindmapOtherFolderTitle: '{title} ({folder})',
  otherFolderFallback: 'autre dossier',
  exportMarkdownHint: 'Télécharge le corps de la note en fichier .md (frontmatter et cases à cocher inclus).',
  exportPdfHintBefore: 'Ouvre la boîte de dialogue d’impression. Choisissez',
  exportPdfSaveAsPdf: 'Enregistrer au format PDF',
  exportPdfHintAfter: 'ou envoyez vers une imprimante. La mise en page utilise l’aperçu rendu de la note.',
  loadingWordTemplates: 'Chargement des modèles…',
  wordTemplateField: 'Modèle',
  exportDocxMarkersHint: 'Utilisez les marqueurs Carbone tels que {d.title}, {d.body}, {d.fm.<key>} et {d.<list>[i].<field>} pour les grilles. Voir Paramètres → Export Word → Comment créer des modèles.',
  iconDefault: 'Par défaut',
  reviewAiTodosIntro: 'Modifiez, fusionnez avec l’existant ou ignorez avant de mettre à jour la note. Rien n’est enregistré tant que vous n’appliquez pas.',
  noFrontmatterTodosYet: 'Pas encore de todos dans le frontmatter.',
  keepTodo: 'Conserver',
  hoursLabel: 'Heures',
  statusLabel: 'Statut',
  noAiSuggestions: 'Aucune suggestion renvoyée.',
  actionLabel: 'Action',
  mergeTargetLabel: 'Cible',
  applying: 'Application…',
  linkToNoteEllipsis: 'Lier à une note…',
  createNoteEllipsis: 'Créer une note…',
  createNewEllipsis: 'Créer…',
  transferNoteIntro: 'Copiez ou déplacez cette note vers un autre coffre. Les médias de la note sont inclus ; les liens Myelin ne le sont pas.',
  thisCheckboxFallback: 'cette case',
  linkOrCreateTaskHint: 'Pour {label}. Liez toute tâche sans Synapse de l’organisation (y compris d’autres projets).',
  reconnectOrTokenForTasks: 'Reconnectez le SSO ou ajoutez un jeton API personnel dans Profil pour charger les tâches Myelin.',
  projectLabel: 'Projet',
  requestShare: 'Demander le partage',
  makePrivate: 'Rendre privé',
  templateLabelField: 'Libellé',
  templateDescriptionField: 'Description',
  templateBodyField: 'Corps (utilisez {{title}} pour le titre de la note)',
  paletteAria: 'Palette {name}',
  whiteboardPrefix: 'Tableau blanc',
  couldNotLoadWhiteboard: 'Impossible de charger le tableau blanc : {title}',
  previewError: 'Erreur d’aperçu',
  legendBlurbYaml: 'Bloc optionnel en tête de note, entre ---. Affiché comme carte Propriétés en aperçu.',
};

export const chromeEn = en;
export const chromePt = pt;
export const chromeEs = es;
export const chromeFr = fr;
