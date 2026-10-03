import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(product.slug);
  return (
    <article className="group">
      <div className="relative overflow-hidden bg-ivory">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            width={896}
            height={1152}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
          />
          <img
            src={product.images[1]}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
          <span className="eyebrow absolute inset-x-0 bottom-0 translate-y-full bg-background/95 py-4 text-center transition-transform duration-500 group-hover:translate-y-0">
            View Product
          </span>
        </Link>
        {product.isNew && <span className="eyebrow absolute left-4 top-4 bg-background px-2 py-1 text-[10px]">New</span>}
        <button
          onClick={() => toggleWish(product.slug)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-4 top-4 p-1"
        >
          <Heart className={cn("h-4 w-4 transition-colors", wished ? "fill-gold text-gold" : "text-ink")} strokeWidth={1.25} />
        </button>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-xl leading-tight">
            <Link to="/product/$slug" params={{ slug: product.slug }}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.descriptor}</p>
        </div>
        <p className="shrink-0 text-sm tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
