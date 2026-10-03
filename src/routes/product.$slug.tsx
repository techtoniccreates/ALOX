import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { formatPrice, getProduct, products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — ALOX" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — ALOX` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — ALOX` },
        { property: "og:description", content: p.description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { add, wishlist, toggleWish } = useStore();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [option, setOption] = useState<string>(p.options.values[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openTab, setOpenTab] = useState<string | null>("Product Details");
  const wished = wishlist.includes(p.slug);
  const related = products.filter((x) => x.slug !== p.slug && x.category === p.category).concat(products.filter((x) => x.category !== p.category)).slice(0, 4);

  const addToCart = () => {
    add(p.slug, option, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const sections: [string, string][] = [
    ["Product Details", p.description],
    ["Material & Care", `${p.material} ${p.care}`],
    ["Shipping & Returns", "Complimentary delivery on orders over £500. Returns accepted within 30 days in original condition. Each piece arrives in ALOX signature packaging."],
  ];

  return (
    <>
      <section className="container-lux grid gap-10 pt-24 md:grid-cols-12 md:gap-16 md:pt-32">
        {/* Gallery */}
        <div className="md:col-span-7">
          <div className="grid gap-4 md:grid-cols-[80px_1fr]">
            <div className="order-2 flex gap-3 md:order-1 md:flex-col">
              {p.images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}
                  className={cn("w-20 border transition-opacity", active === i ? "border-ink" : "border-transparent opacity-60 hover:opacity-100")}>
                  <img src={img} alt="" className="aspect-[4/5] w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="order-1 overflow-hidden bg-ivory md:order-2">
              <img key={active} src={p.images[active]} alt={p.name} width={896} height={1152} className="animate-fade aspect-[4/5] w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <nav className="eyebrow text-muted-foreground">
            <Link to="/shop" className="link-line">Collection</Link> <span className="mx-2">/</span> {p.category}
          </nav>
          <h1 className="display mt-6 text-5xl md:text-6xl">{p.name}</h1>
          <p className="mt-3 text-muted-foreground">{p.descriptor}</p>
          <p className="mt-6 text-lg tabular-nums">{formatPrice(p.price)}</p>
          <p className="mt-8 leading-relaxed text-ink-soft">{p.description}</p>

          <div className="mt-10">
            <p className="eyebrow">{p.options.label} — <span className="text-muted-foreground">{option}</span></p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.options.values.map((v) => (
                <button key={v} onClick={() => setOption(v)} aria-pressed={option === v}
                  className={cn("min-w-14 border px-4 py-2.5 text-sm transition-colors", option === v ? "border-ink bg-ink text-primary-foreground" : "hover:border-ink")}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <p className="eyebrow">Quantity</p>
            <div className="flex items-center border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
              <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3" aria-label="Increase"><Plus className="h-3 w-3" /></button>
            </div>
          </div>

          <div className="mt-10 grid gap-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <button onClick={addToCart} className="btn-solid">{added ? "Added to Bag ✓" : "Add to Bag"}</button>
              <button onClick={() => toggleWish(p.slug)} aria-label="Wishlist" aria-pressed={wished} className="border px-5 hover:border-ink">
                <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} strokeWidth={1.25} />
              </button>
            </div>
            <button onClick={() => { add(p.slug, option, qty); navigate({ to: "/checkout" }); }} className="btn-outline">Buy Now</button>
            {added && <Link to="/cart" className="eyebrow link-line mt-2 justify-self-start text-gold">View bag</Link>}
          </div>

          <div className="mt-12 border-t">
            {sections.map(([title, body]) => (
              <div key={title} className="border-b">
                <button onClick={() => setOpenTab(openTab === title ? null : title)} className="flex w-full items-center justify-between py-5" aria-expanded={openTab === title}>
                  <span className="eyebrow">{title}</span>
                  <span className="text-lg font-light">{openTab === title ? "−" : "+"}</span>
                </button>
                {openTab === title && <p className="animate-fade pb-6 text-sm leading-relaxed text-muted-foreground">{body}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-lux py-24 md:py-36">
        <h2 className="display mb-12 text-4xl md:text-5xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
          {related.map((r) => <ProductCard key={r.slug} product={r} />)}
        </div>
      </section>
    </>
  );
}
