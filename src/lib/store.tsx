import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "./products";

export type CartLine = { slug: string; option: string; qty: number };

type Store = {
  cart: CartLine[];
  wishlist: string[];
  add: (slug: string, option: string, qty?: number) => void;
  setQty: (slug: string, option: string, qty: number) => void;
  remove: (slug: string, option: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<Store | null>(null);
const KEY = "alox-store-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setCart(d.cart ?? []);
        setWishlist(d.wishlist ?? []);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify({ cart, wishlist }));
  }, [cart, wishlist, ready]);

  const value = useMemo<Store>(() => {
    const same = (l: CartLine, s: string, o: string) => l.slug === s && l.option === o;
    return {
      cart,
      wishlist,
      add: (slug, option, qty = 1) =>
        setCart((c) =>
          c.some((l) => same(l, slug, option))
            ? c.map((l) => (same(l, slug, option) ? { ...l, qty: l.qty + qty } : l))
            : [...c, { slug, option, qty }],
        ),
      setQty: (slug, option, qty) =>
        setCart((c) => c.map((l) => (same(l, slug, option) ? { ...l, qty: Math.max(1, qty) } : l))),
      remove: (slug, option) => setCart((c) => c.filter((l) => !same(l, slug, option))),
      clear: () => setCart([]),
      toggleWish: (slug) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])),
      count: cart.reduce((a, l) => a + l.qty, 0),
      subtotal: cart.reduce((a, l) => a + (getProduct(l.slug)?.price ?? 0) * l.qty, 0),
    };
  }, [cart, wishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

export const SHIPPING_THRESHOLD = 500;
export const shippingFor = (subtotal: number) => (subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : 25);
