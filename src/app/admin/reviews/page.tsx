'use client';
import { useState, useEffect, useCallback } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { ProductThumb } from '@/components/product-thumb';
import { StarRow } from '@/components/star-row';
import { Icon } from '@/components/icon';

interface Review {
  id: string; product_id: string; product_name: string;
  customer: string; rating: number; content: string;
  status: string; created_at: string;
}

const tabs: Record<string, string> = { Pending: 'pending', Approved: 'approved', Flagged: 'flagged' };
const pillFor: Record<string, string> = { pending: 'pill-amber', approved: 'pill-green', flagged: 'pill-red', rejected: 'pill-red' };

export default function AdminReviews() {
  const [tab, setTab] = useState('Pending');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews').then(r => r.json());
      setReviews(res.reviews ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this review?')) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    load();
  };

  const rows = reviews.filter(r => r.status === tabs[tab]);
  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const flaggedCount = reviews.filter(r => r.status === 'flagged').length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div>
      <PageHead title="Reviews" sub="Moderate and respond to customer product reviews"
        actions={<button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Average Rating" value={`${avgRating} ★`} c="var(--c-orange)" />
        <MiniStat label="Pending Moderation" value={String(pendingCount)} c="var(--amber)" />
        <MiniStat label="Total Reviews" value={String(reviews.length)} />
        <MiniStat label="Flagged" value={String(flaggedCount)} c="var(--c-red)" />
      </div>
      <div className="card card-pad">
        <div className="row gap8" style={{ marginBottom: 18 }}>
          {Object.keys(tabs).map(t => (
            <button key={t} onClick={() => setTab(t)} className="btn btn-sm" style={{
              background: tab === t ? 'var(--blue-600)' : 'var(--surface-2)',
              color: tab === t ? '#fff' : 'var(--ink-2)',
              border: `1px solid ${tab === t ? 'var(--blue-600)' : 'var(--line)'}`,
            }}>{t}</button>
          ))}
        </div>
        {loading ? (
          <div className="sub" style={{ padding: '32px 0', textAlign: 'center' }}>Loading reviews…</div>
        ) : rows.length === 0 ? (
          <div className="sub" style={{ padding: '32px 0', textAlign: 'center' }}>No {tab.toLowerCase()} reviews.</div>
        ) : rows.map((r, i) => (
          <div key={r.id} className="row gap16" style={{ padding: '18px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none', alignItems: 'flex-start' }}>
            <ProductThumb glyph="star" size={48} />
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="row gap12" style={{ flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.customer}</span>
                <StarRow rating={r.rating} size={13} />
                <span className={`pill ${pillFor[r.status] || 'pill-amber'}`} style={{ fontSize: 11 }}>{r.status}</span>
                <span className="sub" style={{ fontSize: 12 }}>· {r.product_name || r.product_id} · {new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p className="sub" style={{ marginTop: 7, lineHeight: 1.55, fontSize: 13.5 }}>{r.content}</p>
            </div>
            <div className="row gap8" style={{ flexShrink: 0 }}>
              {r.status !== 'approved' && (
                <button className="btn btn-soft btn-sm" onClick={() => updateStatus(r.id, 'approved')}>
                  <Icon name="check" size={15} />Approve
                </button>
              )}
              {r.status !== 'flagged' && (
                <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(r.id, 'flagged')}>
                  Flag
                </button>
              )}
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: 'var(--red-bg)' }}
                onClick={() => handleDelete(r.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
