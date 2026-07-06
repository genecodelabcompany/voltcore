'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem } from '@/lib/types';
import { productById, setProducts } from '@/lib/data';

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  cartCount: number;
  toast: string | null;
  clearToast: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function useStored<T>(key: string, def: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [v, setV] = useState<T>(def);
  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) {
        Promise.resolve().then(() => {
          setV(JSON.parse(s));
        });
      }
    } catch { /* empty */ }
  }, [key]);
  const set = (val: T | ((prev: T) => T)) => {
    setV(prev => {
      const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* empty */ }
      return next;
    });
  };
  return [v, set];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useStored<CartItem[]>('vc_cart', []);
  const [wishlist, setWish] = useStored<string[]>('vc_wish', []);
  const [toast, setToast] = useState<string | null>(null);

  // Preload products into the in-memory cache for cart/checkout lookups
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  // Clear stale cart/wishlist items whose products no longer exist
  useEffect(() => {
    if (cart.length === 0 && wishlist.length === 0) return;
    fetch('/api/products?limit=500')
      .then(r => r.json())
      .then(data => {
        const ids = new Set((data.products ?? []).map((p: { id: string }) => p.id));
        setCart(prev => prev.filter(i => ids.has(i.id)));
        setWish(prev => prev.filter(id => ids.has(id)));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (id: string, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === id);
      if (ex) return prev.map(c => c.id === id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { id, qty }];
    });
    const p = productById(id);
    setToast((p ? p.name : 'Item') + ' added to cart');
    setTimeout(() => setToast(null), 2200);
  };

  const setQty = (id: string, qty: number) =>
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));

  const removeItem = (id: string) =>
    setCart(prev => prev.filter(c => c.id !== id));

  const clearCart = () => setCart([]);

  const toggleWish = (id: string) =>
    setWish(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, addToCart, setQty, removeItem, clearCart,
      toggleWish, cartCount, toast, clearToast: () => setToast(null),
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
