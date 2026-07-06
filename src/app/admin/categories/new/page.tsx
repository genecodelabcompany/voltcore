'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

const COLOR_OPTS = [
  { label: 'Blue',   value: 'var(--c-blue)' },
  { label: 'Green',  value: 'var(--c-green)' },
  { label: 'Purple', value: 'var(--c-purple)' },
  { label: 'Orange', value: 'var(--c-orange)' },
  { label: 'Pink',   value: 'var(--c-pink)' },
  { label: 'Teal',   value: 'var(--c-teal)' },
];

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName]       = useState('');
  const [icon, setIcon]       = useState('📦');
  const [color, setColor]     = useState('var(--c-blue)');
  const [sortOrder, setSortOrder] = useState('0');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon, color, sort_order: parseInt(sortOrder) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');
      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHead title="Add Category" sub="Create a new product category"
        actions={<Link href="/admin/categories" className="btn btn-ghost"><Icon name="chevL" size={16} /> Back</Link>} />

      <div className="card card-pad" style={{ maxWidth: 560 }}>
        {error && (
          <div style={{ marginBottom: 18, background: '#FEF2F2', color: 'var(--c-red)', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 10 }}>
            <Icon name="shield" size={18} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Category Name *</span>
            <input className="input" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Microcontrollers" required />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Icon (emoji)</span>
              <input className="input" value={icon} onChange={e => setIcon(e.target.value)}
                placeholder="📦" style={{ fontSize: 22 }} />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Sort Order</span>
              <input className="input" type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
            </label>
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Color</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLOR_OPTS.map(c => (
                <button key={c.value} type="button" onClick={() => setColor(c.value)} style={{
                  width: 36, height: 36, borderRadius: '50%', border: color === c.value ? '3px solid var(--ink)' : '3px solid transparent',
                  background: c.value, cursor: 'pointer',
                }} title={c.label} />
              ))}
            </div>
          </div>

          <div className="row gap12" style={{ justifyContent: 'flex-end' }}>
            <Link href="/admin/categories" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Creating…' : <><Icon name="plus" size={16} /> Create Category</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
