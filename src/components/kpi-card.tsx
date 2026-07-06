import { Icon } from './icon';
import { Sparkline } from './charts';

interface KpiCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  note?: string;
  spark?: number[];
  sparkColor?: string;
}

export function KpiCard({ icon, iconBg, iconColor, label, value, delta, deltaUp, note, spark, sparkColor }: KpiCardProps) {
  return (
    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="row gap12" style={{ alignItems: 'flex-start' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, background: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name={icon} size={21} />
        </div>
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="sub" style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
          <div className="row gap8" style={{ marginTop: 3, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{value}</span>
            {delta && (
              <span className={deltaUp ? 'up' : 'down'} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <Icon name="trend" size={13} style={{ transform: deltaUp ? 'none' : 'scaleY(-1)' }} />{delta}
              </span>
            )}
          </div>
          {note && <div className="sub" style={{ fontSize: 12, marginTop: 2 }}>{note}</div>}
        </div>
      </div>
      {spark && <Sparkline data={spark} color={sparkColor || 'var(--c-blue)'} />}
    </div>
  );
}
