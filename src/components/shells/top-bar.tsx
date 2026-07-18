'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../logo';
import { Icon } from '../icon';
import { UserButton, useAuth, useClerk } from '@clerk/nextjs';

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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/shop');
    }
  }, [searchQuery, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }, [handleSearch]);

  return (
    <>
      <header className="topbar">
        <Link href="/shop"><Logo size={0.95} /></Link>
        <Link href="/shop" className="btn btn-primary topbar-cat-btn">
          <Icon name="menu" size={18} /> Browse Categories
        </Link>
        <form className="grow topbar-search" onSubmit={handleSearch}>
          <span style={{ position: 'absolute', left: 14, top: 13, color: 'var(--muted-2)' }}>
            <Icon name="search" size={18} />
          </span>
          <input className="input" style={{ paddingLeft: 42, height: 44, paddingRight: 96 }}
            placeholder="Search products, categories..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown} />
          <button type="submit" className="btn btn-primary btn-sm" style={{ position: 'absolute', right: 5, top: 5, height: 34 }}>Search</button>
        </form>
        <div className="row gap16">
          <button className="btn btn-ghost topbar-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name="menu" size={20} />
          </button>
          <Link href="/wishlist" className="topbar-icon-link">
            <div style={{ position: 'relative' }}>
              <Icon name="heart" size={22} />
              {wishCount > 0 && <span style={navBadgeBlue}>{wishCount}</span>}
            </div>
            <span className="topbar-icon-label">Wishlist</span>
          </Link>
          <Link href="/cart" className="topbar-icon-link">
            <div style={{ position: 'relative' }}>
              <Icon name="cart" size={22} />
              {cartCount > 0 && <span style={navBadgeBlue}>{cartCount}</span>}
            </div>
            <span className="topbar-icon-label">Cart</span>
          </Link>
          <button className="topbar-icon-btn"><Icon name="bell" size={20} /></button>
          <div className="topbar-auth">
            {isLoaded && isSignedIn ? (
              <>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: { width: 36, height: 36 },
                    },
                  }}
                />
                <button onClick={() => signOut({ redirectUrl: '/shop' })} className="topbar-auth-btn">
                  <Icon name="logout" size={15} style={{ marginRight: 6 }} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="topbar-auth-btn">
                  <Icon name="user" size={15} style={{ marginRight: 6 }} /> Login
                </Link>
                <Link href="/login" className="topbar-auth-btn-primary">
                  <Icon name="userPlus" size={15} style={{ marginRight: 6 }} /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div className="topbar-mobile-menu">
          <form style={{ position: 'relative', marginBottom: 16 }} onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }}>
            <span style={{ position: 'absolute', left: 14, top: 13, color: 'var(--muted-2)' }}>
              <Icon name="search" size={18} />
            </span>
            <input className="input" style={{ paddingLeft: 42, height: 44 }}
              placeholder="Search products, categories..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown} />
          </form>
          <Link href="/shop" className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', marginBottom: 8 }}
            onClick={() => setMobileMenuOpen(false)}>
            <Icon name="grid" size={18} /> Browse Categories
          </Link>
          <Link href="/wishlist" className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', marginBottom: 8 }}
            onClick={() => setMobileMenuOpen(false)}>
            <Icon name="heart" size={18} /> Wishlist {wishCount > 0 && `(${wishCount})`}
          </Link>
          <Link href="/cart" className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', marginBottom: 8 }}
            onClick={() => setMobileMenuOpen(false)}>
            <Icon name="cart" size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          <Link href="/services" className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', marginBottom: 8 }}
            onClick={() => setMobileMenuOpen(false)}>
            <Icon name="wrench" size={18} /> Services
          </Link>
          <Link href="/courses" className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', marginBottom: 8 }}
            onClick={() => setMobileMenuOpen(false)}>
            <Icon name="cap" size={18} /> Courses
          </Link>
          <Link href="/account" className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', marginBottom: 8 }}
            onClick={() => setMobileMenuOpen(false)}>
            <Icon name="user" size={18} /> My Account
          </Link>
        </div>
      )}
    </>
  );
}
