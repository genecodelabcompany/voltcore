'use client';
import { Suspense, useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { StoreShell } from '@/components/shells/store-shell';
import { ProductCard } from '@/components/product-card';
import { BannerCarousel } from '@/components/banner-carousel';
import { Icon } from '@/components/icon';
import { money } from '@/lib/utils';

interface Category { id: string; name: string; icon: string; }
interface Product {
  id: string; name: string; brand: string; price: number; was: number | null;
  rating: number; reviews: number; stock: number; glyph: string;
  badge: string | null; cat: string; description: string; image_url: string | null;
  image_urls?: string[];
}


const PRICE_RANGES = [
  { label: 'All Prices',    min: 0,   max: Infinity },
  { label: 'Under GHS 50',  min: 0,   max: 50 },
  { label: 'GHS 50 – 200',  min: 50,  max: 200 },
  { label: 'GHS 200 – 500', min: 200, max: 500 },
  { label: 'Over GHS 500',  min: 500, max: Infinity },
];
const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'];

type LayoutMode = 'grid' | 'single';

function ShopContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [cat, setCat]           = useState('all');

  const [priceIdx, setPriceIdx] = useState(0);
  const [sort, setSort]         = useState('Relevance');
  const [search, setSearch]     = useState(searchParams.get('q') ?? '');
  const [inStock, setInStock]   = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout]     = useState<LayoutMode>('grid');

  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?status=published&limit=200');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch { /* ignore */ }
  }, []);

  // Initial fetch
  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetchProducts(),
    ]).then(([catData]) => {
      setCategories(catData.categories ?? []);
      setLoading(false);
    });
  }, [fetchProducts]);

  // Poll every 15 seconds for real-time updates when admin adds/changes products
  useEffect(() => {
    const interval = setInterval(fetchProducts, 15000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const range = PRICE_RANGES[priceIdx];

  const filtered = useMemo(() => {
    let r = products;
    if (cat !== 'all') r = r.filter(p => p.cat === cat);

    if (search) r = r.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
    r = r.filter(p => p.price >= range.min && p.price <= range.max);
    if (inStock) r = r.filter(p => p.stock > 0);
    if (sort === 'Price: Low to High') r = [...r].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') r = [...r].sort((a, b) => b.price - a.price);
    if (sort === 'Top Rated')          r = [...r].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return r;
  }, [products, cat, priceIdx, sort, search, inStock, range]);

  const catBtn = (id: string, label: string, icon?: string) => (
    <button key={id} onClick={() => setCat(id)}
      style={{
        padding: '8px 12px', borderRadius: 'var(--r)', border: 'none', cursor: 'pointer', textAlign: 'left',
        background: cat === id ? 'var(--blue-50)' : 'transparent',
        color: cat === id ? 'var(--blue-600)' : 'var(--ink)',
        fontWeight: cat === id ? 700 : 400, fontSize: 14, width: '100%',
      }}>
      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}{label}
    </button>
  );

  return (
    <StoreShell noFooter>
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

        {/* Dynamic Banner Carousel */}
        <BannerCarousel />

        {/* Search bar */}
        <div style={{
          background: 'var(--navy)',
          padding: '0 24px 24px', color: '#fff', textAlign: 'center',
        }}>
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <Icon name="search" size={18} color="var(--muted)" />
            </span>
            <input className="input" placeholder="Search components…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42, width: '100%', background: '#fff' }} />
          </div>
        </div>

        {/* Order success banner */}
        {orderId && (
          <div style={{
            background: '#ECFDF3', color: 'var(--c-green)', padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 14, fontWeight: 600,
          }}>
            <Icon name="check" size={20} />
            Order <strong>#{orderId}</strong> placed successfully! We'll send a confirmation to your email.
          </div>
        )}

        {/* Category strip — visible on all screen sizes, scrollable */}
        <div className="cat-strip">

          <button className={`cat-pill${cat === 'all' ? ' active' : ''}`} onClick={() => setCat('all')}>
            🏪 All
          </button>
          {categories.map(c => (
            <button key={c.id} className={`cat-pill${cat === c.id ? ' active' : ''}`} onClick={() => setCat(c.id)}>
              {c.icon && <span>{c.icon}</span>} {c.name}
            </button>
          ))}
        </div>

        {/* Mobile filter toggle */}
        <div className="shop-cat-strip" style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', background: 'var(--surface)', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(f => !f)}>
            <Icon name="settings" size={15} /> Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="shop-cat-strip" style={{ flexDirection: 'column', padding: '16px', background: 'var(--surface)', borderBottom: '1px solid var(--line)', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Price Range</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {PRICE_RANGES.map((p, i) => (
                  <button key={i} onClick={() => setPriceIdx(i)} style={{
                    padding: '6px 14px', borderRadius: 99, border: `1.5px solid ${priceIdx === i ? 'var(--blue-600)' : 'var(--line)'}`,
                    background: priceIdx === i ? 'var(--blue-50)' : 'transparent',
                    color: priceIdx === i ? 'var(--blue-600)' : 'var(--ink)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{p.label}</button>
                ))}
              </div>
            </div>
            <label className="row gap8" style={{ cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
              In Stock Only
            </label>
          </div>
        )}

        {/* Main layout */}
        <div className="shop-layout">

          {/* Sidebar (desktop only) */}
          <aside className="shop-sidebar">
            <div className="card card-pad" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Browse Categories</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {catBtn('all', 'All Categories')}
                {categories.map(c => catBtn(c.id, c.name, c.icon))}
              </div>
            </div>
            <div className="card card-pad" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Price Range</div>
              {PRICE_RANGES.map((p, i) => (
                <label key={i} className="row gap8" style={{ marginBottom: 10, cursor: 'pointer', fontSize: 13.5 }}>
                  <input type="radio" checked={priceIdx === i} onChange={() => setPriceIdx(i)} />
                  {p.label}
                </label>
              ))}
            </div>
            <div className="card card-pad">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Availability</div>
              <label className="row gap8" style={{ cursor: 'pointer', fontSize: 13.5 }}>
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                In Stock Only
              </label>
            </div>
          </aside>

          {/* Product grid */}
          <div>
            <div className="row between" style={{ marginBottom: 18 }}>
              <span className="sub" style={{ fontSize: 14 }}>
                {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
              </span>
              <div className="row gap8">
                {/* Layout toggle */}
                <div className="row gap4" style={{ marginRight: 8, border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setLayout('grid')}
                    style={{
                      padding: '6px 10px', border: 'none', cursor: 'pointer', fontSize: 13,
                      background: layout === 'grid' ? 'var(--blue-600)' : 'transparent',
                      color: layout === 'grid' ? '#fff' : 'var(--muted)',
                      display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600,
                    }}
                    title="Grid View"
                  >
                    <Icon name="grid" size={14} /> Grid
                  </button>
                  <button
                    onClick={() => setLayout('single')}
                    style={{
                      padding: '6px 10px', border: 'none', cursor: 'pointer', fontSize: 13,
                      background: layout === 'single' ? 'var(--blue-600)' : 'transparent',
                      color: layout === 'single' ? '#fff' : 'var(--muted)',
                      display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600,
                    }}
                    title="Single Column View"
                  >
                    <Icon name="list" size={14} /> List
                  </button>
                </div>
                <span className="sub" style={{ fontSize: 13, alignSelf: 'center' }}>Sort:</span>
                <select className="input" value={sort} onChange={e => setSort(e.target.value)}
                  style={{ fontSize: 13, padding: '6px 10px', width: 'auto' }}>
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card" style={{ height: 320, background: 'var(--surface-2)' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                <Icon name="search" size={40} color="var(--line)" />
                <div style={{ fontWeight: 700, marginTop: 16 }}>No products found</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters or search term.</div>
              </div>
            ) : layout === 'grid' ? (
              <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                {filtered.map(p => <ProductCard key={p.id} product={p as never} />)}
              </div>
            ) : (
              <div className="prod-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filtered.map(p => <ProductCard key={p.id} product={p as never} layout="single" />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreShell>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <StoreShell noFooter>
        <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="sub">Loading shop…</div>
        </div>
      </StoreShell>
    }>
      <ShopContent />
    </Suspense>
  );
}
