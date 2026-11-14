'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowObjectNode } from '@/components/flow/FlowObjectNode';
import { parseFlowDocument, type FlowNodeData } from '@/lib/flowDocument';
import { decorateFlowEdges } from '@/lib/flowEdges';
import {
  answerFlowRun,
  initialFlowRunState,
  startFlowRun,
  type FlowRunState,
} from '@/lib/flowRun';
import { useI18n } from '@/lib/i18n/provider';

const nodeTypes = { flowObject: FlowObjectNode };

type FlowPeekCanvasProps = {
  boardJson: string | null;
  className?: string;
  /** Show Run/Stop and answer decision/question prompts (embeds + peek). */
  allowRun?: boolean;
};

function FlowPeekInner({ boardJson, className, allowRun = true }: FlowPeekCanvasProps) {
  const { t } = useI18n();
  const doc = useMemo(() => parseFlowDocument(boardJson), [boardJson]);
  const hostRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [run, setRun] = useState<FlowRunState>(initialFlowRunState());

  const nodes = useMemo(
    () =>
      doc.nodes.map((n) => ({
        ...n,
        style: { background: 'transparent', border: 'none', padding: 0 },
        data: {
          ...n.data,
          runActive: run.currentNodeId === n.id,
        },
      })),
    [doc.nodes, run.currentNodeId]
  );

  const edges = useMemo(
    () =>
      decorateFlowEdges(doc.nodes, doc.edges).map((e) => ({
        ...e,
        style: {
          ...(e.style || {}),
          stroke: 'var(--accent-soft)',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: 'var(--accent-soft)',
        },
      })),
    [doc.nodes, doc.edges]
  );

  const refit = useCallback(() => {
    const host = hostRef.current;
    if (!host || host.clientWidth < 16 || host.clientHeight < 16) return;
    try {
      fitView({ padding: 0.2, duration: 0 });
    } catch {
      /* ignore */
    }
  }, [fitView]);

  useEffect(() => {
    setRun(initialFlowRunState());
    const id = window.requestAnimationFrame(() => {
      refit();
      window.setTimeout(refit, 60);
      window.setTimeout(refit, 200);
    });
    return () => window.cancelAnimationFrame(id);
  }, [boardJson, refit]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      refit();
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [refit]);

  const startRun = () => setRun(startFlowRun(doc.nodes as Node<FlowNodeData>[], doc.edges as Edge[]));
  const stopRun = () => setRun(initialFlowRunState());
  const pickOption = (optionId: string) =>
    setRun(answerFlowRun(doc.nodes as Node<FlowNodeData>[], doc.edges as Edge[], run, optionId));

  return (
    <div
      ref={hostRef}
      className={`synapse-flow synapse-flow-peek relative flex min-h-0 w-full flex-col ${className || ''}`}
      style={{ background: 'var(--bg)' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {allowRun ? (
        <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-[var(--border)] px-2 py-1.5 text-xs">
          <button type="button" className="btn-ghost py-1 text-xs" onClick={startRun}>
            {t('chrome.flowRun')}
          </button>
          {run.status !== 'idle' ? (
            <button type="button" className="btn-ghost py-1 text-xs" onClick={stopRun}>
              {t('chrome.flowStop')}
            </button>
          ) : null}
          {run.status === 'done' || run.status === 'error' ? (
            <span className="text-[var(--muted)]">
              {run.message ||
                (run.status === 'done' ? t('chrome.flowRunDone') : t('chrome.flowRunError'))}
            </span>
          ) : null}
        </div>
      ) : null}

      {allowRun && run.status === 'waiting' && run.prompt ? (
        <div className="z-10 shrink-0 border-b border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs">
          <div className="font-medium text-[var(--text)]">{t('chrome.flowRunPrompt')}</div>
          <p className="mt-0.5 text-[var(--muted)]">{run.prompt.question}</p>
          <div className="mt-2 flex flex-wrap gap-1">
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

      <div className="relative min-h-0 w-full flex-1">
        <div className="absolute inset-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll
            onInit={() => refit()}
            onPaneContextMenu={(e) => e.preventDefault()}
            onNodeContextMenu={(e) => e.preventDefault()}
            onEdgeContextMenu={(e) => e.preventDefault()}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              style: { stroke: 'var(--accent-soft)', strokeWidth: 2 },
            }}
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
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function FlowPeekCanvas(props: FlowPeekCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowPeekInner {...props} />
    </ReactFlowProvider>
  );
}
