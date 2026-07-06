'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreShell } from '@/components/shells/store-shell';
import { ProductThumb } from '@/components/product-thumb';
import { StarRow } from '@/components/star-row';
import { ProductCard } from '@/components/product-card';
import { Icon } from '@/components/icon';
import { useStore } from '@/context/store-context';
import { money } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart, toggleWish, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('Description');

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (product) {
      fetch(`/api/products?cat=${product.category}&limit=5`)
        .then(r => r.json())
        .then(data => {
          setRelated((data.products ?? []).filter((p: Product) => p.id !== product.id).slice(0, 4));
        })
        .catch(() => {});
    }
  }, [product]);

  if (loading) return (
    <StoreShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="sub">Loading product…</div>
      </div>
    </StoreShell>
  );

  if (!product) return (
    <StoreShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Product not found</div>
        <button className="btn btn-primary" onClick={() => router.push('/shop')}>Back to Shop</button>
      </div>
    </StoreShell>
  );

  const inWish = wishlist.includes(product.id);

  const specs = [
    ['SKU', product.sku],
    ['Category', product.category],
    ['Stock', product.stock > 0 ? `${product.stock} units` : 'Out of stock'],
    ['Weight', '50g'],
    ['Voltage', '3.3V / 5V'],
    ['Operating Temp', '-40°C to +85°C'],
  ];

  return (
    <StoreShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        {/* Breadcrumb */}
        <div className="row gap6 sub" style={{ fontSize: 13, marginBottom: 20 }}>
          <span style={{ cursor: 'pointer', color: 'var(--blue-600)' }} onClick={() => router.push('/shop')}>Shop</span>
          <span>/</span>
          <span style={{ cursor: 'pointer', color: 'var(--blue-600)' }} onClick={() => router.push('/shop')}>{product.category}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
          {/* Product visual */}
          <div>
            <div className="card" style={{
              padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              aspectRatio: '1', marginBottom: 16, overflow: 'hidden',
            }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ProductThumb glyph={product.glyph} size={160} />
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[0,1,2,3].map(i => (
                <div key={i} className="card" style={{
                  padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: i === 0 ? '2px solid var(--blue-600)' : undefined,
                  overflow: 'hidden',
                }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ProductThumb glyph={product.glyph} size={36} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-600)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>
              {product.category}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.3, margin: '0 0 12px' }}>{product.name}</h1>
            <div className="row gap12" style={{ marginBottom: 14 }}>
              <StarRow rating={product.rating ?? 4.5} size={16} />
              <span className="sub" style={{ fontSize: 13 }}>({product.reviews ?? 34} reviews)</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--blue-600)', marginBottom: 8 }}>
              {money(product.price)}
            </div>
            {product.was && (
              <div style={{ marginBottom: 14 }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: 16, marginRight: 10 }}>{money(product.was)}</span>
                <span className="pill pill-red" style={{ fontSize: 12 }}>Save {Math.round((1 - product.price / product.was) * 100)}%</span>
              </div>
            )}
            <div className="sub" style={{ lineHeight: 1.6, marginBottom: 20, fontSize: 14 }}>{product.desc}</div>

            {/* Stock badge */}
            <div className="row gap8" style={{ marginBottom: 20 }}>
              {product.stock > 0
                ? <span className="pill pill-green"><span className="dot" />In Stock — {product.stock} units</span>
                : <span className="pill pill-red"><span className="dot" />Out of Stock</span>}
              <span className="pill pill-teal"><span className="dot" />Fast Delivery, Accra</span>
            </div>

            {/* Qty + Add to cart */}
            <div className="row gap12" style={{ marginBottom: 16 }}>
              <div className="row gap0" style={{ border: '1px solid var(--line)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="btn btn-ghost" style={{ borderRadius: 0, padding: '8px 14px', border: 'none' }}>−</button>
                <span style={{ padding: '8px 14px', fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="btn btn-ghost" style={{ borderRadius: 0, padding: '8px 14px', border: 'none' }}>+</button>
              </div>
              <button className="btn btn-primary grow" onClick={() => { addToCart(product.id, qty); router.push('/cart'); }}>
                <Icon name="cart" size={18} />Add to Cart
              </button>
              <button className="btn btn-ghost" onClick={() => toggleWish(product.id)} style={{ color: inWish ? 'var(--red)' : undefined }}>
                <Icon name="heart" size={18} />
              </button>
            </div>
            <button className="btn btn-soft" style={{ width: '100%' }}>Buy Now</button>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
              {[
                ['truck', 'Free shipping over GHS 500'],
                ['shield', 'Genuine components'],
                ['refresh', '30-day returns'],
                ['support', 'Engineering support'],
              ].map(([icon, text]) => (
                <div key={text} className="row gap8 sub" style={{ fontSize: 13 }}>
                  <Icon name={icon as 'truck'} size={14} color="var(--blue-600)" />{text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card card-pad" style={{ marginBottom: 32 }}>
          <div className="row gap0" style={{ borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
            {['Description', 'Specifications', 'Shipping & Returns', 'Reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 20px', border: 'none', cursor: 'pointer', background: 'transparent',
                fontWeight: tab === t ? 700 : 500, color: tab === t ? 'var(--blue-600)' : 'var(--muted)',
                borderBottom: tab === t ? '2px solid var(--blue-600)' : '2px solid transparent',
                fontSize: 14, marginBottom: -1,
              }}>{t}</button>
            ))}
          </div>
          {tab === 'Description' && (
            <div style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--ink)', maxWidth: 720 }}>
              <p>The <strong>{product.name}</strong> is a high-quality electronic component suitable for both hobbyist and professional applications. It delivers consistent performance in Ghana's tropical climate, rated for temperatures from −40°C to +85°C.</p>
              <p>Sourced directly from authorised distributors, every component is tested and verified before dispatch. VoltCore guarantees genuine parts with full manufacturer warranties.</p>
              <p>Ideal for IoT projects, embedded systems, automation, robotics, and industrial prototyping. Compatible with Arduino, Raspberry Pi, ESP32, and most development boards.</p>
            </div>
          )}
          {tab === 'Specifications' && (
            <table className="tbl" style={{ maxWidth: 520 }}>
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ fontWeight: 600, color: 'var(--muted)', width: 160, fontSize: 13.5 }}>{k}</td>
                    <td style={{ fontWeight: 600, fontSize: 13.5 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'Shipping & Returns' && (
            <div style={{ maxWidth: 720 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Delivery Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                <div className="row gap12" style={{ alignItems: 'flex-start' }}>
                  <Icon name="truck" size={20} color="var(--blue-600)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Standard Delivery (2–3 business days)</div>
                    <div className="sub" style={{ fontSize: 13, lineHeight: 1.5 }}>
                      Free for orders over GHS 500. A flat fee of GHS 25 applies to orders under GHS 500.
                      Delivered to your doorstep within the Greater Accra Region and major cities nationwide.
                    </div>
                  </div>
                </div>
                <div className="row gap12" style={{ alignItems: 'flex-start' }}>
                  <Icon name="truck" size={20} color="var(--c-orange)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Express Delivery (Same day, Accra)</div>
                    <div className="sub" style={{ fontSize: 13, lineHeight: 1.5 }}>
                      GHS 75 — Order before 12 PM for same-day delivery within Accra. Available Monday–Saturday.
                    </div>
                  </div>
                </div>
                <div className="row gap12" style={{ alignItems: 'flex-start' }}>
                  <Icon name="map" size={20} color="var(--c-green)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Pickup at Circle, Accra</div>
                    <div className="sub" style={{ fontSize: 13, lineHeight: 1.5 }}>
                      Free — Pick up your order at our Circle location. You'll receive a notification when your order is ready.
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Return & Refund Policy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                <div className="row gap12" style={{ alignItems: 'flex-start' }}>
                  <Icon name="refresh" size={20} color="var(--blue-600)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>30-Day Return Window</div>
                    <div className="sub" style={{ fontSize: 13, lineHeight: 1.5 }}>
                      You may return unused, unopened items within 30 days of delivery for a full refund or exchange.
                      Items must be in original packaging with all accessories included.
                    </div>
                  </div>
                </div>
                <div className="row gap12" style={{ alignItems: 'flex-start' }}>
                  <Icon name="shield" size={20} color="var(--c-green)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Defective or Damaged Items</div>
                    <div className="sub" style={{ fontSize: 13, lineHeight: 1.5 }}>
                      If you receive a defective or damaged item, contact us within 48 hours of delivery.
                      We will arrange a free replacement or full refund, including return shipping costs.
                    </div>
                  </div>
                </div>
                <div className="row gap12" style={{ alignItems: 'flex-start' }}>
                  <Icon name="card" size={20} color="var(--c-orange)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Refund Processing</div>
                    <div className="sub" style={{ fontSize: 13, lineHeight: 1.5 }}>
                      Refunds are processed within 5–7 business days after we receive the returned item.
                      The refund will be issued to your original payment method.
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Warranty</h3>
              <div className="row gap12" style={{ alignItems: 'flex-start' }}>
                <Icon name="check" size={20} color="var(--blue-600)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>12-Month Warranty</div>
                  <div className="sub" style={{ fontSize: 13, lineHeight: 1.5 }}>
                    All VoltCore products come with a 12-month warranty against manufacturing defects.
                    This covers faulty components, workmanship issues, and premature failure under normal use.
                    The warranty does not cover damage from misuse, modification, or improper installation.
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === 'Reviews' && (
            <div>
              <div className="row gap24" style={{ marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{product.rating ?? 4.5}</div>
                  <StarRow rating={product.rating ?? 4.5} size={18} />
                  <div className="sub" style={{ fontSize: 12, marginTop: 6 }}>Based on {product.reviews ?? 34} reviews</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5,4,3,2,1].map(n => (
                    <div key={n} className="row gap10" style={{ marginBottom: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, width: 10 }}>{n}</span>
                      <Icon name="star" size={12} color="var(--c-orange)" />
                      <div style={{ flex: 1, height: 6, background: 'var(--line)', borderRadius: 99 }}>
                        <div style={{ width: [72,15,8,3,2][5-n]+'%', height: '100%', borderRadius: 99, background: 'var(--c-orange)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {[
                { name: 'Kwame Mensah', stars: 5, text: 'Excellent component, arrived in perfect condition. Tested immediately and works flawlessly.', date: '3 Jun 2025' },
                { name: 'Akosua Boateng', stars: 4, text: 'Good quality for the price. Delivery to Tema was only 2 days, very impressed.', date: '1 Jun 2025' },
              ].map((r, i) => (
                <div key={i} style={{ padding: '16px 0', borderTop: '1px solid var(--line-2)' }}>
                  <div className="row gap10" style={{ marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                      {r.name.split(' ').map(x => x[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                      <div className="row gap6"><StarRow rating={r.stars} size={12} /><span className="sub" style={{ fontSize: 12 }}>{r.date}</span></div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>{r.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Related Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </StoreShell>
  );
}
