'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ProductThumb } from './product-thumb';
import { StarRow } from './star-row';
import { Icon } from './icon';
import { money } from '@/lib/utils';
import { useStore } from '@/context/store-context';
import type { Product } from '@/lib/types';
import { useAuth } from '@clerk/nextjs';

const badgeColor: Record<string, string> = {
  'Bestseller': 'pill-amber', 'Popular': 'pill-proc', 'New': 'pill-green',
  'Kit': 'pill-indigo', 'Low stock': 'pill-amber', 'Out of stock': 'pill-red',
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product: p }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWish, wishlist } = useStore();
  const { isSignedIn } = useAuth();
  const wished = wishlist.includes(p.id);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const images = p.image_urls?.length ? p.image_urls : (p.image_url ? [p.image_url] : []);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % images.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  const handleOrderNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p.id);
    router.push('/checkout');
  };


  return (
    <div
      className="card"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow .2s, transform .2s', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      <div style={{ position: 'relative' }}>
        <div onClick={() => router.push('/product/' + p.id)} style={{ display: 'block', height: 180, overflow: 'hidden', position: 'relative' }}>
          {(() => {
            if (images.length > 1) {
              return (
                <div style={{ display: 'flex', overflow: 'hidden', height: '100%', position: 'relative' }}>
                  {images.map((url, i) => (
                    <img key={i} src={url} alt={`${p.name} ${i + 1}`} style={{
                      minWidth: '100%', height: '100%', objectFit: 'cover',
                      transition: 'opacity 0.5s ease',
                      opacity: i === activeIdx ? 1 : 0,
                      position: i === activeIdx ? 'relative' : 'absolute',
                      top: 0, left: 0,
                    }} />
                  ))}
                  {/* Dots indicator */}
                  <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, zIndex: 2 }}>
                    {images.map((_, i) => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                </div>
              );
            }
            return images[0] ? (
              <img src={images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <ProductThumb glyph={p.glyph} fill radius={0} tag={p.name} />
            );
          })()}

        </div>

        {p.badge && (
          <span className={`pill ${badgeColor[p.badge] || 'pill-slate'}`} style={{ position: 'absolute', top: 12, left: 12 }}>
            {p.badge}
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggleWish(p.id); }}
          style={{
            position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%',
            border: 'none', background: '#fff', boxShadow: 'var(--shadow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: wished ? 'var(--red)' : 'var(--muted)',
          }}
        >
          <Icon name="heart" size={18} fill={wished ? 'var(--red)' : 'none'} />
        </button>
      </div>
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="sub" style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue-600)' }}>{p.brand}</div>
        <div
          onClick={() => router.push('/product/' + p.id)}
          style={{ fontWeight: 700, fontSize: 14.5, marginTop: 3, lineHeight: 1.35, minHeight: 38 }}
        >
          {p.name}
        </div>
        <div className="row gap8" style={{ marginTop: 6 }}>
          <StarRow rating={p.rating} />
          <span className="sub" style={{ fontSize: 12.5 }}>{p.rating} ({p.reviews})</span>
        </div>
        <div className="row between" style={{ marginTop: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>{money(p.price)}</span>
          {p.stock > 0
            ? <span className="pill pill-green" style={{ fontSize: 11 }}>In stock</span>
            : <span className="pill pill-red" style={{ fontSize: 11 }}>Out of stock</span>}
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            className="btn btn-ghost btn-block"
            style={{ border: '1px solid var(--line)', fontSize: 13 }}
            disabled={p.stock === 0}
            onClick={e => { e.stopPropagation(); addToCart(p.id); }}
          >
            <Icon name="cart" size={15} />{p.stock === 0 ? 'Notify Me' : 'Add to Cart'}
          </button>
          <button
            className="btn btn-primary btn-block"
            style={{ fontSize: 13 }}
            disabled={p.stock === 0}
            onClick={handleOrderNow}
          >
            <Icon name="arrowR" size={15} />Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
