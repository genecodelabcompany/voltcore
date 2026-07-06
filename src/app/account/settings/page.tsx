'use client';
import { useState } from 'react';

export default function AccountSettings() {
  const [tab, setTab] = useState('Password');
  const tabs = ['Password', 'Privacy', 'Delete Account'];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Account Settings</h2>
        <div className="sub" style={{ marginTop: 4 }}>Security and privacy controls</div>
      </div>
      <div className="row gap16" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ width: 180, flexShrink: 0, overflow: 'hidden' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              width: '100%', padding: '11px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: tab === t ? 'var(--blue-50)' : 'transparent',
              color: tab === t ? 'var(--blue-600)' : 'var(--ink)',
              fontWeight: tab === t ? 700 : 500, fontSize: 14,
              borderLeft: tab === t ? '3px solid var(--blue-600)' : '3px solid transparent',
            }}>{t}</button>
          ))}
        </div>
        <div className="card card-pad grow" style={{ maxWidth: 480 }}>
          {tab === 'Password' && <>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Change Password</div>
            {['Current Password', 'New Password', 'Confirm New Password'].map(l => (
              <div key={l} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{l}</label>
                <input className="input" type="password" style={{ maxWidth: '100%', display: 'block' }} />
              </div>
            ))}
            <button className="btn btn-primary">Update Password</button>
          </>}
          {tab === 'Privacy' && <>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Privacy Settings</div>
            <div className="sub" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Control how VoltCore uses your data. We never sell your information to third parties.
            </div>
            <div className="row between" style={{ padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Analytics Cookies</div>
              <span className="pill pill-green" style={{ fontSize: 11 }}>Enabled</span>
            </div>
            <div className="row between" style={{ padding: '12px 0', borderBottom: '1px solid var(--line-2)' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Personalised Recommendations</div>
              <span className="pill pill-green" style={{ fontSize: 11 }}>Enabled</span>
            </div>
            <button className="btn btn-soft" style={{ marginTop: 20 }}>Request Data Export</button>
          </>}
          {tab === 'Delete Account' && <>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: 'var(--red)' }}>Delete Account</div>
            <div className="sub" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Deleting your account is permanent. All orders, course progress, and data will be removed and cannot be recovered.
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Type DELETE to confirm</label>
              <input className="input" placeholder="DELETE" style={{ maxWidth: 200, display: 'block' }} />
            </div>
            <button className="btn" style={{ background: 'var(--red)', color: '#fff', border: 'none' }}>Permanently Delete Account</button>
          </>}
        </div>
      </div>
    </div>
  );
}
