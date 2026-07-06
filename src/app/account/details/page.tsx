'use client';
import { useState } from 'react';
import { Icon } from '@/components/icon';
import { useUser } from '@clerk/nextjs';

export default function AccountDetails() {
  const { user } = useUser();
  const [saved, setSaved] = useState(false);

  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map(n => n?.charAt(0).toUpperCase())
    .join('') || 'U';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Personal Details</h2>
        <div className="sub" style={{ marginTop: 4 }}>Update your name, email, and profile information</div>
      </div>
      <div className="details-card card card-pad" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24,
          }}>{initials}</div>
          <div>
            <button className="btn btn-soft btn-sm"><Icon name="upload" size={14} />Change Photo</button>
            <div className="sub" style={{ fontSize: 12, marginTop: 6 }}>JPG or PNG, max 2MB</div>
          </div>
        </div>
        {[
          ['First Name', user?.firstName || ''],
          ['Last Name', user?.lastName || ''],
          ['Email Address', user?.primaryEmailAddress?.emailAddress || ''],
          ['Phone Number', user?.primaryPhoneNumber?.phoneNumber || '+233 50 000 0000'],
        ].map(([label, val]) => (
          <div key={label} style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{label}</label>
            <input className="input" defaultValue={val} style={{ maxWidth: '100%', display: 'block' }} />
          </div>
        ))}
        <div className="row gap12" style={{ marginTop: 8 }}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          {saved && <span style={{ color: 'var(--green)', fontWeight: 600, fontSize: 14 }}>✓ Saved</span>}
        </div>
      </div>
    </div>
  );
}
