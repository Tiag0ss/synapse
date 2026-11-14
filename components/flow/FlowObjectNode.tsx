'use client';

import { memo, useEffect, type CSSProperties } from 'react';
import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import {
  normalizePortSide,
  resolvedNodeShape,
  type FlowNodeData,
  type FlowPort,
  type FlowPortSide,
} from '@/lib/flowDocument';

type FlowObjectNodeType = Node<FlowNodeData, 'flowObject'>;

function sideToPosition(side: FlowPortSide): Position {
  if (side === 'right') return Position.Right;
  if (side === 'top') return Position.Top;
  if (side === 'bottom') return Position.Bottom;
  return Position.Left;
}

/** Absolute handle coords — override React Flow’s default 50% centering. */
function handleStyle(
  side: FlowPortSide,
  index: number,
  count: number,
  accent: string
): CSSProperties {
  const pct = `${((index + 1) / (count + 1)) * 100}%`;
  const base: CSSProperties = {
    width: 11,
    height: 11,
    background: accent,
    border: '2px solid var(--bg)',
    borderRadius: 999,
    transform: 'translate(-50%, -50%)',
  };
  if (side === 'left') return { ...base, top: pct, left: 0 };
  if (side === 'right') return { ...base, top: pct, left: '100%' };
  if (side === 'top') return { ...base, left: pct, top: 0 };
  return { ...base, left: pct, top: '100%' };
}

function labelStyle(side: FlowPortSide, index: number, count: number): CSSProperties {
  const pct = `${((index + 1) / (count + 1)) * 100}%`;
  const base: CSSProperties = {
    position: 'absolute',
    color: 'var(--muted)',
    maxWidth: 48,
    fontSize: 9,
    fontWeight: 500,
    lineHeight: 1,
    pointerEvents: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    zIndex: 2,
  };
  if (side === 'left') {
    return { ...base, top: pct, left: 10, transform: 'translateY(-50%)' };
  }
  if (side === 'right') {
    return {
      ...base,
      top: pct,
      right: 10,
      transform: 'translateY(-50%)',
      textAlign: 'right',
    };
  }
  if (side === 'top') {
    return {
      ...base,
      left: pct,
      top: 10,
      transform: 'translateX(-50%)',
      textAlign: 'center',
    };
  }
  return {
    ...base,
    left: pct,
    bottom: 10,
    transform: 'translateX(-50%)',
    textAlign: 'center',
  };
}

function Ports({
  ports,
  side,
  type,
  accent,
}: {
  ports: FlowPort[];
  side: FlowPortSide;
  type: 'source' | 'target';
  accent: string;
}) {
  const count = Math.max(ports.length, 1);
  const position = sideToPosition(side);
  return (
    <>
      {ports.map((port, i) => (
        <div key={`${type}-${port.id}-${side}`}>
          <Handle
            key={`${port.id}-${side}`}
            id={port.id}
            type={type}
            position={position}
            title={port.name}
            style={handleStyle(side, i, count, accent)}
          />
          {port.name ? <span style={labelStyle(side, i, count)}>{port.name}</span> : null}
        </div>
      ))}
    </>
  );
}

function ParticipantNode({
  id,
  data,
  selected,
  accent,
}: {
  id: string;
  data: FlowNodeData;
  selected: boolean;
  accent: string;
}) {
  const updateNodeInternals = useUpdateNodeInternals();
  const highlight = selected || data.runActive ? `0 0 0 2px ${accent}` : undefined;

  useEffect(() => {
    updateNodeInternals(id);
    const t = window.setTimeout(() => updateNodeInternals(id), 0);
    return () => window.clearTimeout(t);
  }, [id, data.inputs, data.outputs, updateNodeInternals]);

  const boxStyle: CSSProperties = {
    background: 'var(--panel, #121a22)',
    border: `1.5px solid ${accent}`,
    borderRadius: 8,
    color: 'var(--text, #e8eef6)',
    padding: '8px 14px',
    minWidth: 100,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 13,
  };

  return (
    <div
      className="synapse-flow-object-node relative flex w-[120px] flex-col items-center"
      style={{ height: 340, boxShadow: highlight }}
    >
      <div style={boxStyle}>{data.label}</div>
      <div
        className="relative w-full flex-1"
        style={{ minHeight: 220 }}
        aria-hidden={false}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ background: accent }}
        />
        <Ports ports={data.inputs} side="left" type="target" accent={accent} />
        <Ports ports={data.outputs} side="right" type="source" accent={accent} />
      </div>
      <div style={boxStyle}>{data.label}</div>
    </div>
  );
}

function FlowObjectNodeComponent({ id, data, selected }: NodeProps<FlowObjectNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const shape = resolvedNodeShape(data.kind, data.shape);
  const accent =
    data.kind === 'start'
      ? 'var(--ok, #10b981)'
      : data.kind === 'end'
        ? 'var(--danger, #ef4444)'
        : data.kind === 'decision' || data.kind === 'question'
          ? 'var(--warn, #f59e0b)'
          : 'var(--accent, #14b8a6)';

  const inputsSide = normalizePortSide(data.inputsSide, 'left');
  const outputsSide = normalizePortSide(data.outputsSide, 'right');
  const portRows = Math.max(data.inputs.length, data.outputs.length, 1);

  useEffect(() => {
    updateNodeInternals(id);
    const t = window.setTimeout(() => updateNodeInternals(id), 0);
    return () => window.clearTimeout(t);
  }, [
    id,
    inputsSide,
    outputsSide,
    data.inputs,
    data.outputs,
    shape,
    updateNodeInternals,
  ]);

  if (data.kind === 'participant') {
    return (
      <ParticipantNode id={id} data={data} selected={!!selected} accent={accent} />
    );
  }

  const isCircle = shape === 'circle';
  const isDiamond = shape === 'diamond';
  const isPill = shape === 'pill';
  const isRectangle = shape === 'rectangle';

  const circleSize = Math.max(112, 64 + portRows * 20);

  const highlight =
    selected || data.runActive ? `0 0 0 2px ${accent}` : undefined;

  const diamondSize = Math.max(140, 72 + portRows * 22);

  let shellStyle: CSSProperties;
  if (isCircle) {
    shellStyle = {
      width: circleSize,
      height: circleSize,
      borderRadius: '50%',
      background: 'var(--panel, #121a22)',
      border: `1.5px solid ${accent}`,
      boxShadow: highlight,
      color: 'var(--text, #e8eef6)',
      overflow: 'hidden',
    };
  } else if (isDiamond) {
    // Transparent hit-box; the visible diamond is the SVG below (clip-path ate borders).
    shellStyle = {
      width: diamondSize,
      height: diamondSize,
      background: 'transparent',
      border: 'none',
      boxShadow: highlight,
      color: 'var(--text, #e8eef6)',
    };
  } else {
    shellStyle = {
      minWidth: 168,
      minHeight: 52 + Math.max(0, portRows - 1) * 18,
      background: 'var(--panel, #121a22)',
      border: `1.5px solid ${accent}`,
      borderRadius: isPill ? 999 : isRectangle ? 4 : 12,
      boxShadow: highlight,
      color: 'var(--text, #e8eef6)',
      padding: '8px 12px',
    };
  }

  return (
    <div className="synapse-flow-object-node relative" style={shellStyle}>
      {isDiamond ? (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon
            points="50,3 97,50 50,97 3,50"
            fill="var(--panel, #121a22)"
            stroke={accent}
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}

      <Ports ports={data.inputs} side={inputsSide} type="target" accent={accent} />

      <div
        className="relative z-[1] flex h-full min-h-[2.5rem] items-center justify-center px-6 text-center"
        style={isDiamond ? { padding: '32% 22%' } : undefined}
      >
        <div className="max-w-[7.5rem] text-sm font-semibold leading-snug break-words">
          {data.label}
        </div>
      </div>

      <Ports ports={data.outputs} side={outputsSide} type="source" accent={accent} />
    </div>
  );
}

export const FlowObjectNode = memo(FlowObjectNodeComponent);
