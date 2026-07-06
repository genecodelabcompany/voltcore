'use client';
import { useState, useEffect } from 'react';
import { StoreShell } from '@/components/shells/store-shell';
import { ProductCard } from '@/components/product-card';
import { Icon } from '@/components/icon';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import type { Product } from '@/lib/types';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setLoading(false);
      return;
    }
    fetch('/api/products?limit=500')
      .then(r => r.json())
      .then(data => {
        const all: Product[] = data.products ?? [];
        setProducts(all.filter(p => wishlist.includes(p.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlist]);

  return (
    <StoreShell>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div className="row between" style={{ marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>My Wishlist</h1>
            <div className="sub" style={{ marginTop: 4 }}>Items you've saved for later</div>
          </div>
          <span className="sub" style={{ fontSize: 14 }}>{products.length} item{products.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="sub" style={{ textAlign: 'center', padding: '60px 0' }}>Loading wishlist…</div>
        ) : products.length === 0 ? (
          <div className="card card-pad" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Icon name="heart" size={48} color="var(--line)" />
            <h3 style={{ marginTop: 20, marginBottom: 8 }}>Your wishlist is empty</h3>
            <p className="sub" style={{ fontSize: 14, marginBottom: 24 }}>
              Save your favourite products and come back to them later.
            </p>
            <Link href="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
