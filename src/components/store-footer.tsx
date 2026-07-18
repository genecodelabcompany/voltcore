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
    { label: 'All Products', href: '/shop' },
    { label: 'Arduino & MCU', href: '/shop?category=arduino-mcu' },
    { label: 'Sensors', href: '/shop?category=sensors' },
    { label: 'Modules', href: '/shop?category=modules' },
    { label: 'Power Supplies', href: '/shop?category=power' },
    { label: 'ICs & Components', href: '/shop?category=ics' },
  ];

  const accountLinks = [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/account/orders' },
    { label: 'My Wishlist', href: '/wishlist' },
    { label: 'My Courses', href: '/account/courses' },
    { label: 'Cart', href: '/cart' },
  ];

  const supportLinks = [
    { label: 'Contact Us', href: '/account/support' },
    { label: 'Track Order', href: '/account/orders' },
    { label: 'Shipping Info', href: '/account/support' },
    { label: 'Returns & Refunds', href: '/account/support' },
    { label: 'FAQ', href: '/account/support' },
  ];

  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: '#fff', marginTop: 48 }}>
      {/* Features bar */}
      <div className="store-footer-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
        maxWidth: 1200, margin: '0 auto', padding: '32px 24px',
        borderBottom: '1px solid var(--line)',
      }}>
        {feats.map(([ic, t, s]) => (
          <div key={t} className="row gap12">
            <div style={{
              width: 42, height: 42, borderRadius: 10, background: 'var(--blue-50)', color: 'var(--blue-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name={ic} size={21} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t}</div>
              <div className="sub" style={{ fontSize: 12.5 }}>{s}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main footer links */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40,
        maxWidth: 1200, margin: '0 auto', padding: '40px 24px',
      }}>
        {/* Brand column */}
        <div>
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 12, color: 'var(--blue-700)' }}>
            <Icon name="box" size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            VoltCore
          </div>
          <div className="sub" style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            Your trusted source for electronics components, Arduino boards, sensors, modules, and engineering tools in Ghana. Fast delivery across Accra and nationwide shipping available.
          </div>
          <div className="row gap12">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
              width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink-2)', transition: 'all .15s',
            }}>
              <Icon name="facebook" size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
              width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink-2)', transition: 'all .15s',
            }}>
              <Icon name="instagram" size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
              width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink-2)', transition: 'all .15s',
            }}>
              <Icon name="twitter" size={18} />
            </a>
            <a href="https://wa.me/233000000000" target="_blank" rel="noopener noreferrer" style={{
              width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink-2)', transition: 'all .15s',
            }}>
              <Icon name="whatsapp" size={18} />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-2)' }}>
            Shop
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shopLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: 14, color: 'var(--muted)', textDecoration: 'none',
                transition: 'color .15s',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Account links */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-2)' }}>
            Account
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {accountLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: 14, color: 'var(--muted)', textDecoration: 'none',
                transition: 'color .15s',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Support links */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-2)' }}>
            Support
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {supportLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: 14, color: 'var(--muted)', textDecoration: 'none',
                transition: 'color .15s',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <div className="row gap10" style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
              <Icon name="mail" size={14} /> support@voltcore.com
            </div>
            <div className="row gap10" style={{ fontSize: 13, color: 'var(--muted)' }}>
              <Icon name="phone" size={14} /> +233 000 000 000
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--line)', background: 'var(--surface-2)',
        padding: '16px 24px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div className="sub" style={{ fontSize: 13 }}>
            &copy; {new Date().getFullYear()} VoltCore. All rights reserved.
          </div>
          <div className="row gap16" style={{ fontSize: 13 }}>
            <Link href="/account/support" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/account/support" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/account/support" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Shipping Policy</Link>
          </div>
          <div className="row gap8" style={{ fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ padding: '4px 8px', background: '#fff', borderRadius: 4, border: '1px solid var(--line)' }}>Visa</span>
            <span style={{ padding: '4px 8px', background: '#fff', borderRadius: 4, border: '1px solid var(--line)' }}>Mastercard</span>
            <span style={{ padding: '4px 8px', background: '#fff', borderRadius: 4, border: '1px solid var(--line)' }}>MTN MoMo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
