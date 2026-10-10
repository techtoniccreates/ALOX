import { useEffect, useState } from "react";
import { getProduct, type Product } from "@/lib/products";
import { readRecent } from "@/lib/recent";
import { ProductCard } from "./ProductCard";

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    setItems(readRecent().filter((s) => s !== exclude).map(getProduct).filter((p): p is Product => !!p).slice(0, 4));
  }, [exclude]);
  if (!items.length) return null;
  return (
    <section className="container-lux border-t py-24 md:py-32">
      <p className="eyebrow text-gold">Your history</p>
      <h2 className="display mb-12 mt-4 text-4xl md:text-5xl">Recently viewed</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  );
}
