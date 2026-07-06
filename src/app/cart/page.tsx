'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StoreShell } from '@/components/shells/store-shell';
import { OrderSummary } from '@/components/order-summary';
import { ProductThumb } from '@/components/product-thumb';
import { Icon } from '@/components/icon';
import { useStore } from '@/context/store-context';
import { money } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function CartPage() {
  const { cart, setQty, removeItem } = useStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?limit=500')
      .then(r => r.json())
      .then(data => setProducts(data.products ?? []))
      .catch(() => {});
  }, []);

  const productMap = new Map(products.map(p => [p.id, p]));

  const enriched = cart.map(item => ({
    ...item,
    product: productMap.get(item.id),
  })).filter(i => i.product);

  return (
    <StoreShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>
          Shopping Cart {cart.length > 0 && <span className="sub" style={{ fontSize: 16, fontWeight: 400 }}>({cart.length} item{cart.length !== 1 ? 's' : ''})</span>}
        </h1>
        {enriched.length === 0 ? (
          <div className="card card-pad" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Icon name="cart" size={48} color="var(--line)" />
            <div style={{ fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>Your cart is empty</div>
            <div className="sub" style={{ marginBottom: 24 }}>Add some components to get started.</div>
            <Link href="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'flex-start' }}>
            <div className="card card-pad">
              {enriched.map((item, i) => {
                const p = item.product!;
                return (
                  <div key={item.id} className="row gap16" style={{
                    padding: '18px 0',
                    borderBottom: i < enriched.length - 1 ? '1px solid var(--line-2)' : 'none',
                    alignItems: 'flex-start',
                  }}>
                    <Link href={`/product/${p.id}`} style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 'var(--r)', overflow: 'hidden' }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ProductThumb glyph={p.glyph} size={64} />
                      )}
                    </Link>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <Link href={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, marginBottom: 4 }}>{p.name}</div>
                      </Link>
                      <div className="sub" style={{ fontSize: 12, marginBottom: 10 }}>SKU: {p.sku}</div>
                      <div className="row gap8">
                        <div className="row gap0" style={{ border: '1px solid var(--line)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                          <button onClick={() => setQty(item.id, item.qty - 1)} className="btn btn-ghost" style={{ borderRadius: 0, padding: '5px 10px', border: 'none', fontSize: 16 }}>−</button>
                          <span style={{ padding: '5px 12px', fontWeight: 700, minWidth: 36, textAlign: 'center', fontSize: 14 }}>{item.qty}</span>
                          <button onClick={() => setQty(item.id, item.qty + 1)} className="btn btn-ghost" style={{ borderRadius: 0, padding: '5px 10px', border: 'none', fontSize: 16 }}>+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--muted)' }}>
                          <Icon name="trash" size={14} />Remove
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{money(p.price * item.qty)}</div>
                      {item.qty > 1 && <div className="sub" style={{ fontSize: 12, marginTop: 3 }}>{money(p.price)} each</div>}
                    </div>
                  </div>
                );
              })}
              <div className="row between" style={{ marginTop: 16 }}>
                <Link href="/shop" className="btn btn-ghost btn-sm"><Icon name="arrow-left" size={14} />Continue Shopping</Link>
              </div>
            </div>
            <OrderSummary checkoutHref="/checkout" />
          </div>
        )}
      </div>
    </StoreShell>
  );
}
