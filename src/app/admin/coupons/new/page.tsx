'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

export default function AddCouponPage() {
  const router = useRouter();
  const [code, setCode]           = useState('');
  const [type, setType]           = useState<'percent' | 'fixed'>('percent');
  const [value, setValue]         = useState('');
  const [minOrder, setMinOrder]   = useState('');
  const [maxUses, setMaxUses]     = useState('');
  const [expires, setExpires]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
      };
      if (minOrder) body.min_order = parseFloat(minOrder);
      if (maxUses) body.max_uses = parseInt(maxUses);
      if (expires) body.expires_at = expires;

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon');
      router.push('/admin/coupons');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHead title="Create Coupon" sub="Set up a new promotional discount code"
        actions={<Link href="/admin/coupons" className="btn btn-ghost"><Icon name="chevL" size={16} /> Back</Link>} />

      <div className="card card-pad" style={{ maxWidth: 560 }}>
        {error && (
          <div style={{ marginBottom: 18, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="shield" size={18} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Coupon Code *</span>
            <input className="input mono" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="SUMMER25" required style={{ letterSpacing: 1, fontWeight: 700 }} />
            <span className="sub" style={{ fontSize: 12 }}>Auto-uppercased. Must be unique.</span>
          </label>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Discount Type</div>
            <div className="row gap12">
              {(['percent', 'fixed'] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: `2px solid ${type === t ? 'var(--blue-600)' : 'var(--line)'}`,
                  background: type === t ? 'var(--blue-50)' : 'transparent', color: type === t ? 'var(--blue-600)' : 'var(--ink)',
                  fontWeight: 600, cursor: 'pointer',
                }}>
                  {t === 'percent' ? '% Percentage' : 'GHS Fixed Amount'}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{type === 'percent' ? 'Discount %' : 'Discount Amount (GHS)'} *</span>
            <input className="input" type="number" min="0.01" step="0.01" value={value}
              onChange={e => setValue(e.target.value)} required
              placeholder={type === 'percent' ? '10' : '50.00'} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Min. Order (GHS)</span>
              <input className="input" type="number" min="0" step="0.01" value={minOrder}
                onChange={e => setMinOrder(e.target.value)} placeholder="0 = no minimum" />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Max Uses</span>
              <input className="input" type="number" min="1" value={maxUses}
                onChange={e => setMaxUses(e.target.value)} placeholder="Unlimited" />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Expires</span>
            <input className="input" type="date" value={expires} onChange={e => setExpires(e.target.value)} />
            <span className="sub" style={{ fontSize: 12 }}>Leave blank for no expiry</span>
          </label>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/coupons" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Creating…' : <><Icon name="plus" size={16} /> Create Coupon</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
