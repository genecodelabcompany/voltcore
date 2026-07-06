import { Icon } from '@/components/icon';

export default function AccountDetails() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Personal Details</h2>
        <div className="sub" style={{ marginTop: 4 }}>Update your name, email, and profile information</div>
      </div>
      <div className="card card-pad" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24,
          }}>KM</div>
          <div>
            <button className="btn btn-soft btn-sm"><Icon name="upload" size={14} />Change Photo</button>
            <div className="sub" style={{ fontSize: 12, marginTop: 6 }}>JPG or PNG, max 2MB</div>
          </div>
        </div>
        {[
          ['First Name', 'Kwame'],
          ['Last Name', 'Mensah'],
          ['Email Address', 'kwame.mensah@mail.com'],
          ['Phone Number', '+233 50 123 4567'],
        ].map(([label, val]) => (
          <div key={label} style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{label}</label>
            <input className="input" defaultValue={val} style={{ maxWidth: '100%', display: 'block' }} />
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 8 }}>Save Changes</button>
      </div>
    </div>
  );
}
