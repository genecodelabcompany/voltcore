import { Icon } from '@/components/icon';

export default function AccountPayment() {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Payment Methods</h2>
          <div className="sub" style={{ marginTop: 4 }}>Saved cards and mobile money accounts</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={16} />Add Method</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
        {[
          { type: 'Visa', last4: '4242', exp: '08/27', name: 'Kwame Mensah', default: true },
          { type: 'MTN MoMo', last4: '4567', exp: '', name: '+233 54 456 7890', default: false },
        ].map((m, i) => (
          <div key={i} className="card card-pad row between" style={{ alignItems: 'center' }}>
            <div className="row gap14">
              <div style={{
                width: 48, height: 30, background: 'var(--navy)', borderRadius: 6, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 800,
              }}>{m.type === 'MTN MoMo' ? 'MoMo' : m.type}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>•••• {m.last4}</div>
                <div className="sub" style={{ fontSize: 12, marginTop: 2 }}>{m.name}{m.exp ? ` · Exp ${m.exp}` : ''}</div>
              </div>
            </div>
            <div className="row gap8">
              {m.default && <span className="pill pill-green" style={{ fontSize: 11 }}>Default</span>}
              {!m.default && <button className="btn btn-ghost btn-sm">Set Default</button>}
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
