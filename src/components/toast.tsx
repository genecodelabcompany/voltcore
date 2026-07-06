'use client';
import { Icon } from './icon';

interface ToastProps {
  msg: string;
}

export function Toast({ msg }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
      background: 'var(--ink)', color: '#fff', padding: '13px 20px', borderRadius: 12,
      boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 10,
      fontWeight: 600, fontSize: 14, animation: 'fade .25s ease',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%', background: 'var(--c-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="check" size={14} sw={2.5} color="#fff" />
      </span>
      {msg}
    </div>
  );
}
