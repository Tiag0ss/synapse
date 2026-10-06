/** Markdown help legend (pt/en/es/fr). PT uses pre-1990 Orthographic Agreement spelling. */

import type { Locale } from './config';

export type LegendSection = {
  title: string;
  blurb?: string;
  items: Array<{ syntax: string; meaning: string }>;
};

const en: LegendSection[] = [
  {
    title: 'Basics',
    items: [
      { syntax: '**bold**', meaning: 'Bold' },
      { syntax: '_italic_', meaning: 'Italic' },
      { syntax: '~~strike~~', meaning: 'Strikethrough' },
      { syntax: 'line ⏎ line', meaning: 'Single Enter → new line in preview' },
      { syntax: 'line ⏎⏎ line', meaning: 'Blank line → new paragraph' },
      { syntax: '# / ## / ###', meaning: 'Headings' },
      { syntax: '- item', meaning: 'Bullet list' },
      { syntax: '1. item', meaning: 'Numbered list' },
      { syntax: '- [ ] task', meaning: 'Checklist (pushable task)' },
      { syntax: '- [ ] task (2h)', meaning: 'Estimate hours on create in Myelin' },
      {
        syntax: '- [ ] task (1.5h, Design)',
        meaning: 'Hours + category for Recalculate estimates (missing category → Other)',
      },
      { syntax: '- [ ] task (unscheduled)', meaning: 'Mark unscheduled work on create' },
      { syntax: '> quote', meaning: 'Block quote' },
      { syntax: '---', meaning: 'Horizontal rule (in the body)' },
      { syntax: '[label](url)', meaning: 'External link' },
      { syntax: '![alt](url)', meaning: 'Image (or paste / drop)' },
    ],
  },
  {
    title: 'Code & diagrams',
    items: [
      { syntax: '`code`', meaning: 'Inline code — click to copy in preview' },
      { syntax: '```lang', meaning: 'Fenced block — highlight + Copy button' },
      { syntax: '```mermaid', meaning: 'Diagram — Expand opens fullscreen' },
      { syntax: '$…$ / $$…$$', meaning: 'Math (KaTeX)' },
    ],
  },
  {
    title: 'Callouts & structure',
    items: [
      { syntax: '> [!NOTE]', meaning: 'Callout (also tip, warning, danger, …)' },
      { syntax: '> [!NOTE]- / +', meaning: 'Foldable callout (starts closed / open)' },
      {
        syntax: ':::fold Title … :::',
        meaning:
          'Collapsible section (starts open); title/body also work as flashcard front/back (vault Flashcards mode)',
      },
      { syntax: ':::fold- Title … :::', meaning: 'Collapsible (starts closed) — preferred for flashcards' },
      {
        syntax: ':::ask Question … :::',
        meaning: 'Q&A block — guests answer on password shares; approve answers in preview',
      },
      { syntax: '[[toc]]', meaning: 'Table of contents from #–######' },
      { syntax: '[^1] / [^1]:', meaning: 'Footnote reference + definition' },
    ],
  },
  {
    title: 'Checkboxes',
    blurb: 'Task list markers in the note body. Linked Myelin tasks sync status into these marks.',
    items: [
      { syntax: '- [x]', meaning: 'Done (closed in Myelin)' },
      { syntax: '- [x] ~~task~~', meaning: 'Cancelled in Myelin (checked + strike)' },
      { syntax: '- [-]', meaning: 'Partial / stub — In Progress in Myelin' },
      { syntax: '- [ ]', meaning: 'Not started (open)' },
    ],
  },
  {
    title: 'Properties (YAML)',
    blurb:
      'Optional block at the very top of the note, between --- fences. Shown as the Properties card in preview.',
    items: [
      { syntax: '--- … ---', meaning: 'Open/close the YAML block (must be first)' },
      { syntax: 'title: My note', meaning: 'Simple field (string, number, true/false)' },
      { syntax: 'tags: [a, b]', meaning: 'Scalar list → chips; used for filters' },
      {
        syntax: 'todos: …',
        meaning:
          'id, status, content → Properties + note tasks; push to Myelin. hours / unscheduled on create; note: links to another note; when linked, status follows Myelin status names. Suggest todos with AI (Tasks panel) proposes items via external Ollama — review before save',
      },
      { syntax: 'hours: 2.5', meaning: 'Under a todo → estimatedHours on Myelin create' },
      {
        syntax: 'category: Design',
        meaning:
          'Under a todo → groups hours; Recalculate writes estimate (indent 1), Other if missing, Task Total indent 0',
      },
      {
        syntax: 'unscheduled: true',
        meaning: 'Under a todo → unscheduledWork on create (not implied by missing hours)',
      },
      {
        syntax: 'related: […]',
        meaning:
          'Top-level list of linked notes (same vault or @vault-slug/note). Quote @… and [[…]] in YAML, or Synapse quotes them when parsing',
      },
      {
        syntax: 'note: meta/risks',
        meaning:
          'Under a todo → link to another note (title or path; quote "@vault/note" or "[[wikilink]]" in YAML)',
      },
      {
        syntax: '@ / autocomplete',
        meaning: 'In [[…]], related:, or note: — type @ for vaults, / for notes',
      },
      {
        syntax: '[[attach',
        meaning: 'Autocomplete attachments for this note → inserts [file](url) or ![img](url)',
      },
    ],
  },
  {
    title: 'Synapse links & tags',
    items: [
      {
        syntax: '[[Note title]]',
        meaning: 'Wikilink — text opens the note; magnifier previews it',
      },
      {
        syntax: '![[Whiteboard]]',
        meaning: 'Embed a whiteboard mid-note (preview / wiki / share)',
      },
      { syntax: '[[meta/risks]]', meaning: 'Link by folder path' },
      { syntax: '[[risks]]', meaning: 'Link by unique leaf name' },
      {
        syntax: '[[@vault-slug/note]]',
        meaning: 'Link to a note in another vault (shows “no access” if you lack permission)',
      },
      { syntax: '[[Note|label]]', meaning: 'Wikilink with custom label' },
      {
        syntax: 'plain Title',
        meaning: 'Auto-mention (dashed) — text opens; magnifier previews',
      },
      { syntax: '#tag', meaning: 'Inline tag for filtering / graph' },
      { syntax: '![alt](url)', meaning: 'Embedded image (paste / Img / Attach)' },
      { syntax: '[file.pdf](url)', meaning: 'Attachment link (Attach toolbar or [[attach)' },
    ],
  },
];

const pt: LegendSection[] = [
  {
    title: 'Básicos',
    items: [
      { syntax: '**bold**', meaning: 'Negrito' },
      { syntax: '_italic_', meaning: 'Itálico' },
      { syntax: '~~strike~~', meaning: 'Rasurado' },
      { syntax: 'line ⏎ line', meaning: 'Enter simples → nova linha na pré-visualização' },
      { syntax: 'line ⏎⏎ line', meaning: 'Linha em branco → novo parágrafo' },
      { syntax: '# / ## / ###', meaning: 'Títulos' },
      { syntax: '- item', meaning: 'Lista com marcas' },
      { syntax: '1. item', meaning: 'Lista numerada' },
      { syntax: '- [ ] task', meaning: 'Lista de verificação (tarefa enviável)' },
      { syntax: '- [ ] task (2h)', meaning: 'Estimativa em horas ao criar no Myelin' },
      {
        syntax: '- [ ] task (1.5h, Design)',
        meaning: 'Horas + categoria para Recalcular estimativas (sem categoria → Other)',
      },
      { syntax: '- [ ] task (unscheduled)', meaning: 'Marcar trabalho não agendado ao criar' },
      { syntax: '> quote', meaning: 'Citação' },
      { syntax: '---', meaning: 'Linha horizontal (no corpo)' },
      { syntax: '[label](url)', meaning: 'Ligação externa' },
      { syntax: '![alt](url)', meaning: 'Imagem (ou colar / largar)' },
    ],
  },
  {
    title: 'Código e diagramas',
    items: [
      { syntax: '`code`', meaning: 'Código em linha — clique para copiar na pré-visualização' },
      { syntax: '```lang', meaning: 'Bloco delimitado — destaque + botão Copiar' },
      { syntax: '```mermaid', meaning: 'Diagrama — Expandir abre ecrã completo' },
      { syntax: '$…$ / $$…$$', meaning: 'Matemática (KaTeX)' },
    ],
  },
  {
    title: 'Avisos (callouts) e estrutura',
    items: [
      { syntax: '> [!NOTE]', meaning: 'Callout (também tip, warning, danger, …)' },
      { syntax: '> [!NOTE]- / +', meaning: 'Callout dobrável (começa fechado / aberto)' },
      {
        syntax: ':::fold Title … :::',
        meaning:
          'Secção colapsável (começa aberta); título/corpo também servem de frente/verso do flashcard (modo Flashcards do cofre)',
      },
      {
        syntax: ':::fold- Title … :::',
        meaning: 'Colapsável (começa fechada) — preferido para flashcards',
      },
      {
        syntax: ':::ask Question … :::',
        meaning:
          'Bloco P&R — convidados respondem em partilhas com palavra-passe; aprove respostas na pré-visualização',
      },
      { syntax: '[[toc]]', meaning: 'Índice a partir de #–######' },
      { syntax: '[^1] / [^1]:', meaning: 'Referência de nota de rodapé + definição' },
    ],
  },
  {
    title: 'Caixas de verificação',
    blurb:
      'Marcadores de lista de tarefas no corpo da nota. Tarefas Myelin ligadas sincronizam o estado nestes marcadores.',
    items: [
      { syntax: '- [x]', meaning: 'Concluída (fechada no Myelin)' },
      { syntax: '- [x] ~~task~~', meaning: 'Cancelada no Myelin (marcada + rasurado)' },
      { syntax: '- [-]', meaning: 'Parcial / rascunho — Em progresso no Myelin' },
      { syntax: '- [ ]', meaning: 'Não iniciada (aberta)' },
    ],
  },
  {
    title: 'Propriedades (YAML)',
    blurb:
      'Bloco opcional no topo da nota, entre barreiras ---. Mostrado como cartão Propriedades na pré-visualização.',
    items: [
      { syntax: '--- … ---', meaning: 'Abrir/fechar o bloco YAML (tem de ser o primeiro)' },
      { syntax: 'title: My note', meaning: 'Campo simples (texto, número, true/false)' },
      { syntax: 'tags: [a, b]', meaning: 'Lista escalar → chips; usada em filtros' },
      {
        syntax: 'todos: …',
        meaning:
          'id, status, content → Propriedades + tarefas da nota; envio para Myelin. hours / unscheduled ao criar; note: liga a outra nota; quando ligada, o estado segue os nomes de estado Myelin. Sugerir todos com IA (painel Tarefas) propõe itens via Ollama externo — reveja antes de guardar',
      },
      { syntax: 'hours: 2.5', meaning: 'Num todo → estimatedHours ao criar no Myelin' },
      {
        syntax: 'category: Design',
        meaning:
          'Num todo → agrupa horas; Recalcular escreve estimativa (indent 1), Other se em falta, Task Total indent 0',
      },
      {
        syntax: 'unscheduled: true',
        meaning: 'Num todo → unscheduledWork ao criar (não implícito por falta de hours)',
      },
      {
        syntax: 'related: […]',
        meaning:
          'Lista de topo de notas ligadas (mesmo cofre ou @vault-slug/note). Quote @… e [[…]] no YAML, ou o Synapse cita-as ao analisar',
      },
      {
        syntax: 'note: meta/risks',
        meaning:
          'Num todo → ligação a outra nota (título ou caminho; quote "@vault/note" ou "[[wikilink]]" no YAML)',
      },
      {
        syntax: '@ / autocomplete',
        meaning: 'Em [[…]], related: ou note: — escreva @ para cofres, / para notas',
      },
      {
        syntax: '[[attach',
        meaning: 'Autocompletar anexos desta nota → insere [file](url) ou ![img](url)',
      },
    ],
  },
  {
    title: 'Ligações Synapse e etiquetas',
    items: [
      {
        syntax: '[[Note title]]',
        meaning: 'Wikilink — o texto abre a nota; a lupa faz pré-visualização',
      },
      {
        syntax: '![[Whiteboard]]',
        meaning: 'Incorpora um quadro branco a meio da nota (pré-visualização / wiki / partilha)',
      },
      { syntax: '[[meta/risks]]', meaning: 'Ligação por caminho de pasta' },
      { syntax: '[[risks]]', meaning: 'Ligação por nome folha único' },
      {
        syntax: '[[@vault-slug/note]]',
        meaning: 'Ligação a nota noutro cofre (mostra «sem acesso» se não tiver permissão)',
      },
      { syntax: '[[Note|label]]', meaning: 'Wikilink com rótulo personalizado' },
      {
        syntax: 'plain Title',
        meaning: 'Menção automática (tracejado) — o texto abre; a lupa pré-visualiza',
      },
      { syntax: '#tag', meaning: 'Etiqueta em linha para filtros / grafo' },
      { syntax: '![alt](url)', meaning: 'Imagem incorporada (colar / Img / Anexar)' },
      { syntax: '[file.pdf](url)', meaning: 'Ligação de anexo (barra Anexar ou [[attach)' },
    ],
  },
];

/** ES/FR inherit EN structure with translated copy. */
const es: LegendSection[] = [
  {
    title: 'Básicos',
    items: [
      { syntax: '**bold**', meaning: 'Negrita' },
      { syntax: '_italic_', meaning: 'Cursiva' },
      { syntax: '~~strike~~', meaning: 'Tachado' },
      { syntax: 'line ⏎ line', meaning: 'Enter simple → nueva línea en la vista previa' },
      { syntax: 'line ⏎⏎ line', meaning: 'Línea en blanco → nuevo párrafo' },
      { syntax: '# / ## / ###', meaning: 'Títulos' },
      { syntax: '- item', meaning: 'Lista con viñetas' },
      { syntax: '1. item', meaning: 'Lista numerada' },
      { syntax: '- [ ] task', meaning: 'Lista de verificación (tarea enviable)' },
      { syntax: '- [ ] task (2h)', meaning: 'Estimación en horas al crear en Myelin' },
      {
        syntax: '- [ ] task (1.5h, Design)',
        meaning: 'Horas + categoría para Recalcular estimaciones (sin categoría → Other)',
      },
      { syntax: '- [ ] task (unscheduled)', meaning: 'Marcar trabajo no programado al crear' },
      { syntax: '> quote', meaning: 'Cita' },
      { syntax: '---', meaning: 'Línea horizontal (en el cuerpo)' },
      { syntax: '[label](url)', meaning: 'Enlace externo' },
      { syntax: '![alt](url)', meaning: 'Imagen (o pegar / soltar)' },
    ],
  },
  {
    title: 'Código y diagramas',
    items: [
      { syntax: '`code`', meaning: 'Código en línea — pulse para copiar en la vista previa' },
      { syntax: '```lang', meaning: 'Bloque delimitado — resaltado + botón Copiar' },
      { syntax: '```mermaid', meaning: 'Diagrama — Expandir abre pantalla completa' },
      { syntax: '$…$ / $$…$$', meaning: 'Matemáticas (KaTeX)' },
    ],
  },
  {
    title: 'Avisos (callouts) y estructura',
    items: [
      { syntax: '> [!NOTE]', meaning: 'Callout (también tip, warning, danger, …)' },
      { syntax: '> [!NOTE]- / +', meaning: 'Callout plegable (empieza cerrado / abierto)' },
      {
        syntax: ':::fold Title … :::',
        meaning:
          'Sección plegable (empieza abierta); título/cuerpo también sirven de frente/reverso de flashcard',
      },
      {
        syntax: ':::fold- Title … :::',
        meaning: 'Plegable (empieza cerrada) — preferido para flashcards',
      },
      {
        syntax: ':::ask Question … :::',
        meaning:
          'Bloque P&R — los invitados responden en comparticiones con contraseña; aprueba respuestas en la vista previa',
      },
      { syntax: '[[toc]]', meaning: 'Tabla de contenidos desde #–######' },
      { syntax: '[^1] / [^1]:', meaning: 'Referencia de nota al pie + definición' },
    ],
  },
  {
    title: 'Casillas',
    blurb:
      'Marcadores de lista de tareas en el cuerpo. Las tareas Myelin vinculadas sincronizan el estado en estas marcas.',
    items: [
      { syntax: '- [x]', meaning: 'Hecha (cerrada en Myelin)' },
      { syntax: '- [x] ~~task~~', meaning: 'Cancelada en Myelin (marcada + tachado)' },
      { syntax: '- [-]', meaning: 'Parcial — En progreso en Myelin' },
      { syntax: '- [ ]', meaning: 'No iniciada (abierta)' },
    ],
  },
  {
    title: 'Propiedades (YAML)',
    blurb:
      'Bloque opcional al inicio de la nota, entre --- . Se muestra como tarjeta Propiedades en la vista previa.',
    items: [
      { syntax: '--- … ---', meaning: 'Abrir/cerrar el bloque YAML (debe ser lo primero)' },
      { syntax: 'title: My note', meaning: 'Campo simple (texto, número, true/false)' },
      { syntax: 'tags: [a, b]', meaning: 'Lista escalar → chips; usada en filtros' },
      {
        syntax: 'todos: …',
        meaning:
          'id, status, content → Propiedades + tareas de la nota; envío a Myelin. hours / unscheduled al crear; note: enlace a otra nota. Sugerir todos con IA propone ítems vía Ollama — revisa antes de guardar',
      },
      { syntax: 'hours: 2.5', meaning: 'En un todo → estimatedHours al crear en Myelin' },
      {
        syntax: 'category: Design',
        meaning:
          'En un todo → agrupa horas; Recalcular escribe estimación (indent 1), Other si falta',
      },
      {
        syntax: 'unscheduled: true',
        meaning: 'En un todo → unscheduledWork al crear',
      },
      {
        syntax: 'related: […]',
        meaning: 'Lista de notas vinculadas (misma bóveda o @vault-slug/note)',
      },
      {
        syntax: 'note: meta/risks',
        meaning: 'En un todo → enlace a otra nota (título o ruta)',
      },
      {
        syntax: '@ / autocomplete',
        meaning: 'En [[…]], related: o note: — escribe @ para bóvedas, / para notas',
      },
      {
        syntax: '[[attach',
        meaning: 'Autocompletar adjuntos → inserta [file](url) o ![img](url)',
      },
    ],
  },
  {
    title: 'Enlaces Synapse y etiquetas',
    items: [
      {
        syntax: '[[Note title]]',
        meaning: 'Wikilink — el texto abre la nota; la lupa previsualiza',
      },
      {
        syntax: '![[Whiteboard]]',
        meaning: 'Incrusta una pizarra en la nota (vista previa / wiki / compartir)',
      },
      { syntax: '[[meta/risks]]', meaning: 'Enlace por ruta de carpeta' },
      { syntax: '[[risks]]', meaning: 'Enlace por nombre hoja único' },
      {
        syntax: '[[@vault-slug/note]]',
        meaning: 'Enlace a nota en otra bóveda (muestra «sin acceso» si no tienes permiso)',
      },
      { syntax: '[[Note|label]]', meaning: 'Wikilink con etiqueta personalizada' },
      {
        syntax: 'plain Title',
        meaning: 'Mención automática (discontinua) — el texto abre; la lupa previsualiza',
      },
      { syntax: '#tag', meaning: 'Etiqueta en línea para filtros / grafo' },
      { syntax: '![alt](url)', meaning: 'Imagen incrustada (pegar / Img / Adjuntar)' },
      { syntax: '[file.pdf](url)', meaning: 'Enlace de adjunto (barra Adjuntar o [[attach)' },
    ],
  },
];

const fr: LegendSection[] = [
  {
    title: 'Bases',
    items: [
      { syntax: '**bold**', meaning: 'Gras' },
      { syntax: '_italic_', meaning: 'Italique' },
      { syntax: '~~strike~~', meaning: 'Barré' },
      { syntax: 'line ⏎ line', meaning: 'Entrée simple → nouvelle ligne dans l’aperçu' },
      { syntax: 'line ⏎⏎ line', meaning: 'Ligne vide → nouveau paragraphe' },
      { syntax: '# / ## / ###', meaning: 'Titres' },
      { syntax: '- item', meaning: 'Liste à puces' },
      { syntax: '1. item', meaning: 'Liste numérotée' },
      { syntax: '- [ ] task', meaning: 'Liste de tâches (envoyable)' },
      { syntax: '- [ ] task (2h)', meaning: 'Estimation en heures à la création dans Myelin' },
      {
        syntax: '- [ ] task (1.5h, Design)',
        meaning: 'Heures + catégorie pour Recalculer les estimations (sans catégorie → Other)',
      },
      { syntax: '- [ ] task (unscheduled)', meaning: 'Marquer un travail non planifié à la création' },
      { syntax: '> quote', meaning: 'Citation' },
      { syntax: '---', meaning: 'Ligne horizontale (dans le corps)' },
      { syntax: '[label](url)', meaning: 'Lien externe' },
      { syntax: '![alt](url)', meaning: 'Image (ou coller / déposer)' },
    ],
  },
  {
    title: 'Code et diagrammes',
    items: [
      { syntax: '`code`', meaning: 'Code en ligne — clic pour copier dans l’aperçu' },
      { syntax: '```lang', meaning: 'Bloc délimité — surbrillance + bouton Copier' },
      { syntax: '```mermaid', meaning: 'Diagramme — Agrandir ouvre le plein écran' },
      { syntax: '$…$ / $$…$$', meaning: 'Mathématiques (KaTeX)' },
    ],
  },
  {
    title: 'Encadrés (callouts) et structure',
    items: [
      { syntax: '> [!NOTE]', meaning: 'Callout (aussi tip, warning, danger, …)' },
      { syntax: '> [!NOTE]- / +', meaning: 'Callout pliable (ferme / ouvert au départ)' },
      {
        syntax: ':::fold Title … :::',
        meaning:
          'Section pliable (ouverte au départ) ; titre/corps servent aussi de recto/verso flashcard',
      },
      {
        syntax: ':::fold- Title … :::',
        meaning: 'Pliable (fermée au départ) — préféré pour les flashcards',
      },
      {
        syntax: ':::ask Question … :::',
        meaning:
          'Bloc Q&R — les invités répondent sur les partages avec mot de passe ; approuvez dans l’aperçu',
      },
      { syntax: '[[toc]]', meaning: 'Table des matières depuis #–######' },
      { syntax: '[^1] / [^1]:', meaning: 'Référence de note de bas de page + définition' },
    ],
  },
  {
    title: 'Cases à cocher',
    blurb:
      'Marqueurs de liste de tâches dans le corps. Les tâches Myelin liées synchronisent l’état dans ces marques.',
    items: [
      { syntax: '- [x]', meaning: 'Terminée (fermée dans Myelin)' },
      { syntax: '- [x] ~~task~~', meaning: 'Annulée dans Myelin (cochée + barré)' },
      { syntax: '- [-]', meaning: 'Partielle — En cours dans Myelin' },
      { syntax: '- [ ]', meaning: 'Non commencée (ouverte)' },
    ],
  },
  {
    title: 'Propriétés (YAML)',
    blurb:
      'Bloc optionnel en tête de note, entre --- . Affiché comme carte Propriétés dans l’aperçu.',
    items: [
      { syntax: '--- … ---', meaning: 'Ouvrir/fermer le bloc YAML (doit être en premier)' },
      { syntax: 'title: My note', meaning: 'Champ simple (texte, nombre, true/false)' },
      { syntax: 'tags: [a, b]', meaning: 'Liste scalaire → chips ; utilisée pour les filtres' },
      {
        syntax: 'todos: …',
        meaning:
          'id, status, content → Propriétés + tâches de la note ; envoi vers Myelin. hours / unscheduled à la création. Suggérer des todos avec l’IA propose des éléments via Ollama — vérifiez avant d’enregistrer',
      },
      { syntax: 'hours: 2.5', meaning: 'Sous un todo → estimatedHours à la création Myelin' },
      {
        syntax: 'category: Design',
        meaning: 'Sous un todo → regroupe les heures ; Recalculer écrit l’estimation',
      },
      {
        syntax: 'unscheduled: true',
        meaning: 'Sous un todo → unscheduledWork à la création',
      },
      {
        syntax: 'related: […]',
        meaning: 'Liste de notes liées (même coffre ou @vault-slug/note)',
      },
      {
        syntax: 'note: meta/risks',
        meaning: 'Sous un todo → lien vers une autre note (titre ou chemin)',
      },
      {
        syntax: '@ / autocomplete',
        meaning: 'Dans [[…]], related: ou note: — tapez @ pour les coffres, / pour les notes',
      },
      {
        syntax: '[[attach',
        meaning: 'Autocomplétion des pièces jointes → insère [file](url) ou ![img](url)',
      },
    ],
  },
  {
    title: 'Liens Synapse et balises',
    items: [
      {
        syntax: '[[Note title]]',
        meaning: 'Wikilink — le texte ouvre la note ; la loupe prévisualise',
      },
      {
        syntax: '![[Whiteboard]]',
        meaning: 'Intègre un tableau blanc dans la note (aperçu / wiki / partage)',
      },
      { syntax: '[[meta/risks]]', meaning: 'Lien par chemin de dossier' },
      { syntax: '[[risks]]', meaning: 'Lien par nom de feuille unique' },
      {
        syntax: '[[@vault-slug/note]]',
        meaning: 'Lien vers une note d’un autre coffre (« sans accès » si permission manquante)',
      },
      { syntax: '[[Note|label]]', meaning: 'Wikilink avec libellé personnalisé' },
      {
        syntax: 'plain Title',
        meaning: 'Mention auto (tirets) — le texte ouvre ; la loupe prévisualise',
      },
      { syntax: '#tag', meaning: 'Balise en ligne pour filtres / graphe' },
      { syntax: '![alt](url)', meaning: 'Image intégrée (coller / Img / Joindre)' },
      { syntax: '[file.pdf](url)', meaning: 'Lien de pièce jointe (barre Joindre ou [[attach)' },
    ],
  },
];

const catalogs: Record<Locale, LegendSection[]> = { en, pt, es, fr };

export function legendSections(locale: Locale): LegendSection[] {
  return catalogs[locale] || catalogs.en;
}
