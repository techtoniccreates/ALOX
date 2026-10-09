import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, getLook, lookProducts, looks } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SizeGuide } from "@/components/site/SizeGuide";
import { OutfitReviews } from "@/components/site/OutfitReviews";
import { needsSize } from "@/lib/sizing";
import { Button } from "@/components/ui/button";

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
  component: () => { const { look } = Route.useLoaderData(); return <LookPage key={look.slug} />; },
});

function LookPage() {
  const { look } = Route.useLoaderData();
  const items = lookProducts(look);
  const { add } = useStore();
  const [opts, setOpts] = useState<Record<string, string>>(() => Object.fromEntries(items.map((p) => [p.slug, needsSize(p) ? "" : p.options.values[0] ?? ""])));
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const total = items.reduce((a, p) => a + p.price, 0);
  const others = looks.filter((l) => l.slug !== look.slug).slice(0, 2);
  const missing = items.filter((p) => !opts[p.slug]);

  const addOne = (slug: string) => { const selected = opts[slug]; if (!selected) return; add(slug, selected); setAdded((a) => ({ ...a, [slug]: true })); };
  const addAll = () => { if (missing.length) return; items.forEach((p) => add(p.slug, opts[p.slug] ?? "")); setAdded(Object.fromEntries(items.map((p) => [p.slug, true]))); };

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
              <li key={p.slug} style={{ animationDelay: `${150 + i * 140}ms` }} className="animate-slide-x grid grid-cols-[72px_1fr] gap-4 py-6 sm:grid-cols-[88px_1fr]">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="bg-ivory"><img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" /></Link>
                <div className="min-w-0">
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="font-serif text-xl leading-tight">{p.name}</Link>
                    <span className="shrink-0 text-sm tabular-nums">{formatPrice(p.price)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{p.options.label}</span>
                      <select aria-label={`${p.name} ${p.options.label}`} value={opts[p.slug]} onChange={(e) => { setOpts({ ...opts, [p.slug]: e.target.value }); setAdded((a) => ({ ...a, [p.slug]: false })); }} className="max-w-full border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        {needsSize(p) && <option value="" disabled>Select size</option>}
                        {p.options.values.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </label>
                    <SizeGuide product={p} />
                    <Button variant="editorial" size="natural" disabled={!opts[p.slug]} onClick={() => addOne(p.slug)} className={cn("eyebrow link-line p-0", added[p.slug] && "text-gold")}>{added[p.slug] ? "Added ✓" : "Add to Bag"}</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="eyebrow">Complete look · <span className="tabular-nums">{formatPrice(total)}</span></p>
            <Button variant="luxury" size="natural" disabled={missing.length > 0} onClick={addAll} className="whitespace-normal">Add Entire Look to Bag</Button>
          </div>
          {missing.length > 0 && <p className="mt-4 text-sm text-muted-foreground">Choose sizes for {missing.length} {missing.length === 1 ? "piece" : "pieces"} to complete your look.</p>}
          {Object.values(added).some(Boolean) && <Link to="/cart" className="eyebrow link-line mt-6 inline-block text-gold">View bag</Link>}
        </div>
      </section>
      <OutfitReviews key={look.slug} slug={look.slug} />
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
