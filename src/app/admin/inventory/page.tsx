'use client';
import { useState, useEffect, useCallback } from 'react';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { CardHead } from '@/components/card-head';
import { ProductThumb } from '@/components/product-thumb';
import { Icon } from '@/components/icon';

interface Product {
  id: string; name: string; sku: string; glyph: string;
  stock: number; status: string;
}

interface Stats {
  total: number; total_stock: number; low_stock: number; out_of_stock: number;
}

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, total_stock: 0, low_stock: 0, out_of_stock: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [prodRes, analyticsRes] = await Promise.all([
      fetch('/api/products?limit=200').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()),
    ]);
    const all: Product[] = prodRes.products ?? [];
    // Sort by stock ascending so lowest stock appears first
    all.sort((a, b) => a.stock - b.stock);
    setProducts(all);
    if (analyticsRes.products) setStats(analyticsRes.products);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHead title="Inventory" sub="Track stock levels and restock alerts"
        actions={<button className="btn btn-primary" onClick={load}><Icon name="refresh" size={16} />Refresh</button>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total SKUs"       value={String(stats.total)} />
        <MiniStat label="Units in Stock"   value={String(stats.total_stock)} />
        <MiniStat label="Low Stock Alerts" value={String(stats.low_stock)}  c="var(--c-orange)" />
        <MiniStat label="Out of Stock"     value={String(stats.out_of_stock)} c="var(--c-red)" />
      </div>

      <div className="card card-pad">
        <CardHead title="Stock Levels — Restock Priority" />
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading inventory…</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '48px 0', fontSize: 14 }}>
            No products in inventory yet. <a href="/admin/products/new" className="link">Add a product →</a>
          </div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Product</th><th>SKU</th><th>In Stock</th><th>Reorder Level</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {products.map(p => {
                const pct = Math.min(100, (p.stock / 80) * 100);
                const st = p.stock === 0
                  ? ['pill-red',   'Out of stock']
                  : p.stock < 20
                  ? ['pill-amber', 'Critical']
                  : p.stock < 40
                  ? ['pill-proc',  'Low']
                  : ['pill-green', 'Healthy'];
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="row gap12">
                        <ProductThumb glyph={p.glyph} size={38} />
                        <span style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="mono sub" style={{ fontSize: 12 }}>{p.sku}</td>
                    <td style={{ width: 160 }}>
                      <div className="row gap8">
                        <span style={{ fontWeight: 700, width: 32 }}>{p.stock}</span>
                        <div style={{ flex: 1, height: 6, background: 'var(--line)', borderRadius: 99 }}>
                          <div style={{
                            width: pct + '%', height: '100%', borderRadius: 99,
                            background: p.stock === 0 ? 'var(--c-red)' : p.stock < 20 ? 'var(--c-orange)' : 'var(--c-green)',
                          }} />
                        </div>
                      </div>
                    </td>
                    <td className="sub">40 units</td>
                    <td><span className={`pill ${st[0]}`}><span className="dot" />{st[1]}</span></td>
                    <td>
                      <a href={`/admin/products`} className="btn btn-soft btn-sm">Manage</a>
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
