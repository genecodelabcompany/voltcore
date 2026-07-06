'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

interface Coupon {
  id: string; code: string; type: string; value: number;
  min_order: number | null; max_uses: number | null; used_count: number;
  active: number; expires_at: string | null; created_at: string;
}

function fmtDiscount(c: Coupon) {
  return c.type === 'percent' ? `${c.value}%` : `GHS ${c.value.toFixed(2)}`;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/coupons').then(r => r.json());
    setCoupons(res.coupons ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (c: Coupon) => {
    await fetch(`/api/coupons/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: c.active ? 0 : 1 }),
    });
    load();
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    load();
  };

  const isExpired = (expires: string | null) =>
    expires ? new Date(expires) < new Date() : false;

  return (
    <div>
      <PageHead title="Coupons" sub={`${coupons.length} coupon${coupons.length !== 1 ? 's' : ''}`}
        actions={<Link href="/admin/coupons/new" className="btn btn-primary"><Icon name="plus" size={16} /> Create Coupon</Link>} />

      <div className="card card-pad">
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading coupons…</div>
        ) : coupons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <Icon name="tag" size={40} color="var(--line)" />
            <div style={{ fontWeight: 700, marginTop: 16, marginBottom: 8 }}>No coupons yet</div>
            <Link href="/admin/coupons/new" className="btn btn-primary btn-sm">
              <Icon name="plus" size={14} /> Create first coupon
            </Link>
          </div>
        ) : (
          <table className="tbl tbl-hover">
            <thead>
              <tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Usage</th><th>Expires</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {coupons.map(c => {
                const expired = isExpired(c.expires_at);
                const exhausted = c.max_uses !== null && c.used_count >= c.max_uses;
                return (
                  <tr key={c.id}>
                    <td>
                      <span className="mono" style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1, background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 6 }}>
                        {c.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--c-green)' }}>{fmtDiscount(c)}</td>
                    <td className="sub">{c.min_order ? `GHS ${c.min_order}` : '—'}</td>
                    <td className="sub">
                      {c.used_count}{c.max_uses !== null ? ` / ${c.max_uses}` : ''}
                      {exhausted && <span className="pill pill-red" style={{ fontSize: 10, marginLeft: 6 }}>Exhausted</span>}
                    </td>
                    <td className="sub" style={{ fontSize: 12 }}>
                      {c.expires_at ? (
                        <span style={{ color: expired ? 'var(--c-red)' : 'inherit' }}>
                          {new Date(c.expires_at).toLocaleDateString()}
                          {expired && ' (expired)'}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      <button onClick={() => toggleActive(c)} style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: c.active ? 'var(--blue-600)' : 'var(--line)', position: 'relative', transition: 'background .2s',
                      }}>
                        <span style={{
                          position: 'absolute', top: 3, left: c.active ? 22 : 3,
                          width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left .2s',
                        }} />
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--c-red)' }}
                        onClick={() => handleDelete(c.id, c.code)}>
                        <Icon name="trash" size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
