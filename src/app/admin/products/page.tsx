'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { MiniStat } from '@/components/mini-stat';
import { VcSelect } from '@/components/vc-select';
import { ProductThumb } from '@/components/product-thumb';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Product {
  id: string; name: string; cat_id: string; cat_name: string;
  price: number; sku: string; stock: number; sold: number;
  glyph: string; brand: string; status: string; badge: string | null;
}
interface Category { id: string; name: string; }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [cat, setCat] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, low_stock: 0, out_of_stock: 0 });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const catObj = categories.find(c => c.name === cat);
      const params = new URLSearchParams();
      if (catObj) params.set('cat', catObj.id);
      if (search) params.set('q', search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      let rows: Product[] = data.products ?? [];

      // Client-side sort
      if (sort === 'Price: Low–High') rows = rows.sort((a, b) => a.price - b.price);
      if (sort === 'Price: High–Low') rows = rows.sort((a, b) => b.price - a.price);
      if (sort === 'Best Selling') rows = rows.sort((a, b) => b.sold - a.sold);

      setProducts(rows);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [cat, search, sort, categories]);

  // Fetch categories + analytics on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()),
    ]).then(([catData, analyticsData]) => {
      setCategories(catData.categories ?? []);
      if (analyticsData.products) setStats(analyticsData.products);
    });
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProducts();
    });
  }, [fetchProducts]);

  const catOptions = ['All Categories', ...categories.map(c => c.name)];

  return (
    <div>
      <PageHead title="Products" sub={`${total} products across ${categories.length} categories`}
        actions={<>
          <button className="btn btn-ghost"><Icon name="download" size={16} />Export</button>
          <Link href="/admin/products/bulk" className="btn btn-ghost"><Icon name="upload" size={16} />Bulk Upload</Link>
          <Link href="/admin/products/new" className="btn btn-primary"><Icon name="plus" size={16} />Add Product</Link>
        </>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <MiniStat label="Total Products" value={String(stats.total)} />
        <MiniStat label="Published" value={String(stats.published)} c="var(--c-green)" />
        <MiniStat label="Low Stock" value={String(stats.low_stock)} c="var(--c-orange)" />
        <MiniStat label="Out of Stock" value={String(stats.out_of_stock)} c="var(--c-red)" />
      </div>

      <div className="card card-pad">
        <div className="row between" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
            <span style={{ position: 'absolute', left: 13, top: 11, color: 'var(--muted-2)' }}><Icon name="search" size={18} /></span>
            <input className="input" style={{ paddingLeft: 40 }} placeholder="Search products…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="row gap12">
            <VcSelect value={cat} options={catOptions} onChange={setCat} />
            <VcSelect value={sort} options={['Newest', 'Price: Low–High', 'Price: High–Low', 'Best Selling']} onChange={setSort} />
          </div>
        </div>

        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '48px 0' }}>Loading products…</div>
        ) : (
          <table className="tbl tbl-hover">
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th>Status</th><th /></tr></thead>
            <tbody>
              {products.map(p => {
                const st = p.stock === 0
                  ? ['pill-red', 'Out of stock']
                  : p.stock < 20
                  ? ['pill-amber', 'Low stock']
                  : ['pill-green', 'In stock'];
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="row gap12">
                        <ProductThumb glyph={p.glyph} size={40} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div>
                          <div className="sub" style={{ fontSize: 12 }}>{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono sub" style={{ fontSize: 12 }}>{p.sku}</td>
                    <td className="sub" style={{ fontSize: 13 }}>{p.cat_name || p.cat_id}</td>
                    <td style={{ fontWeight: 700 }}>{money(p.price)}</td>
                    <td style={{ fontWeight: 600 }}>{p.stock}</td>
                    <td className="sub">{p.sold}</td>
                    <td><span className={`pill ${st[0]}`}><span className="dot" />{st[1]}</span></td>
                    <td>
                      <div className="row gap8">
                        <Link href={`/product/${p.id}`} className="link"><Icon name="eye" size={17} /></Link>
                        <Link href={`/admin/products/${p.id}`} className="link" title="Edit"><Icon name="edit" size={17} /></Link>
                        <button className="link" style={{ cursor: 'pointer', color: 'var(--muted)', background: 'none', border: 'none' }}
                          onClick={async () => {
                            if (!confirm(`Delete "${p.name}"?`)) return;
                            await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
                            fetchProducts();
                          }}>
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && products.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
