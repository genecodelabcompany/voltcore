'use client';
import { useState, useEffect } from 'react';
import { Icon } from '@/components/icon';
import { useUser } from '@clerk/nextjs';

interface Address {
  id: string; label: string; line1: string; line2: string; is_default: number;
}

export default function AccountAddresses() {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/addresses')
      .then(r => r.json())
      .then(d => { setAddresses(d.addresses ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="row between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Delivery Addresses</h2>
          <div className="sub" style={{ marginTop: 4 }}>Manage your saved delivery locations</div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={16} />Add Address</button>
      </div>
      {loading ? (
        <div className="sub" style={{ textAlign: 'center', padding: '40px 0' }}>Loading addresses…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {addresses.map(a => (
            <div key={a.id} className="card card-pad" style={{ position: 'relative' }}>
              {a.is_default ? <span className="pill pill-green" style={{ position: 'absolute', top: 14, right: 14, fontSize: 11 }}>Default</span> : null}
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{a.label}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>{a.line1}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>{a.line2}</div>
              <div className="row gap8" style={{ marginTop: 16 }}>
                <button className="btn btn-ghost btn-sm">Edit</button>
                {!a.is_default && <button className="btn btn-ghost btn-sm">Set Default</button>}
                {!a.is_default && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>Remove</button>}
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
      )}
    </div>
  );
}
