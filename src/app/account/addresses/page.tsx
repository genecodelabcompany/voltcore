import { Icon } from '@/components/icon';

const addresses = [
  { label: 'Home', line1: 'House 12, Spintex Road', line2: 'East Legon, Accra, Ghana', default: true },
  { label: 'Work', line1: 'Accra Mall, 3rd Floor', line2: 'Tetteh Quarshie, Accra, Ghana', default: false },
];

export default function AccountAddresses() {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Delivery Addresses</h2>
          <div className="sub" style={{ marginTop: 4 }}>Manage your saved delivery locations</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={16} />Add Address</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {addresses.map((a, i) => (
          <div key={i} className="card card-pad" style={{ position: 'relative' }}>
            {a.default && <span className="pill pill-green" style={{ position: 'absolute', top: 14, right: 14, fontSize: 11 }}>Default</span>}
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{a.label}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>{a.line1}</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{a.line2}</div>
            <div className="row gap8" style={{ marginTop: 16 }}>
              <button className="btn btn-ghost btn-sm">Edit</button>
              {!a.default && <button className="btn btn-ghost btn-sm">Set Default</button>}
              {!a.default && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>Remove</button>}
            </div>
          </div>
        ))}
        <div style={{
          border: '2px dashed var(--line)', borderRadius: 'var(--r-lg)', padding: '40px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'var(--muted)', cursor: 'pointer', textAlign: 'center',
        }}>
          <Icon name="plus" size={24} color="var(--muted)" />
          <div style={{ fontWeight: 600, marginTop: 10 }}>Add New Address</div>
        </div>
      </div>
    </div>
  );
}
