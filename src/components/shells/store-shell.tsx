'use client';
import { TopBar } from './top-bar';
import { StoreFooter } from '../store-footer';
import { ReactNode } from 'react';
import { useStore } from '@/context/store-context';

interface StoreShellProps {
  children: ReactNode;
  wide?: boolean;
  noFooter?: boolean;
}

export function StoreShell({ children, noFooter }: StoreShellProps) {
  const { cart, wishlist } = useStore();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const wishCount = wishlist.length;
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar cartCount={cartCount} wishCount={wishCount} />
      <main className="fade-in">
        {children}
      </main>
      {!noFooter && <StoreFooter />}
    </div>
  );
}
