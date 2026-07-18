import Link from 'next/link';
import { Icon } from './icon';

export function StoreFooter() {
  const feats = [
    ['truck', 'Fast Delivery', 'Same-day dispatch in Accra'],
    ['shield', 'Secure Payment', 'MTN MoMo & Card via Paystack'],
    ['headset', 'Engineering Support', 'Technical help available'],
    ['rosette', 'Quality Guaranteed', 'All products tested & verified'],
  ] as const;

  const shopLinks = [
    { label: 'Laptops & PCs', href: '/shop?category=laptops' },
    { label: 'Smart Home', href: '/shop?category=smart-home' },
    { label: 'Audio & Speakers', href: '/shop?category=audio' },
    { label: 'Arduino & MCU', href: '/shop?category=arduino-mcu' },
    { label: 'Sensors & Modules', href: '/shop?category=sensors' },
    { label: 'Power Supplies', href: '/shop?category=power' },
  ];

  const supportLinks = [
    { label: 'Track Order', href: '/account/orders' },
    { label: 'Warranty & Returns', href: '/account/support' },
    { label: 'Shipping Info', href: '/account/support' },
    { label: 'Contact Us', href: '/account/support' },
    { label: 'FAQ', href: '/account/support' },
  ];

  const connectLinks = [
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'Twitter / X', href: 'https://twitter.com', icon: 'twitter' },
    { label: 'WhatsApp', href: 'https://wa.me/233000000000', icon: 'whatsapp' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  ];

  return (
    <footer style={{
      background: '#1a1d23',
      borderTop: '1px solid rgba(0, 150, 255, 0.15)',
      marginTop: 48,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle glowing neon blue accent line at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0, 150, 255, 0.5), transparent)',
        boxShadow: '0 0 8px rgba(0, 150, 255, 0.3)',
      }} />

      {/* Features bar */}
      <div className="store-footer-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
        maxWidth: 1200, margin: '0 auto', padding: '32px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {feats.map(([ic, t, s]) => (
          <div key={t} className="row gap12">
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(0, 150, 255, 0.1)',
              color: '#0096ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 0 12px rgba(0, 150, 255, 0.08)',
            }}>
              <Icon name={ic} size={21} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#e8eaed' }}>{t}</div>
              <div style={{ fontSize: 12.5, color: '#9aa0a6' }}>{s}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main footer links — 4 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 2fr',
        gap: 40,
        maxWidth: 1200, margin: '0 auto', padding: '48px 24px 40px',
      }}>
        {/* Column 1: Brand + description */}
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 14, color: '#e8eaed', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#0096ff' }}>Volt</span>Core
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: '#9aa0a6', marginBottom: 20 }}>
            Premium electronics and components for engineers, makers, and tech enthusiasts. Fast shipping across Ghana with expert support.
          </div>
          <div className="row gap10" style={{ fontSize: 13, color: '#9aa0a6', marginBottom: 6 }}>
            <Icon name="mail" size={14} color="#0096ff" /> engineeringvoltcore@gmail.com
          </div>
          <div className="row gap10" style={{ fontSize: 13, color: '#9aa0a6' }}>
            <Icon name="phone" size={14} color="#0096ff" /> +233 559 411 222
          </div>
        </div>

        {/* Column 2: Shop */}
        <div>
          <div style={{
            fontWeight: 700, fontSize: 13, marginBottom: 20,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#0096ff',
          }}>
            Shop
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shopLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: 14, color: '#9aa0a6', textDecoration: 'none',
                transition: 'color .2s, padding-left .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0096ff'; e.currentTarget.style.paddingLeft = '4px'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#9aa0a6'; e.currentTarget.style.paddingLeft = '0'; }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Support */}
        <div>
          <div style={{
            fontWeight: 700, fontSize: 13, marginBottom: 20,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#0096ff',
          }}>
            Support
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {supportLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: 14, color: '#9aa0a6', textDecoration: 'none',
                transition: 'color .2s, padding-left .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0096ff'; e.currentTarget.style.paddingLeft = '4px'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#9aa0a6'; e.currentTarget.style.paddingLeft = '0'; }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social icons */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontWeight: 700, fontSize: 13, marginBottom: 16,
              textTransform: 'uppercase', letterSpacing: '1.5px',
              color: '#0096ff',
            }}>
              Connect
            </div>
            <div className="row gap10">
              {connectLinks.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  title={link.label}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#9aa0a6', textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0, 150, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(0, 150, 255, 0.3)';
                    e.currentTarget.style.color = '#0096ff';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 150, 255, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#9aa0a6';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                  <Icon name={link.icon} size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <div style={{
            fontWeight: 700, fontSize: 13, marginBottom: 20,
            textTransform: 'uppercase', letterSpacing: '1.5px',
            color: '#0096ff',
          }}>
            Newsletter
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: '#9aa0a6', marginBottom: 20 }}>
            Subscribe for exclusive deals, new arrivals, and tech tips delivered to your inbox.
          </div>
          <div style={{
            display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            maxWidth: 360,
          }}>
            <input type="email" placeholder="Enter your email"
              style={{
                flex: 1, padding: '12px 16px', border: 'none', outline: 'none',
                background: 'transparent', color: '#e8eaed', fontSize: 14,
                fontFamily: 'inherit',
              }} />
            <button style={{
              padding: '12px 22px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #0096ff, #0066cc)',
              color: '#fff', fontWeight: 700, fontSize: 13,
              fontFamily: 'inherit',
              boxShadow: '0 0 16px rgba(0, 150, 255, 0.3)',
              transition: 'box-shadow .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 150, 255, 0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 150, 255, 0.3)'; }}>
              Subscribe
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>
            No spam. Unsubscribe anytime.
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.2)',
        padding: '18px 24px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            &copy; {new Date().getFullYear()} VoltCore. All rights reserved.
          </div>
          <div className="row gap16" style={{ fontSize: 13 }}>
            <Link href="/account/support" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0096ff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}>
              Privacy Policy
            </Link>
            <Link href="/account/support" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0096ff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}>
              Terms of Service
            </Link>
            <Link href="/account/support" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0096ff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}>
              Shipping Policy
            </Link>
          </div>
          <div className="row gap8" style={{ fontSize: 12, color: '#6b7280', alignItems: 'center' }}>
            <span style={{
              padding: '4px 10px', borderRadius: 4,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#9aa0a6', fontWeight: 600,
            }}>Visa</span>
            <span style={{
              padding: '4px 10px', borderRadius: 4,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#9aa0a6', fontWeight: 600,
            }}>Mastercard</span>
            <span style={{
              padding: '4px 10px', borderRadius: 4,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#9aa0a6', fontWeight: 600,
            }}>MTN MoMo</span>
            <span style={{
              marginLeft: 8, padding: '4px 10px', borderRadius: 4,
              background: 'rgba(0, 150, 255, 0.1)',
              border: '1px solid rgba(0, 150, 255, 0.2)',
              color: '#0096ff', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.3px',
            }}>
              🔒 Secure Payment
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
