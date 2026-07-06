import { Icon } from './icon';

export function StoreFooter() {
  const feats = [
    ['truck', 'Fast Delivery', 'Same-day dispatch in Accra'],
    ['shield', 'Secure Payment', 'MTN MoMo & Card via Paystack'],
    ['headset', 'Engineering Support', 'Technical help available'],
    ['rosette', 'Quality Guaranteed', 'All products tested & verified'],
  ] as const;
  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: '#fff', marginTop: 32 }}>
      <div className="store-footer-grid">
        {feats.map(([ic, t, s]) => (
          <div key={t} className="row gap12">
            <div style={{
              width: 42, height: 42, borderRadius: 10, background: 'var(--blue-50)', color: 'var(--blue-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name={ic} size={21} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t}</div>
              <div className="sub" style={{ fontSize: 12.5 }}>{s}</div>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
