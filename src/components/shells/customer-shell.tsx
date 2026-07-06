'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TopBar } from './top-bar';
import { StoreFooter } from '../store-footer';
import { Icon } from '../icon';
import { useStore } from '@/context/store-context';
import { ReactNode } from 'react';
import { SignOutButton } from '@clerk/nextjs';

const CUST_NAV = [
  ['/account', 'grid', 'Dashboard'], ['/account/orders', 'orders', 'Orders'],
  ['/wishlist', 'heart', 'Wishlist'], ['/account/addresses', 'pin', 'Addresses'],
  ['/account/details', 'user', 'Account Details'], ['/account/payment', 'card', 'Payment Methods'],
  ['/account/courses', 'book', 'My Courses'], ['/account/downloads', 'download', 'Downloads'],
  ['/account/support', 'help', 'Support Tickets'], ['/account/notifications', 'bell', 'Notifications'],
  ['/account/settings', 'gear', 'Settings'],
] as const;

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();
  const wishCount = wishlist.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar cartCount={cartCount} wishCount={wishCount} />
      <div style={{
        display: 'flex', maxWidth: 1480, margin: '0 auto',
        padding: '24px 28px 0', gap: 28, alignItems: 'flex-start',
      }}>
        <aside style={{ width: 236, flexShrink: 0, position: 'sticky', top: 96 }}>
          <nav className="card" style={{ padding: 10 }}>
            {CUST_NAV.map(([to, ic, label]) => {
              const active = pathname === to;
              return (
                <Link key={to} href={to} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderRadius: 9,
                  fontSize: 14, fontWeight: active ? 700 : 500, marginBottom: 2,
                  color: active ? 'var(--blue-700)' : 'var(--ink-2)',
                  background: active ? 'var(--blue-50)' : 'transparent',
                }}>
                  <Icon name={ic} size={19} />{label}
                </Link>
              );
            })}
            <div className="divider" style={{ margin: '8px 4px' }} />
            <SignOutButton redirectUrl="/">
              <button style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px',
                borderRadius: 9, fontSize: 14, fontWeight: 500, color: 'var(--ink-2)',
                background: 'none', border: 'none', cursor: 'pointer', width: '100%',
              }}>
                <Icon name="logout" size={19} />Logout
              </button>
            </SignOutButton>
          </nav>
          <div className="card card-pad" style={{ marginTop: 16, background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
            <div style={{ fontWeight: 700, color: 'var(--blue-700)', fontSize: 14, marginBottom: 6 }}>Need Help?</div>
            <div className="sub" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
              Our engineering support team is here to help you.
            </div>
            <Link href="/account/support" className="btn btn-ghost btn-block btn-sm">
              <Icon name="headset" size={16} />Contact Support
            </Link>
          </div>
        </aside>
        <main className="grow fade-in" style={{ minWidth: 0, paddingBottom: 40 }}>{children}</main>
      </div>
      <StoreFooter />
    </div>
  );
}
