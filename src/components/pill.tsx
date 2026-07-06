const STATUS_MAP: Record<string, { pill: string; label: string }> = {
  pending: { pill: 'pill-amber', label: 'Pending' },
  processing: { pill: 'pill-proc', label: 'Processing' },
  shipped: { pill: 'pill-teal', label: 'Shipped' },
  delivered: { pill: 'pill-green', label: 'Delivered' },
  cancelled: { pill: 'pill-red', label: 'Cancelled' },
};

interface PillProps {
  status?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Pill({ status, children, className }: PillProps) {
  if (status && STATUS_MAP[status]) {
    const s = STATUS_MAP[status];
    return (
      <span className={`pill ${s.pill} ${className || ''}`}>
        <span className="dot" />
        {s.label}
      </span>
    );
  }
  return <span className={`pill pill-slate ${className || ''}`}>{children}</span>;
}
