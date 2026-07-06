'use client';

import { useId } from 'react';

/* ---------- Sparkline ---------- */
interface SparklineProps {
  data: number[];
  color?: string;
  h?: number;
}
export function Sparkline({ data, color = 'var(--c-blue)', h = 42 }: SparklineProps) {
  const w = 100;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / ((max - min) || 1)) * (h - 6) - 3;
    return [x, y];
  });
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = path + ` L${w} ${h} L0 ${h} Z`;
  const gid = `sparkline-${useId().replace(/:/g, '-')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------- LineChart ---------- */
interface LineChartProps {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
}
export function LineChart({ data, labels, height = 240, color = 'var(--c-blue)' }: LineChartProps) {
  const w = 720, h = height, padL = 44, padB = 28, padT = 12, padR = 10;
  const max = Math.ceil(Math.max(...data) / 5000) * 5000;
  const iw = w - padL - padR, ih = h - padB - padT;
  const pts = data.map((v, i) => [padL + (i / (data.length - 1)) * iw, padT + ih - (v / max) * ih]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${pts[pts.length - 1][0]} ${padT + ih} L${pts[0][0]} ${padT + ih} Z`;
  const ticks = [0, 5000, 10000, 15000, 20000].filter(t => t <= max);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.16" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => {
        const y = padT + ih - (t / max) * ih;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 4" />
            <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fill="var(--muted-2)">{t >= 1000 ? (t / 1000) + 'K' : t}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#lc)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke={color} strokeWidth="2.5" />)}
      {labels.map((l, i) => <text key={i} x={pts[i][0]} y={h - 8} textAnchor="middle" fontSize="11" fill="var(--muted-2)">{l}</text>)}
    </svg>
  );
}

/* ---------- Donut ---------- */
interface DonutDataItem {
  pct?: number;
  count?: number;
  color: string;
}
interface DonutProps {
  data: DonutDataItem[];
  size?: number;
  thickness?: number;
  center?: { top: string; main: string };
}
export function Donut({ data, size = 200, thickness = 30, center }: DonutProps) {
  const r = (size - thickness) / 2, cx = size / 2, cy = size / 2, C = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + (d.pct || d.count || 0), 0);
  
  // Precalculate offsets purely to satisfy React 19/Next 16 purity rules
  let currentOffset = 0;
  const segments = [];
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const val = d.pct || d.count || 0;
    const frac = val / (total || 1);
    const len = frac * C;
    segments.push({
      color: d.color,
      len,
      offset: currentOffset,
    });
    currentOffset += len;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} />
      {segments.map((seg, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
          strokeWidth={thickness} strokeDasharray={`${seg.len} ${C - seg.len}`}
          strokeDashoffset={-seg.offset} transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
      ))}
      {center && <>
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="var(--muted)">{center.top}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ink)">{center.main}</text>
      </>}
    </svg>
  );
}

/* ---------- Legend ---------- */
interface LegendItem {
  name: string;
  color: string;
  pct?: number;
  count?: number;
  val?: string;
}
interface LegendProps {
  data: LegendItem[];
  showVal?: boolean;
}
export function Legend({ data, showVal = true }: LegendProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {data.map((d, i) => (
        <div key={i} className="row between gap12">
          <div className="row gap8" style={{ minWidth: 0 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{d.name}</span>
          </div>
          {showVal && (
            <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              {d.count != null ? `${d.count} (${d.pct}%)` : (d.pct != null ? `${d.pct}%` : '') + (d.val ? ` (${d.val})` : '')}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
