interface MiniStatProps {
  label: string;
  value: string;
  c?: string;
}

export function MiniStat({ label, value, c }: MiniStatProps) {
  return (
    <div className="card card-pad" style={{ padding: '16px 20px' }}>
      <div className="sub" style={{ fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: c || 'var(--ink)' }}>{value}</div>
    </div>
  );
}
