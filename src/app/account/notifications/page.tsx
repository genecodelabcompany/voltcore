'use client';
import { useState } from 'react';

function Toggle({ label, sub, on }: { label: string; sub?: string; on?: boolean }) {
  const [checked, setChecked] = useState(on ?? false);
  return (
    <div className="row between" style={{ padding: '14px 0', borderBottom: '1px solid var(--line-2)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        {sub && <div className="sub" style={{ fontSize: 13, marginTop: 2 }}>{sub}</div>}
      </div>
      <button onClick={() => setChecked(c => !c)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? 'var(--blue-600)' : 'var(--line)',
        position: 'relative', transition: 'background .2s',
      }}>
        <span style={{
          position: 'absolute', top: 3, left: checked ? 22 : 3, width: 18, height: 18,
          background: '#fff', borderRadius: '50%', transition: 'left .2s',
        }} />
      </button>
    </div>
  );
}

export default function AccountNotifications() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Notifications</h2>
        <div className="sub" style={{ marginTop: 4 }}>Choose what updates you receive</div>
      </div>
      <div className="card card-pad" style={{ maxWidth: 560 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Order Updates</div>
        <Toggle label="Order Confirmation" sub="Receive email when your order is placed" on />
        <Toggle label="Shipping Updates" sub="Track your order with delivery notifications" on />
        <Toggle label="Delivery Confirmation" sub="Notify me when my order arrives" on />
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 24, marginBottom: 4 }}>Promotions & Marketing</div>
        <Toggle label="Flash Sales" sub="Be first to know about limited-time offers" on />
        <Toggle label="New Products" sub="Updates when new components arrive in stock" />
        <Toggle label="Course Releases" sub="New training courses added to the catalogue" on />
        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 24, marginBottom: 4 }}>SMS Alerts</div>
        <Toggle label="Order SMS" sub="Receive order updates via text message" on />
        <Toggle label="Promotional SMS" sub="Deals and promotions via SMS" />
        <button className="btn btn-primary" style={{ marginTop: 20 }}>Save Preferences</button>
      </div>
    </div>
  );
}
