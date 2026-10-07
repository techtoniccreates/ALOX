import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, getLook, lookProducts, looks } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/edit/$slug")({
  loader: ({ params }) => {
    const look = getLook(params.slug);
    if (!look) throw notFound();
    return { look };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Look not found — ALOX" }, { name: "robots", content: "noindex" }] };
    const l = loaderData.look;
    return {
      meta: [
        { title: `${l.name} — The ALOX Edit` },
        { name: "description", content: l.description },
        { property: "og:title", content: `${l.name} — The ALOX Edit` },
        { property: "og:description", content: l.description },
      ],
    };
  },
  component: LookPage,
});

function LookPage() {
  const { look } = Route.useLoaderData();
  const items = lookProducts(look);
  const { add } = useStore();
  const [opts, setOpts] = useState<Record<string, string>>(() => Object.fromEntries(items.map((p) => [p.slug, p.options.values[0] ?? ""])));
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const total = items.reduce((a, p) => a + p.price, 0);
  const others = looks.filter((l) => l.slug !== look.slug).slice(0, 2);

  const addOne = (slug: string) => { add(slug, opts[slug] ?? ""); setAdded((a) => ({ ...a, [slug]: true })); };
  const addAll = () => { items.forEach((p) => add(p.slug, opts[p.slug] ?? "")); setAdded(Object.fromEntries(items.map((p) => [p.slug, true]))); };

  return (
    <>
      <section className="grid gap-10 pt-16 md:grid-cols-12 md:gap-16 md:pt-20">
        <div className="md:col-span-6">
          <img src={look.image} alt={look.name} width={1024} height={1408} className="w-full object-cover md:sticky md:top-20 md:h-[calc(100vh-5rem)]" />
        </div>
        <div className="container-lux md:col-span-6 md:px-0 md:pr-16 md:pt-16">
          <Link to="/edit" className="eyebrow link-line text-muted-foreground">The ALOX Edit</Link>
          <p className="eyebrow mt-8 text-gold">Look {look.number}</p>
          <h1 className="display mt-4 text-5xl md:text-7xl">{look.name}</h1>
          <p className="mt-6 max-w-md text-muted-foreground">{look.description}</p>
          <p className="eyebrow mt-6">Occasion · <span className="text-muted-foreground">{look.occasions.join(" / ")}</span></p>

          <h2 className="eyebrow mt-14 border-b pb-4">The look includes</h2>
          <ul className="divide-y">
            {items.map((p, i) => (
              <li key={p.slug} style={{ animationDelay: `${150 + i * 140}ms` }} className="animate-slide-x grid grid-cols-[88px_1fr] gap-5 py-6">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="bg-ivory"><img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" /></Link>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="font-serif text-xl leading-tight">{p.name}</Link>
                    <span className="shrink-0 text-sm tabular-nums">{formatPrice(p.price)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="sr-only">{p.options.label}</span>
                      <select value={opts[p.slug]} onChange={(e) => setOpts({ ...opts, [p.slug]: e.target.value })} className="border bg-transparent px-2 py-1.5 text-sm text-foreground outline-none">
                        {p.options.values.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </label>
                    <button onClick={() => addOne(p.slug)} className={cn("eyebrow link-line", added[p.slug] && "text-gold")}>{added[p.slug] ? "Added ✓" : "Add to Bag"}</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="eyebrow">Complete look · <span className="tabular-nums">{formatPrice(total)}</span></p>
            <button onClick={addAll} className="btn-solid lift">Add Entire Look to Bag</button>
          </div>
          {Object.keys(added).length > 0 && <Link to="/cart" className="eyebrow link-line mt-6 inline-block text-gold">View bag</Link>}
        </div>
      </section>
      <section className="container-lux py-24 md:py-36">
        <h2 className="display mb-12 text-4xl md:text-5xl">More from the Edit</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {others.map((l) => (
            <Link key={l.slug} to="/edit/$slug" params={{ slug: l.slug }} className="group">
              <img src={l.image} alt={l.name} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />
              <p className="eyebrow mt-4 text-gold">Look {l.number}</p>
              <p className="mt-1 font-serif text-2xl">{l.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
