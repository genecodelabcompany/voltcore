'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

interface Banner {
  id: string; title: string; subtitle: string | null;
  image_url: string; link: string; cta_text: string;
  active: number; sort_order: number; created_at: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/banners').then(r => r.json());
    setBanners(res.banners ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (b: Banner) => {
    await fetch(`/api/banners/${b.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: b.active ? 0 : 1 }),
    });
    load();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete banner "${title}"?`)) return;
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <PageHead title="Banners" sub={`${banners.length} banner${banners.length !== 1 ? 's' : ''}`}
        actions={<Link href="/admin/banners/new" className="btn btn-primary"><Icon name="plus" size={16} /> Create Banner</Link>} />

      <div className="card card-pad">
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading banners…</div>
        ) : banners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <Icon name="image" size={40} color="var(--line)" />
            <div style={{ fontWeight: 700, marginTop: 16, marginBottom: 8 }}>No banners yet</div>
            <Link href="/admin/banners/new" className="btn btn-primary btn-sm">
              <Icon name="plus" size={14} /> Create first banner
            </Link>
          </div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Image</th><th>Title</th><th>Link</th><th>CTA</th><th>Active</th><th /></tr></thead>
            <tbody>
              {banners.map(b => (
                <tr key={b.id}>
                  <td>
                    {b.image_url ? (
                      <img src={b.image_url} alt={b.title} style={{ width: 80, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <div style={{ width: 80, height: 44, background: 'var(--surface-2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="image" size={18} color="var(--muted)" />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                    {b.subtitle && <div className="sub" style={{ fontSize: 12 }}>{b.subtitle}</div>}
                  </td>
                  <td className="mono sub" style={{ fontSize: 12 }}>{b.link}</td>
                  <td><span className="pill pill-teal" style={{ fontSize: 11 }}>{b.cta_text}</span></td>
                  <td>
                    <button onClick={() => toggleActive(b)} style={{
                      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: b.active ? 'var(--blue-600)' : 'var(--line)', position: 'relative', transition: 'background .2s',
                    }}>
                      <span style={{
                        position: 'absolute', top: 3, left: b.active ? 22 : 3,
                        width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left .2s',
                      }} />
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--c-red)' }}
                      onClick={() => handleDelete(b.id, b.title)}>
                      <Icon name="trash" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
