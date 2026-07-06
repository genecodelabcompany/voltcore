'use client';
import Link from 'next/link';
import { Logo } from '../logo';
import { Icon } from '../icon';
import { SignInButton, SignUpButton, UserButton, useAuth, useClerk } from '@clerk/nextjs';

const iconBtn: React.CSSProperties = {
  position: 'relative', width: 38, height: 38, borderRadius: 9, border: 'none',
  background: 'var(--surface-2)', color: 'var(--ink-2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const navBadgeBlue: React.CSSProperties = {
  position: 'absolute', top: -7, right: -9, minWidth: 18, height: 18, padding: '0 4px',
  borderRadius: 99, background: 'var(--blue-600)', color: '#fff', fontSize: 10, fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff',
};
const authBtnStyle: React.CSSProperties = {
  height: 36, padding: '0 14px', borderRadius: 8, border: '1px solid var(--line)',
  background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600,
  color: 'var(--ink-1)',
};
const authBtnPrimaryStyle: React.CSSProperties = {
  height: 36, padding: '0 14px', borderRadius: 8, border: 'none',
  background: 'var(--blue-600)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
  color: '#fff',
};

interface TopBarProps {
  cartCount: number;
  wishCount: number;
}

export function TopBar({ cartCount, wishCount }: TopBarProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <header style={{
      height: 72, background: '#fff', borderBottom: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px',
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      <Link href="/shop"><Logo size={0.95} /></Link>
      <Link href="/shop" className="btn btn-primary" style={{ height: 44 }}>
        <Icon name="menu" size={18} /> Browse Categories
      </Link>
      <div className="grow" style={{ position: 'relative', maxWidth: 560 }}>
        <span style={{ position: 'absolute', left: 14, top: 13, color: 'var(--muted-2)' }}>
          <Icon name="search" size={18} />
        </span>
        <input className="input" style={{ paddingLeft: 42, height: 44, paddingRight: 96 }} placeholder="Search products, categories..." />
        <Link href="/shop" className="btn btn-primary btn-sm" style={{ position: 'absolute', right: 5, top: 5, height: 34 }}>Search</Link>
      </div>
      <div className="row gap16">
        <Link href="/wishlist" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'var(--ink-2)' }}>
          <div style={{ position: 'relative' }}>
            <Icon name="heart" size={22} />
            {wishCount > 0 && <span style={navBadgeBlue}>{wishCount}</span>}
          </div>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Wishlist</span>
        </Link>
        <Link href="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'var(--ink-2)' }}>
          <div style={{ position: 'relative' }}>
            <Icon name="cart" size={22} />
            {cartCount > 0 && <span style={navBadgeBlue}>{cartCount}</span>}
          </div>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Cart</span>
        </Link>
        <button style={iconBtn}><Icon name="bell" size={20} /></button>
        <div style={{ paddingLeft: 14, borderLeft: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8, minHeight: 36 }}>
          {isLoaded && isSignedIn ? (
            <>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: { width: 36, height: 36 },
                  },
                }}
              />
              <button onClick={() => signOut({ redirectUrl: '/shop' })} style={{ ...authBtnStyle, display: 'inline-flex', alignItems: 'center' }}>
                <Icon name="logout" size={15} style={{ marginRight: 6 }} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ ...authBtnStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                <Icon name="user" size={15} style={{ marginRight: 6 }} /> Login
              </Link>
              <Link href="/login" style={{ ...authBtnPrimaryStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                <Icon name="userPlus" size={15} style={{ marginRight: 6 }} /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
