'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnSelectionChangeParams,
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowObjectNode } from '@/components/flow/FlowObjectNode';
import {
  buildSequenceParticipants,
  defaultPortsForKind,
  newFlowNodeId,
  parseFlowDocument,
  serializeFlowDocument,
  type FlowNodeData,
  type FlowNodeKind,
  type FlowNodeShape,
  type FlowPort,
  type FlowPortSide,
} from '@/lib/flowDocument';
import { exportFlow } from '@/lib/flowExport';
import { decorateFlowEdges, edgeOutputLabel, syncOutgoingEdgeLabels } from '@/lib/flowEdges';
import { flowToMermaid, mermaidToFlow } from '@/lib/flowMermaid';
import { emptyParticipant } from '@/lib/flowSequence';
import {
  answerFlowRun,
  initialFlowRunState,
  startFlowRun,
  type FlowRunState,
} from '@/lib/flowRun';
import { useI18n } from '@/lib/i18n/provider';
import PromptModal from '@/components/PromptModal';

const nodeTypes = { flowObject: FlowObjectNode };
const HISTORY_LIMIT = 50;

type FlowEditorProps = {
  noteId: number;
  vaultId: string;
  boardPath: string;
  boardJson: string | null;
  canEdit: boolean;
  onBoardChange: (boardJson: string) => void;
};

function slugPortId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_]+/g, '_') || 'port';
}

/**
 * Parse comma-separated ports; keep previous ids by index so edges stay attached.
 * Empty segments are unlabeled ports (e.g. "a,,b" or ",,"). Labels are optional.
 * A fully blank field clears labels but keeps the previous port count/ids.
 */
function portsFromText(raw: string, previous: FlowPort[] = []): FlowPort[] {
  if (!String(raw).trim()) {
    return previous.map((p) => ({ id: p.id, name: '' }));
  }

  const names = String(raw).split(/[,;\n]/).map((s) => s.trim());
  const used = new Set<string>();
  return names.map((name, i) => {
    let id = previous[i]?.id || (name ? slugPortId(name) : `port_${i + 1}`);
    if (used.has(id)) id = `${name ? slugPortId(name) : 'port'}_${i + 1}`;
    used.add(id);
    return { id, name };
  });
}

function resizePorts(previous: FlowPort[], count: number, prefix: string): FlowPort[] {
  const n = Math.max(0, Math.min(12, Math.floor(count)));
  const used = new Set<string>();
  const next: FlowPort[] = [];
  for (let i = 0; i < n; i++) {
    const prev = previous[i];
    // New slots stay unlabeled — description is optional.
    const name = prev ? prev.name : '';
    let id = prev?.id || `${prefix}_${i + 1}`;
    if (used.has(id)) id = `${prefix}_${i + 1}`;
    used.add(id);
    next.push({ id, name });
  }
  return next;
}

function FlowEditorInner({
  noteId,
  boardPath,
  boardJson,
  canEdit,
  onBoardChange,
}: FlowEditorProps) {
  const { t } = useI18n();
  const initialRef = useRef(parseFlowDocument(boardJson));
  const [nodes, setNodes, onNodesChange] = useNodesState(initialRef.current.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialRef.current.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{
    x: number;
    y: number;
    target: 'node' | 'edge' | 'pane';
    id?: string;
  } | null>(null);
  const [run, setRun] = useState<FlowRunState>(initialFlowRunState);
  const [mermaidOpen, setMermaidOpen] = useState(false);
  const [mermaidDraft, setMermaidDraft] = useState('');
  /** Draft port lists so commas can be typed; commit on blur. */
  const [inputsDraft, setInputsDraft] = useState<string | null>(null);
  const [outputsDraft, setOutputsDraft] = useState<string | null>(null);
  const [sidebarTyping, setSidebarTyping] = useState(false);
  const viewportRef = useRef<Viewport>(
    initialRef.current.viewport || { x: 0, y: 0, zoom: 1 }
  );
  const historyRef = useRef<{ nodes: Node<FlowNodeData>[]; edges: Edge[] }[]>([]);
  const futureRef = useRef<{ nodes: Node<FlowNodeData>[]; edges: Edge[] }[]>([]);
  const skipHistory = useRef(false);
  const hydratedNoteId = useRef<number | null>(null);
  /** Skip re-hydrate when boardJson echo is from our own persist (keeps input focus). */
  const lastEmittedJson = useRef<string | null>(
    boardJson?.trim()
      ? boardJson
      : serializeFlowDocument(
          initialRef.current.nodes,
          initialRef.current.edges,
          initialRef.current.viewport
        )
  );
  const { fitView } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Re-hydrate only when opening another note or receiving an external boardJson change.
  useEffect(() => {
    const noteChanged = hydratedNoteId.current !== noteId;
    if (!noteChanged && boardJson === lastEmittedJson.current) return;

    const doc = parseFlowDocument(boardJson);
    skipHistory.current = true;
    setNodes(doc.nodes);
    setEdges(doc.edges);
    viewportRef.current = doc.viewport || { x: 0, y: 0, zoom: 1 };
    lastEmittedJson.current = serializeFlowDocument(doc.nodes, doc.edges, doc.viewport);
    if (noteChanged) {
      historyRef.current = [];
      futureRef.current = [];
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setCtxMenu(null);
      setRun(initialFlowRunState());
      hydratedNoteId.current = noteId;
      requestAnimationFrame(() => fitView({ padding: 0.2 }));
    }
  }, [noteId, boardJson, setNodes, setEdges, fitView]);

  const pushHistory = useCallback(
    (nextNodes: Node<FlowNodeData>[], nextEdges: Edge[]) => {
      if (skipHistory.current) {
        skipHistory.current = false;
        return;
      }
      historyRef.current.push({
        nodes: structuredClone(nodes),
        edges: structuredClone(edges),
      });
      if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
      futureRef.current = [];
      void nextNodes;
      void nextEdges;
    },
    [nodes, edges]
  );

  const persist = useCallback(
    (nextNodes: Node<FlowNodeData>[], nextEdges: Edge[]) => {
      if (!canEdit) return;
      const json = serializeFlowDocument(nextNodes, nextEdges, viewportRef.current);
      lastEmittedJson.current = json;
      onBoardChange(json);
    },
    [canEdit, onBoardChange]
  );

  const commit = useCallback(
    (nextNodes: Node<FlowNodeData>[], nextEdges: Edge[], recordHistory = true) => {
      if (recordHistory) pushHistory(nextNodes, nextEdges);
      setNodes(nextNodes);
      setEdges(nextEdges);
      persist(nextNodes, nextEdges);
    },
    [persist, pushHistory, setNodes, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!canEdit) return;
      pushHistory(nodes, edges);
      const sourceNode = nodes.find((n) => n.id === connection.source);
      let label = edgeOutputLabel(nodes, {
        source: connection.source || '',
        sourceHandle: connection.sourceHandle,
        label: null,
      });
      if (!label && sourceNode?.data.kind === 'participant') {
        label = 'message';
      }
      const next = addEdge(
        {
          ...connection,
          id: `e_${connection.source}_${connection.sourceHandle || 'out'}_${connection.target}_${Date.now()}`,
          label: label || undefined,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: 'var(--accent-soft)',
          },
        },
        edges
      );
      setEdges(next);
      persist(nodes, next);
      if (sourceNode?.data.kind === 'participant') {
        setSelectedEdgeId(
          next.find(
            (e) =>
              e.source === connection.source &&
              e.target === connection.target &&
              e.sourceHandle === connection.sourceHandle
          )?.id || null
        );
        setSelectedNodeId(null);
      }
    },
    [canEdit, nodes, edges, persist, pushHistory, setEdges]
  );

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedNodeId(params.nodes[0]?.id ?? null);
    setSelectedEdgeId(params.edges[0]?.id ?? null);
  }, []);

  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );
  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) || null,
    [edges, selectedEdgeId]
  );

  useEffect(() => {
    setInputsDraft(null);
    setOutputsDraft(null);
  }, [selectedNodeId]);

  const closeCtxMenu = useCallback(() => setCtxMenu(null), []);

  const preventBrowserMenu = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
  }, []);

  const handleNodesChange = useCallback(
    (changes: NodeChange<Node<FlowNodeData>>[]) => {
      if (!canEdit) return;
      const removing = changes.some((c) => c.type === 'remove');
      if (removing) {
        pushHistory(nodes, edges);
        const nextNodes = applyNodeChanges(changes, nodes);
        const removedIds = new Set(
          changes.filter((c) => c.type === 'remove').map((c) => c.id)
        );
        const nextEdges = edges.filter(
          (e) => !removedIds.has(e.source) && !removedIds.has(e.target)
        );
        setNodes(nextNodes);
        setEdges(nextEdges);
        persist(nextNodes, nextEdges);
        setSelectedNodeId((cur) => (cur && removedIds.has(cur) ? null : cur));
        return;
      }
      onNodesChange(changes);
    },
    [canEdit, nodes, edges, onNodesChange, pushHistory, persist, setNodes, setEdges]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      if (!canEdit) return;
      const removing = changes.some((c) => c.type === 'remove');
      if (removing) {
        pushHistory(nodes, edges);
        const nextEdges = applyEdgeChanges(changes, edges);
        setEdges(nextEdges);
        persist(nodes, nextEdges);
        const removedIds = new Set(
          changes.filter((c) => c.type === 'remove').map((c) => c.id)
        );
        setSelectedEdgeId((cur) => (cur && removedIds.has(cur) ? null : cur));
        return;
      }
      onEdgesChange(changes);
    },
    [canEdit, nodes, edges, onEdgesChange, pushHistory, persist, setEdges]
  );

  const openCtxMenu = useCallback(
    (
      e: { preventDefault(): void; stopPropagation(): void; clientX: number; clientY: number },
      target: 'node' | 'edge' | 'pane',
      id?: string
    ) => {
      e.preventDefault();
      e.stopPropagation();
      if (!canEdit && target !== 'pane') {
        setCtxMenu(null);
        return;
      }
      setCtxMenu({ x: e.clientX, y: e.clientY, target, id });
      if (target === 'node' && id) {
        setSelectedNodeId(id);
        setSelectedEdgeId(null);
      } else if (target === 'edge' && id) {
        setSelectedEdgeId(id);
        setSelectedNodeId(null);
      }
    },
    [canEdit]
  );

  const updateSelectedData = (patch: Partial<FlowNodeData>) => {
    if (!canEdit || !selectedNodeId) return;
    // Local update + persist only — no history/rehydrate so sidebar inputs keep focus.
    const nextNodes = nodes.map((n) =>
      n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n
    );
    const nextEdges =
      patch.outputs != null
        ? syncOutgoingEdgeLabels(nextNodes, edges, selectedNodeId)
        : edges;
    setNodes(nextNodes);
    if (nextEdges !== edges) setEdges(nextEdges);
    persist(nextNodes, nextEdges);
    if (
      patch.inputsSide != null ||
      patch.outputsSide != null ||
      patch.inputs != null ||
      patch.outputs != null ||
      patch.shape != null
    ) {
      const nodeId = selectedNodeId;
      requestAnimationFrame(() => {
        updateNodeInternals(nodeId);
        window.setTimeout(() => updateNodeInternals(nodeId), 16);
      });
    }
  };

  const displayEdges = useMemo(
    () =>
      decorateFlowEdges(nodes, edges).map((e) => ({
        ...e,
        selectable: true,
        focusable: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: e.id === selectedEdgeId ? 'var(--accent)' : 'var(--accent-soft)',
        },
        style: {
          ...(e.style || {}),
          stroke: e.id === selectedEdgeId ? 'var(--accent)' : 'var(--accent-soft)',
          strokeWidth: e.id === selectedEdgeId ? 3 : 2,
        },
      })),
    [nodes, edges, selectedEdgeId]
  );

  const addNode = (kind: FlowNodeKind) => {
    if (!canEdit) return;
    if (kind === 'participant') {
      const count = nodes.filter((n) => n.data.kind === 'participant').length;
      const node = emptyParticipant(t('chrome.flowKindParticipant'), count);
      node.id = newFlowNodeId(nodes);
      node.position = {
        x: 80 + count * 200,
        y: 40,
      };
      commit([...nodes, node], edges);
      setSelectedNodeId(node.id);
      setSelectedEdgeId(null);
      return;
    }
    const ports = defaultPortsForKind(kind);
    const id = newFlowNodeId(nodes);
    const label =
      kind === 'start'
        ? t('chrome.flowKindStart')
        : kind === 'end'
          ? t('chrome.flowKindEnd')
          : kind === 'decision'
            ? t('chrome.flowKindDecision')
            : kind === 'question'
              ? t('chrome.flowKindQuestion')
              : t('chrome.flowKindProcess');
    const node: Node<FlowNodeData> = {
      id,
      type: 'flowObject',
      position: {
        x: 120 + (nodes.length % 4) * 40,
        y: 100 + (nodes.length % 5) * 40,
      },
      data: {
        label,
        kind,
        inputs: ports.inputs,
        outputs: ports.outputs,
        ...(kind === 'decision' || kind === 'question'
          ? {
              question: label,
              options: ports.outputs.map((o) => ({
                id: o.id,
                label: o.name,
                outputId: o.id,
              })),
            }
          : {}),
      },
    };
    commit([...nodes, node], edges);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };

  const addSequenceTemplate = () => {
    if (!canEdit) return;
    const created = buildSequenceParticipants([
      t('chrome.flowSeqActorUser'),
      t('chrome.flowSeqActorSystem'),
      t('chrome.flowSeqActorOther'),
    ]);
    // Ensure unique ids against existing nodes.
    const used = new Set(nodes.map((n) => n.id));
    const nextNodes = created.map((n, i) => {
      let id = n.id;
      while (used.has(id)) id = `${n.id}_${i}_${Date.now()}`;
      used.add(id);
      return { ...n, id };
    });
    commit([...nodes, ...nextNodes], edges);
    setSelectedNodeId(nextNodes[0]?.id || null);
    setSelectedEdgeId(null);
    requestAnimationFrame(() => fitView({ padding: 0.2 }));
  };

  const deleteNodeById = useCallback(
    (nodeId: string) => {
      if (!canEdit || !nodeId) return;
      commit(
        nodes.filter((n) => n.id !== nodeId),
        edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      setSelectedNodeId((cur) => (cur === nodeId ? null : cur));
      setSelectedEdgeId(null);
      setCtxMenu(null);
    },
    [canEdit, nodes, edges, commit]
  );

  const deleteEdgeById = useCallback(
    (edgeId: string) => {
      if (!canEdit || !edgeId) return;
      commit(
        nodes,
        edges.filter((e) => e.id !== edgeId)
      );
      setSelectedEdgeId((cur) => (cur === edgeId ? null : cur));
      setCtxMenu(null);
    },
    [canEdit, nodes, edges, commit]
  );

  const deleteSelected = () => {
    if (!canEdit) return;
    if (selectedEdgeId) {
      deleteEdgeById(selectedEdgeId);
      return;
    }
    if (selectedNodeId) deleteNodeById(selectedNodeId);
  };

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    futureRef.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    });
    skipHistory.current = true;
    setNodes(prev.nodes);
    setEdges(prev.edges);
    persist(prev.nodes, prev.edges);
  }, [nodes, edges, persist, setNodes, setEdges]);

  const redo = useCallback(() => {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push({
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    });
    skipHistory.current = true;
    setNodes(next.nodes);
    setEdges(next.edges);
    persist(next.nodes, next.edges);
  }, [nodes, edges, persist, setNodes, setEdges]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const startRun = () => setRun(startFlowRun(nodes, edges));
  const stopRun = () => setRun(initialFlowRunState());
  const pickOption = (optionId: string) => setRun(answerFlowRun(nodes, edges, run, optionId));

  const importMermaid = (text: string) => {
    if (!canEdit) return;
    const { nodes: n, edges: e } = mermaidToFlow(text);
    commit(n, e);
    setMermaidOpen(false);
    requestAnimationFrame(() => fitView({ padding: 0.2 }));
  };

  const onImportFile = async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file || !canEdit) return;
    const text = await file.text();
    if (file.name.endsWith('.mmd') || /flowchart|graph\s/i.test(text)) {
      importMermaid(text);
      return;
    }
    try {
      const doc = parseFlowDocument(text);
      commit(doc.nodes, doc.edges);
      requestAnimationFrame(() => fitView({ padding: 0.2 }));
    } catch {
      /* ignore */
    }
  };

  const basename = boardPath.replace(/\.md$/i, '') || 'flow';

  return (
    <div
      className="synapse-flow flex h-full min-h-[320px] w-full flex-col"
      style={{ background: 'var(--bg)' }}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border)] px-2 py-1.5 text-xs">
        {canEdit && (
          <>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={() => addNode('process')}>
              + {t('chrome.flowKindProcess')}
            </button>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={() => addNode('decision')}>
              + {t('chrome.flowKindDecision')}
            </button>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={() => addNode('question')}>
              + {t('chrome.flowKindQuestion')}
            </button>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={() => addNode('start')}>
              + {t('chrome.flowKindStart')}
            </button>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={() => addNode('end')}>
              + {t('chrome.flowKindEnd')}
            </button>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={() => addNode('participant')}>
              + {t('chrome.flowKindParticipant')}
            </button>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={addSequenceTemplate}>
              {t('chrome.flowSeqTemplate')}
            </button>
            <span className="mx-1 text-[var(--border)]">|</span>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={undo} title="Ctrl/Cmd+Z">
              {t('chrome.flowUndo')}
            </button>
            <button type="button" className="btn-ghost py-1 text-xs" onClick={redo} title="Ctrl/Cmd+Y">
              {t('chrome.flowRedo')}
            </button>
            <button
              type="button"
              className="btn-ghost py-1 text-xs"
              disabled={!selectedNodeId && !selectedEdgeId}
              onClick={deleteSelected}
              title={t('chrome.flowDeleteHint')}
            >
              {selectedEdgeId ? t('chrome.flowDeleteEdge') : t('chrome.flowDeleteNode')}
            </button>
          </>
        )}
        <span className="mx-1 text-[var(--border)]">|</span>
        <button type="button" className="btn-ghost py-1 text-xs" onClick={startRun}>
          {t('chrome.flowRun')}
        </button>
        {run.status !== 'idle' && (
          <button type="button" className="btn-ghost py-1 text-xs" onClick={stopRun}>
            {t('chrome.flowStop')}
          </button>
        )}
        <span className="mx-1 text-[var(--border)]">|</span>
        <button
          type="button"
          className="btn-ghost py-1 text-xs"
          onClick={() => exportFlow('json', nodes, edges, basename)}
        >
          {t('chrome.flowExportJson')}
        </button>
        <button
          type="button"
          className="btn-ghost py-1 text-xs"
          onClick={() => exportFlow('mermaid', nodes, edges, basename)}
        >
          {t('chrome.flowExportMermaid')}
        </button>
        <button
          type="button"
          className="btn-ghost py-1 text-xs"
          onClick={() => exportFlow('svg', nodes, edges, basename)}
        >
          {t('chrome.flowExportSvg')}
        </button>
        {canEdit && (
          <>
            <button
              type="button"
              className="btn-ghost py-1 text-xs"
              onClick={() => {
                setMermaidDraft(flowToMermaid(nodes, edges));
                setMermaidOpen(true);
              }}
            >
              {t('chrome.flowImportMermaid')}
            </button>
            <label className="btn-ghost cursor-pointer py-1 text-xs">
              {t('chrome.flowImportFile')}
              <input type="file" accept=".json,.mmd,.txt,application/json,text/plain" className="hidden" onChange={onImportFile} />
            </label>
          </>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          className="relative min-h-0 min-w-0 flex-1"
          onContextMenu={preventBrowserMenu}
          onClick={closeCtxMenu}
        >
          <ReactFlow
            nodes={nodes.map((n) => ({
              ...n,
              // Keep RF wrapper invisible — shape chrome lives only in FlowObjectNode.
              style: { background: 'transparent', border: 'none', padding: 0 },
              data: {
                ...n.data,
                runActive: run.currentNodeId === n.id,
              },
            }))}
            edges={displayEdges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              selectable: true,
              focusable: true,
              interactionWidth: 24,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 18,
                height: 18,
                color: 'var(--accent-soft)',
              },
            }}
            onNodesChange={canEdit ? handleNodesChange : undefined}
            onEdgesChange={canEdit ? handleEdgesChange : undefined}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onNodeDragStop={() => persist(nodes, edges)}
            onPaneClick={closeCtxMenu}
            onPaneContextMenu={(e) => openCtxMenu(e, 'pane')}
            onNodeContextMenu={(e, node) => openCtxMenu(e, 'node', node.id)}
            onEdgeContextMenu={(e, edge) => openCtxMenu(e, 'edge', edge.id)}
            onEdgeClick={(_, edge) => {
              setSelectedEdgeId(edge.id);
              setSelectedNodeId(null);
              setCtxMenu(null);
            }}
            onMoveEnd={(_, vp) => {
              viewportRef.current = vp;
            }}
            fitView
            nodesDraggable={canEdit}
            nodesConnectable={canEdit}
            elementsSelectable
            edgesFocusable={canEdit}
            edgesReconnectable={false}
            deleteKeyCode={canEdit && !sidebarTyping ? ['Backspace', 'Delete'] : null}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={18} size={1} color="var(--border)" />
            <MiniMap
              pannable
              zoomable
              maskColor="color-mix(in srgb, var(--bg) 55%, transparent)"
              nodeColor="var(--accent)"
              nodeStrokeColor="var(--border-strong)"
              bgColor="var(--panel)"
            />
            <Controls showInteractive={canEdit} />
          </ReactFlow>

          {ctxMenu ? (
            <div
              className="fixed z-50 min-w-[10rem] rounded-lg border border-[var(--border)] bg-[var(--panel)] py-1 shadow-xl"
              style={{ left: ctxMenu.x, top: ctxMenu.y }}
              role="menu"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={preventBrowserMenu}
            >
              {ctxMenu.target === 'edge' && ctxMenu.id && canEdit ? (
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-3 py-1.5 text-left text-xs text-[var(--danger)] hover:bg-[var(--surface-2)]"
                  onClick={() => deleteEdgeById(ctxMenu.id!)}
                >
                  {t('chrome.flowDeleteEdge')}
                </button>
              ) : null}
              {ctxMenu.target === 'node' && ctxMenu.id && canEdit ? (
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-3 py-1.5 text-left text-xs text-[var(--danger)] hover:bg-[var(--surface-2)]"
                  onClick={() => deleteNodeById(ctxMenu.id!)}
                >
                  {t('chrome.flowDeleteNode')}
                </button>
              ) : null}
              {ctxMenu.target === 'pane' ? (
                <div className="px-3 py-1.5 text-[10px] text-[var(--muted)]">
                  {t('chrome.flowCtxPaneHint')}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="w-64 shrink-0 overflow-y-auto border-l border-[var(--border)] p-3 text-xs">
          {run.status === 'waiting' && run.prompt ? (
            <div className="mb-4 space-y-2 rounded border border-[var(--border)] p-2">
              <div className="font-medium text-[var(--text)]">{t('chrome.flowRunPrompt')}</div>
              <p className="text-[var(--muted)]">{run.prompt.question}</p>
              <div className="flex flex-col gap-1">
                {run.prompt.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="btn-primary py-1 text-xs"
                    onClick={() => pickOption(o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {run.status === 'done' || run.status === 'error' ? (
            <div className="mb-4 rounded border border-[var(--border)] p-2 text-[var(--muted)]">
              {run.message || (run.status === 'done' ? t('chrome.flowRunDone') : t('chrome.flowRunError'))}
            </div>
          ) : null}

          {selectedEdge && !selected ? (
            <div className="mb-4 space-y-2 rounded border border-[var(--border)] p-2">
              <div className="font-medium text-[var(--text)]">{t('chrome.flowEdgeProps')}</div>
              <p className="text-[var(--muted)]">
                {selectedEdge.source}
                {selectedEdge.sourceHandle ? `:${selectedEdge.sourceHandle}` : ''}
                {' → '}
                {selectedEdge.target}
                {selectedEdge.targetHandle ? `:${selectedEdge.targetHandle}` : ''}
              </p>
              {canEdit ? (
                <>
                  <label className="block">
                    <span className="text-[var(--muted)]">{t('chrome.flowEdgeLabel')}</span>
                    <input
                      className="mt-0.5 w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                      value={selectedEdge.label != null ? String(selectedEdge.label) : ''}
                      onChange={(e) => {
                        const next = edges.map((ed) =>
                          ed.id === selectedEdge.id ? { ...ed, label: e.target.value } : ed
                        );
                        setEdges(next);
                        persist(nodes, next);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn-ghost py-1 text-xs text-[var(--danger)]"
                    onClick={() => deleteEdgeById(selectedEdge.id)}
                  >
                    {t('chrome.flowDeleteEdge')}
                  </button>
                </>
              ) : null}
            </div>
          ) : null}

          {selected ? (
            <div
              className="space-y-2"
              onFocusCapture={() => setSidebarTyping(true)}
              onBlurCapture={(e) => {
                const next = e.relatedTarget as Element | null;
                if (!next || !e.currentTarget.contains(next)) {
                  setSidebarTyping(false);
                }
              }}
            >
              <div className="font-medium text-[var(--text)]">{t('chrome.flowNodeProps')}</div>
              <label className="block">
                <span className="text-[var(--muted)]">{t('chrome.flowNodeName')}</span>
                <input
                  className="mt-0.5 w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                  value={selected.data.label}
                  disabled={!canEdit}
                  onChange={(e) => updateSelectedData({ label: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-[var(--muted)]">{t('chrome.flowNodeKind')}</span>
                <select
                  className="mt-0.5 w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                  value={selected.data.kind}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const kind = e.target.value as FlowNodeKind;
                    const ports = defaultPortsForKind(kind);
                    setInputsDraft(null);
                    setOutputsDraft(null);
                    updateSelectedData({
                      kind,
                      inputs: ports.inputs,
                      outputs: ports.outputs,
                      ...(kind === 'decision' || kind === 'question'
                        ? {
                            question: selected.data.question || selected.data.label,
                            options: ports.outputs.map((o) => ({
                              id: o.id,
                              label: o.name,
                              outputId: o.id,
                            })),
                          }
                        : { question: undefined, options: undefined }),
                    });
                  }}
                >
                  <option value="process">{t('chrome.flowKindProcess')}</option>
                  <option value="decision">{t('chrome.flowKindDecision')}</option>
                  <option value="question">{t('chrome.flowKindQuestion')}</option>
                  <option value="participant">{t('chrome.flowKindParticipant')}</option>
                  <option value="start">{t('chrome.flowKindStart')}</option>
                  <option value="end">{t('chrome.flowKindEnd')}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[var(--muted)]">{t('chrome.flowNodeShape')}</span>
                <select
                  className="mt-0.5 w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                  value={selected.data.shape || 'auto'}
                  disabled={!canEdit}
                  onChange={(e) =>
                    updateSelectedData({ shape: e.target.value as FlowNodeShape })
                  }
                >
                  <option value="auto">{t('chrome.flowShapeAuto')}</option>
                  <option value="rounded">{t('chrome.flowShapeRounded')}</option>
                  <option value="rectangle">{t('chrome.flowShapeRectangle')}</option>
                  <option value="pill">{t('chrome.flowShapePill')}</option>
                  <option value="diamond">{t('chrome.flowShapeDiamond')}</option>
                  <option value="circle">{t('chrome.flowShapeCircle')}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[var(--muted)]">{t('chrome.flowInputsSide')}</span>
                <select
                  className="mt-0.5 w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                  value={selected.data.inputsSide || 'left'}
                  disabled={!canEdit || selected.data.kind === 'start'}
                  onChange={(e) =>
                    updateSelectedData({ inputsSide: e.target.value as FlowPortSide })
                  }
                >
                  <option value="left">{t('chrome.flowSideLeft')}</option>
                  <option value="right">{t('chrome.flowSideRight')}</option>
                  <option value="top">{t('chrome.flowSideTop')}</option>
                  <option value="bottom">{t('chrome.flowSideBottom')}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[var(--muted)]">{t('chrome.flowOutputsSide')}</span>
                <select
                  className="mt-0.5 w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                  value={selected.data.outputsSide || 'right'}
                  disabled={!canEdit || selected.data.kind === 'end'}
                  onChange={(e) =>
                    updateSelectedData({ outputsSide: e.target.value as FlowPortSide })
                  }
                >
                  <option value="left">{t('chrome.flowSideLeft')}</option>
                  <option value="right">{t('chrome.flowSideRight')}</option>
                  <option value="top">{t('chrome.flowSideTop')}</option>
                  <option value="bottom">{t('chrome.flowSideBottom')}</option>
                </select>
              </label>
              {(selected.data.kind === 'decision' || selected.data.kind === 'question') && (
                <label className="block">
                  <span className="text-[var(--muted)]">{t('chrome.flowQuestion')}</span>
                  <textarea
                    className="mt-0.5 w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                    rows={2}
                    value={selected.data.question || ''}
                    disabled={!canEdit}
                    onChange={(e) => updateSelectedData({ question: e.target.value })}
                  />
                </label>
              )}
              {selected.data.kind !== 'start' ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[var(--muted)]">{t('chrome.flowInputs')}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="btn-ghost px-2 py-0.5 text-xs"
                        disabled={!canEdit || selected.data.inputs.length <= 0}
                        onClick={() => {
                          setInputsDraft(null);
                          updateSelectedData({
                            inputs: resizePorts(
                              selected.data.inputs,
                              selected.data.inputs.length - 1,
                              'in'
                            ),
                          });
                        }}
                      >
                        −
                      </button>
                      <span className="min-w-[1.25rem] text-center tabular-nums text-[var(--text)]">
                        {selected.data.inputs.length}
                      </span>
                      <button
                        type="button"
                        className="btn-ghost px-2 py-0.5 text-xs"
                        disabled={!canEdit || selected.data.inputs.length >= 12}
                        onClick={() => {
                          setInputsDraft(null);
                          updateSelectedData({
                            inputs: resizePorts(
                              selected.data.inputs,
                              selected.data.inputs.length + 1,
                              'in'
                            ),
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    className="w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                    value={
                      inputsDraft ?? selected.data.inputs.map((p) => p.name).join(', ')
                    }
                    disabled={!canEdit}
                    placeholder={t('chrome.flowPortsPlaceholder')}
                    onChange={(e) => setInputsDraft(e.target.value)}
                    onBlur={() => {
                      if (inputsDraft == null) return;
                      updateSelectedData({
                        inputs: portsFromText(inputsDraft, selected.data.inputs),
                      });
                      setInputsDraft(null);
                    }}
                  />
                </div>
              ) : null}
              {selected.data.kind !== 'end' ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[var(--muted)]">{t('chrome.flowOutputs')}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="btn-ghost px-2 py-0.5 text-xs"
                        disabled={!canEdit || selected.data.outputs.length <= 0}
                        onClick={() => {
                          setOutputsDraft(null);
                          const outputs = resizePorts(
                            selected.data.outputs,
                            selected.data.outputs.length - 1,
                            'out'
                          );
                          updateSelectedData({
                            outputs,
                            ...(selected.data.kind === 'decision' ||
                            selected.data.kind === 'question'
                              ? {
                                  options: outputs.map((o) => ({
                                    id: o.id,
                                    label: o.name,
                                    outputId: o.id,
                                  })),
                                }
                              : {}),
                          });
                        }}
                      >
                        −
                      </button>
                      <span className="min-w-[1.25rem] text-center tabular-nums text-[var(--text)]">
                        {selected.data.outputs.length}
                      </span>
                      <button
                        type="button"
                        className="btn-ghost px-2 py-0.5 text-xs"
                        disabled={!canEdit || selected.data.outputs.length >= 12}
                        onClick={() => {
                          setOutputsDraft(null);
                          const outputs = resizePorts(
                            selected.data.outputs,
                            selected.data.outputs.length + 1,
                            'out'
                          );
                          updateSelectedData({
                            outputs,
                            ...(selected.data.kind === 'decision' ||
                            selected.data.kind === 'question'
                              ? {
                                  options: outputs.map((o) => ({
                                    id: o.id,
                                    label: o.name,
                                    outputId: o.id,
                                  })),
                                }
                              : {}),
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    className="w-full rounded border border-[var(--border)] bg-[var(--panel)] px-2 py-1"
                    value={
                      outputsDraft ?? selected.data.outputs.map((p) => p.name).join(', ')
                    }
                    disabled={!canEdit}
                    placeholder={t('chrome.flowPortsPlaceholder')}
                    onChange={(e) => setOutputsDraft(e.target.value)}
                    onBlur={() => {
                      if (outputsDraft == null) return;
                      const outputs = portsFromText(outputsDraft, selected.data.outputs);
                      updateSelectedData({
                        outputs,
                        ...(selected.data.kind === 'decision' ||
                        selected.data.kind === 'question'
                          ? {
                              options: outputs.map((o) => ({
                                id: o.id,
                                label: o.name,
                                outputId: o.id,
                              })),
                            }
                          : {}),
                      });
                      setOutputsDraft(null);
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-[var(--muted)]">{t('chrome.flowSelectNodeHint')}</p>
          )}
        </aside>
      </div>

      <PromptModal
        open={mermaidOpen}
        title={t('chrome.flowImportMermaid')}
        label={t('chrome.flowMermaidLabel')}
        hint={t('chrome.flowImportMermaidHint')}
        initialValue={mermaidDraft}
        multiline
        confirmLabel={t('chrome.flowImportApply')}
        onCancel={() => setMermaidOpen(false)}
        onConfirm={(value) => importMermaid(value)}
      />
    </div>
  );
}

export default function FlowEditor(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditorInner {...props} />
    </ReactFlowProvider>
  );
}
