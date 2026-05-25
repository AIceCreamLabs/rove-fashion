import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/lib/products';

interface Item { product: Product; size: string; qty: number; }
interface Ctx {
  items: Item[];
  add: (p: Product, size: string) => void;
  remove: (slug: string, size: string) => void;
  count: number;
  total: string;
}

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const add = useCallback((product: Product, size: string) => {
    setItems(prev => {
      const ex = prev.find(i => i.product.slug === product.slug && i.size === size);
      return ex
        ? prev.map(i => i === ex ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { product, size, qty: 1 }];
    });
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.product.slug === slug && i.size === size)));
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = '£' + items.reduce((s, i) => s + parseFloat(i.product.price.replace(/[^0-9.]/g, '')) * i.qty, 0).toLocaleString();

  return <CartCtx.Provider value={{ items, add, remove, count, total }}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart outside provider');
  return c;
};
