import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHeading } from "@/components/site/PageHero";
import { cn } from "@/lib/utils";

const filters = ["All", "New Arrivals", "Featured", "Accessories", "Lifestyle", "Leather Goods"] as const;
const sorts = ["Featured", "Newest", "Price: Low to High", "Price: High to Low"] as const;

type Search = { filter?: string | undefined; sort?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    filter: typeof s["filter"] === "string" ? s["filter"] : undefined,
    sort: typeof s["sort"] === "string" ? s["sort"] : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "The Collection — ALOX" },
      { name: "description", content: "Explore the latest ALOX collection of leather goods, accessories and lifestyle pieces." },
      { property: "og:title", content: "The Collection — ALOX" },
      { property: "og:description", content: "Explore the latest ALOX collection." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { filter = "All", sort = "Featured", q } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Search) => navigate({ search: (s) => ({ ...s, ...patch }), replace: true });

  let list = products.filter((p) => {
    if (filter === "New Arrivals") return p.isNew;
    if (filter === "Featured") return p.featured;
    if (filter !== "All") return p.category === filter;
    return true;
  });
  if (q) {
    const t = q.toLowerCase();
    list = list.filter((p) => `${p.name} ${p.descriptor} ${p.category}`.toLowerCase().includes(t));
  }
  list = [...list].sort((a, b) => {
    if (sort === "Newest") return b.addedOrder - a.addedOrder;
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    return Number(!!b.featured) - Number(!!a.featured);
  });

  return (
    <>
      <PageHeading eyebrow="Shop" title="The Collection" sub="Explore the latest ALOX collection." />
      <div className="container-lux sticky top-16 z-30 border-y bg-background md:top-20">
        <div className="flex items-center justify-between gap-6 py-4">
          <div className="-mx-1 flex min-w-0 flex-1 gap-6 overflow-x-auto px-1 [scrollbar-width:none]">
            {filters.map((f) => (
              <button key={f} onClick={() => set({ filter: f === "All" ? undefined : f })}
                className={cn("eyebrow shrink-0 whitespace-nowrap pb-1 transition-colors", filter === f ? "border-b border-ink" : "text-muted-foreground hover:text-foreground")}>
                {f}
              </button>
            ))}
          </div>
          <label className="flex shrink-0 items-center gap-2 border-l pl-4">
            <span className="eyebrow hidden text-muted-foreground md:inline">Sort</span>
            <select value={sort} onChange={(e) => set({ sort: e.target.value })} className="eyebrow cursor-pointer bg-transparent outline-none">
              {sorts.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
      </div>
      <section className="container-lux py-14 md:py-20">
        <div className="mb-10 flex items-center justify-between">
          <p className="eyebrow text-muted-foreground">{list.length} {list.length === 1 ? "piece" : "pieces"}{q && <> for “{q}”</>}</p>
          {q && <button onClick={() => set({ q: undefined })} className="eyebrow link-line">Clear search</button>}
        </div>
        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl">Nothing matches your selection.</p>
            <button onClick={() => navigate({ search: {} })} className="btn-outline mt-8">View all pieces</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-8 lg:grid-cols-3">
            {list.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 3} />)}
          </div>
        )}
      </section>
    </>
  );
}
