'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from './icon';

interface Banner {
  id: string; title: string; subtitle: string | null;
  image_url: string; link: string; cta_text: string;
  active: number; sort_order: number;
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      const active = (data.banners ?? []).filter((b: Banner) => b.active);
      setBanners(active);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
    const interval = setInterval(fetchBanners, 15000);
    return () => clearInterval(interval);
  }, [fetchBanners]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent(c => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent(c => (c + 1) % banners.length);

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a5f 100%)',
        padding: '48px 24px 40px', color: '#fff', textAlign: 'center',
      }}>
        <div style={{ height: 30, width: 300, margin: '0 auto 10px', background: 'rgba(255,255,255,0.1)', borderRadius: 8 }} />
        <div style={{ height: 18, width: 200, margin: '0 auto 24px', background: 'rgba(255,255,255,0.08)', borderRadius: 8 }} />
        <div style={{ height: 44, maxWidth: 480, margin: '0 auto', background: 'rgba(255,255,255,0.1)', borderRadius: 10 }} />
      </div>
    );
  }

  // If no active banners, show default hero
  if (banners.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a5f 100%)',
        padding: '48px 24px 40px', color: '#fff', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: '0 0 10px' }}>Electronics Shopping Mall</h1>
        <p style={{ fontSize: 15, opacity: .8, margin: '0 0 24px' }}>
          Microcontrollers, sensors, modules and tools — shipped across Ghana
        </p>
      </div>
    );
  }

  const banner = banners[current];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Banner slide */}
      <div style={{
        position: 'relative',
        minHeight: 280,
        display: 'flex', alignItems: 'center',
        background: banner.image_url
          ? `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%), url(${banner.image_url}) center/cover no-repeat`
          : 'linear-gradient(135deg, var(--navy) 0%, #1e3a5f 100%)',
        color: '#fff',
        padding: '48px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 600 }}>
            <h1 style={{
              fontSize: 32, fontWeight: 900, margin: '0 0 10px',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {banner.title}
            </h1>
            {banner.subtitle && (
              <p style={{
                fontSize: 16, opacity: .9, margin: '0 0 24px',
                textShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }}>
                {banner.subtitle}
              </p>
            )}
            <Link href={banner.link || '/shop'} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 99,
              background: '#fff', color: 'var(--navy)',
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              transition: 'transform .15s',
            }}>
              {banner.cta_text || 'Shop Now'}
              <Icon name="arrowR" size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prev} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)', transition: 'background .15s',
          }}>
            <Icon name="chevL" size={20} />
          </button>
          <button onClick={next} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)', transition: 'background .15s',
          }}>
            <Icon name="chevR" size={20} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {banners.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8,
        }}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 24 : 8, height: 8, borderRadius: 99,
              border: 'none', cursor: 'pointer',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all .3s',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
