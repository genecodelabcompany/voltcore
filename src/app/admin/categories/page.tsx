'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

interface Category { id: string; name: string; slug: string; icon: string; color: string; sort_order: number; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/categories').then(r => r.json());
    setCategories(res.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <PageHead title="Categories" sub={`${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
        actions={
          <Link href="/admin/categories/new" className="btn btn-primary">
            <Icon name="plus" size={16} /> Add Category
          </Link>
        } />

      <div className="card card-pad">
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading categories…</div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>No categories yet</div>
            <Link href="/admin/categories/new" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
              <Icon name="plus" size={14} /> Create your first category
            </Link>
          </div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Icon</th><th>Name</th><th>Slug</th><th>Sort Order</th><th /></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: 22 }}>{c.icon}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.color, flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="mono sub" style={{ fontSize: 12 }}>{c.slug}</td>
                  <td className="sub">{c.sort_order}</td>
                  <td>
                    <div className="row gap8">
                      <Link href={`/admin/categories/new?edit=${c.id}`} className="btn btn-ghost btn-sm">
                        <Icon name="edit" size={14} /> Edit
                      </Link>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--c-red)' }}
                        onClick={() => handleDelete(c.id, c.name)}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
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
