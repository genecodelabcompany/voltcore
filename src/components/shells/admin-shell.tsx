'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../logo';
import { Icon } from '../icon';
import { ReactNode } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';

const ADMIN_NAV = [
  { sec: null, items: [['admin', 'grid', 'Dashboard']] },
  { sec: 'Manage', items: [
    ['/admin/orders', 'orders', 'Orders'], ['/admin/products', 'box', 'Products'],
    ['/admin/categories', 'tags', 'Categories'], ['/admin/brands', 'layers', 'Brands'],
    ['/admin/inventory', 'pkg', 'Inventory'], ['/admin/customers', 'users', 'Customers'],
    ['/admin/reviews', 'star', 'Reviews'], ['/admin/coupons', 'tags', 'Coupons'],
    ['/admin/refunds', 'refund', 'Refunds'],
  ]},
  { sec: 'Services & Training', items: [
    ['/admin/courses', 'cap', 'Courses'], ['/admin/enrollments', 'book', 'Enrollments'],
    ['/admin/training-inq', 'headset', 'Training Inquiries'], ['/admin/services', 'wrench', 'Services'],
    ['/admin/service-inq', 'doc', 'Service Inquiries'],
  ]},
  { sec: 'Content', items: [
    ['/admin/banners', 'image', 'Banners'], ['/admin/pages', 'doc', 'Pages'],
    ['/admin/blog', 'book', 'Blog Posts'], ['/admin/media', 'image', 'Media Library'],
  ]},
  { sec: 'Analytics', items: [['/admin/analytics', 'bars', 'Reports & Analytics']] },
  { sec: 'Settings', items: [
    ['/admin/users', 'users', 'Users & Roles'], ['/admin/settings', 'gear', 'Settings'],
    ['/admin/payments', 'card', 'Payment Methods'], ['/admin/shipping', 'truck', 'Shipping'],
    ['/admin/logs', 'list', 'System Logs'],
  ]},
] as const;

const iconBtn: React.CSSProperties = {
  position: 'relative', width: 38, height: 38, borderRadius: 9, border: 'none',
  background: 'var(--surface-2)', color: 'var(--ink-2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const navBadge: React.CSSProperties = {
  position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, padding: '0 4px',
  borderRadius: 99, background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff',
};

const TITLES: Record<string, string> = {
  '/admin': 'Admin Dashboard', '/admin/orders': 'Orders', '/admin/products': 'Products',
  '/admin/inventory': 'Inventory', '/admin/customers': 'Customers', '/admin/analytics': 'Reports & Analytics',
  '/admin/categories': 'Categories', '/admin/brands': 'Brands', '/admin/reviews': 'Reviews',
  '/admin/coupons': 'Coupons', '/admin/refunds': 'Refunds', '/admin/courses': 'Courses',
  '/admin/enrollments': 'Enrollments', '/admin/training-inq': 'Training Inquiries',
  '/admin/services': 'Services', '/admin/service-inq': 'Service Inquiries',
  '/admin/banners': 'Banners', '/admin/pages': 'Pages', '/admin/blog': 'Blog Posts',
  '/admin/media': 'Media Library', '/admin/users': 'Users & Roles', '/admin/settings': 'Settings',
  '/admin/payments': 'Payment Methods', '/admin/shipping': 'Shipping', '/admin/logs': 'System Logs',
};

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = TITLES[pathname] || 'Admin';
  const { user } = useUser();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{
        width: 248, flexShrink: 0, background: '#fff', borderRight: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--line-2)' }}>
          <Link href="/admin"><Logo size={0.92} /></Link>
        </div>
        <nav className="no-sb" style={{ padding: '12px 12px 24px', overflowY: 'auto', flex: 1 }}>
          {ADMIN_NAV.map((grp, gi) => (
            <div key={gi} style={{ marginBottom: 6 }}>
              {grp.sec && <div className="eyebrow" style={{ padding: '14px 12px 6px' }}>{grp.sec}</div>}
              {grp.items.map(([to, ic, label]) => {
                const href = to === 'admin' ? '/admin' : to;
                const active = pathname === href;
                return (
                  <Link key={to} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 9,
                    fontSize: 13.5, fontWeight: active ? 700 : 500, marginBottom: 1,
                    color: active ? '#fff' : 'var(--ink-2)',
                    background: active ? 'var(--blue-600)' : 'transparent',
                    boxShadow: active ? '0 2px 8px rgba(37,99,235,.3)' : 'none',
                  }}>
                    <Icon name={ic} size={18} sw={active ? 2 : 1.8} />{label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: 64, background: '#fff', borderBottom: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 20,
        }}>
          <button className="row" style={{ background: 'none', border: 'none', color: 'var(--ink-2)' }}>
            <Icon name="menu" size={22} />
          </button>
          <div className="h3" style={{ fontSize: 16 }}>{title}</div>
          <div className="grow" style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: 11, color: 'var(--muted-2)' }}>
              <Icon name="search" size={18} />
            </span>
            <input className="input"
              style={{ paddingLeft: 42, height: 42, background: 'var(--surface-2)', border: '1px solid var(--line-2)' }}
              placeholder="Search orders, products, customers..." />
          </div>
          <div className="row gap16">
            <button style={iconBtn}>
              <Icon name="bell" size={20} />
              <span style={navBadge}>5</span>
            </button>
            <button style={iconBtn}><Icon name="help" size={20} /></button>
            <div className="row gap8" style={{ paddingLeft: 6, borderLeft: '1px solid var(--line)', alignItems: 'center' }}>
              <UserButton appearance={{ elements: { avatarBox: { width: 34, height: 34 } } }} />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.firstName || 'Admin'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{user?.primaryEmailAddress?.emailAddress || 'Super Admin'}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="fade-in" style={{ padding: '28px 24px 40px', flex: 1 }}>{children}</main>
        <footer style={{
          padding: '16px 24px', borderTop: '1px solid var(--line)', background: '#fff',
          display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)',
        }}>
          <span>© 2026 VoltCore Electronics. All rights reserved.</span>
          <span>Made with ♥ in Accra, Ghana</span>
        </footer>
      </div>
    </div>
  );
}
