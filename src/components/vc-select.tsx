'use client';
import { Icon } from './icon';

interface VcSelectProps {
  value: string;
  options: string[];
  onChange?: (v: string) => void;
}

export function VcSelect({ value, options, onChange }: VcSelectProps) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        style={{
          appearance: 'none', height: 36, padding: '0 32px 0 12px', borderRadius: 8,
          border: '1px solid var(--line)', background: '#fff', fontSize: 13, fontWeight: 600,
          color: 'var(--ink-2)', cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 10, top: 10, pointerEvents: 'none', color: 'var(--muted)' }}>
        <Icon name="chevD" size={16} />
      </span>
    </div>
  );
}
