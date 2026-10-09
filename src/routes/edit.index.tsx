import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, lookProducts, looks } from "@/lib/products";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/edit/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "The ALOX Edit — Complete Looks" },
      { name: "description", content: "Curated, complete ALOX outfits for work, evening, weekend and travel. Shop the whole look or piece by piece." },
      { property: "og:title", content: "The ALOX Edit — Complete Looks" },
      { property: "og:description", content: "Curated, complete ALOX outfits. Shop the look." },
    ],
  }),
  component: EditPage,
});

const occasions = ["All", "Work", "Evening", "Weekend", "Travel", "Special occasion", "Everyday"];

function priceRange(slug: string) {
  const l = looks.find((x) => x.slug === slug);
  if (!l) return "";
  const ps = lookProducts(l).map((p) => p.price);
  return `${formatPrice(Math.min(...ps))} – ${formatPrice(Math.max(...ps))}`;
}

function EditPage() {
  const [occ, setOcc] = useState("All");
  const list = looks.filter((l) => occ === "All" || l.occasions.includes(occ));
  return (
    <>
      <section className="container-lux pb-12 pt-32 md:pt-44">
        <p className="eyebrow text-gold">Complete Looks</p>
        <h1 className="display animate-rise mt-5 text-5xl md:text-8xl">The ALOX Edit</h1>
        <p className="mt-6 max-w-lg text-muted-foreground">Complete outfits, styled in the studio. Shop the whole look, or the single piece that completes yours.</p>
      </section>
      <div className="container-lux border-y py-5">
        <p className="eyebrow mb-4 text-muted-foreground">What are you dressing for?</p>
        <div className="flex flex-wrap gap-2">
          {occasions.map((o) => (
            <button key={o} onClick={() => setOcc(o)} aria-pressed={occ === o}
              className={cn("border px-4 py-2 text-sm transition-colors", occ === o ? "border-ink bg-ink text-primary-foreground" : "hover:border-ink")}>{o}</button>
          ))}
        </div>
      </div>
      <section className="container-lux grid gap-x-8 gap-y-20 py-16 md:grid-cols-2 md:py-24">
        {list.map((l, i) => (
          <Reveal key={l.slug} delay={(i % 2) * 120} className={cn(i % 2 === 1 && "md:mt-32")}>
            <Link to="/edit/$slug" params={{ slug: l.slug }} className="group block">
              <div className="overflow-hidden bg-ivory">
                <img src={l.image} alt={l.name} loading="lazy" width={1024} height={1408} className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
              </div>
            </Link>
            <p className="eyebrow mt-6 text-gold">Look {l.number}</p>
            <h2 className="display mt-3 text-4xl">{l.name}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{l.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
              <div><dt className="eyebrow text-muted-foreground">Occasion</dt><dd className="mt-1">{l.occasions.join(" / ")}</dd></div>
              <div><dt className="eyebrow text-muted-foreground">Price range</dt><dd className="mt-1 tabular-nums">{priceRange(l.slug)}</dd></div>
            </dl>
            <Link to="/edit/$slug" params={{ slug: l.slug }} className="btn-solid mt-6">Shop the Look</Link>
          </Reveal>
        ))}
        {list.length === 0 && <p className="font-serif text-2xl">No looks for this occasion yet.</p>}
      </section>
    </>
  );
}
