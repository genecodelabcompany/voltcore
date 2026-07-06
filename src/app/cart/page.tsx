'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreShell } from '@/components/shells/store-shell';
import { ProductThumb } from '@/components/product-thumb';
import { OrderSummary } from '@/components/order-summary';
import { Icon } from '@/components/icon';
import { useStore } from '@/context/store-context';
import { money } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function CartPage() {
  const { cart, setQty, removeItem } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0) { setLoading(false); return; }
    fetch('/api/products?limit=500')
      .then(r => r.json())
      .then(data => {
        const all: Product[] = data.products ?? [];
        setProducts(all.filter(p => cart.some(c => c.id === p.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cart]);

  const cartItems = cart.map(c => {
    const p = products.find(pr => pr.id === c.id);
    return { ...c, product: p };
  }).filter(c => c.product);

  const subtotal = cartItems.reduce((s, c) => s + (c.product?.price ?? 0) * c.qty, 0);

  return (
    <StoreShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div className="cart-header row between" style={{ marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Shopping Cart</h1>
            <div className="sub" style={{ marginTop: 4 }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/shop')}>
            <Icon name="arrow-left" size={14} />Continue Shopping
          </button>
        </div>

        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '60px 0' }}>Loading cart…</div>
        ) : cartItems.length === 0 ? (
          <div className="card card-pad" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Icon name="cart" size={48} color="var(--line)" />
            <h3 style={{ marginTop: 20, marginBottom: 8 }}>Your cart is empty</h3>
            <p className="sub" style={{ fontSize: 14, marginBottom: 24 }}>
              Browse our catalogue and add items you'd like to purchase.
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/shop')}>Start Shopping</button>
          </div>
        ) : (
          <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cartItems.map(c => (
                <div key={c.id} className="card card-pad row gap16" style={{ alignItems: 'center' }}>
                  <div className="cart-item-thumb" style={{
                    width: 80, height: 80, borderRadius: 'var(--r)', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--surface-2)', flexShrink: 0,
                  }}>
                    {c.product?.image_url ? (
                      <img src={c.product.image_url} alt={c.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ProductThumb glyph={c.product?.glyph} size={36} />
                    )}
                  </div>
                  <div className="grow">
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{c.product?.name}</div>
                    <div className="sub" style={{ fontSize: 13, marginTop: 2 }}>{c.product?.sku}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--blue-600)', marginTop: 6 }}>
                      {money((c.product?.price ?? 0) * c.qty)}
                    </div>
                  </div>
                  <div className="cart-qty row gap0" style={{ border: '1px solid var(--line)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                    <button onClick={() => setQty(c.id, Math.max(1, c.qty - 1))} className="btn btn-ghost" style={{ borderRadius: 0, padding: '6px 12px', border: 'none' }}>−</button>
                    <span style={{ padding: '6px 12px', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{c.qty}</span>
                    <button onClick={() => setQty(c.id, c.qty + 1)} className="btn btn-ghost" style={{ borderRadius: 0, padding: '6px 12px', border: 'none' }}>+</button>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeItem(c.id)} style={{ color: 'var(--muted)' }}>
                    <Icon name="x" size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <OrderSummary checkoutHref="/checkout" />
            </div>
          </div>
        )}
      </div>
    </StoreShell>
  );
}
