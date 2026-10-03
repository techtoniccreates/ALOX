import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { editorial, products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALOX — The Art of Modern Luxury" },
      { name: "description", content: "Refined essentials designed for those who appreciate quality, simplicity and timeless expression." },
      { property: "og:title", content: "ALOX — The Art of Modern Luxury" },
      { property: "og:description", content: "Refined essentials designed for those who appreciate quality, simplicity and timeless expression." },
    ],
  }),
  component: Home,
});

const principles = [
  ["01", "Quality", "Thoughtfully selected materials and refined construction."],
  ["02", "Simplicity", "Design stripped back to what truly matters."],
  ["03", "Timelessness", "Created to remain relevant beyond seasons and trends."],
];

function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const arrivals = [...products].sort((a, b) => b.addedOrder - a.addedOrder).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-primary-foreground">
        <img src={hero} alt="ALOX campaign — model in a long black coat in a travertine hall" width={1920} height={1088}
          className="animate-zoomout absolute inset-0 h-full w-full object-cover object-[75%_center] opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
        <div className="container-lux relative flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0">
          <p className="eyebrow animate-fade text-gold [animation-delay:400ms]">Autumn / Winter 2026</p>
          <h1 className="display animate-rise mt-6 max-w-3xl text-[3.25rem] sm:text-7xl lg:text-[7.5rem] [animation-delay:300ms]">
            The Art of<br /><em className="font-light">Modern</em> Luxury
          </h1>
          <p className="animate-rise mt-8 max-w-md text-base leading-relaxed opacity-80 [animation-delay:550ms]">
            Refined essentials designed for those who appreciate quality, simplicity and timeless expression.
          </p>
          <div className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row [animation-delay:700ms]">
            <Link to="/shop" className="btn-light">Explore Collection</Link>
            <Link to="/about" className="btn-ghost-light">Discover ALOX</Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-lux py-24 md:py-36">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-gold">Featured Collection</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">Considered pieces</h2>
          </div>
          <Link to="/shop" className="eyebrow link-line hidden sm:inline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}><ProductCard product={p} /></Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-ivory">
        <div className="container-lux grid gap-10 py-28 md:grid-cols-12 md:py-44">
          <p className="eyebrow text-gold md:col-span-3">The ALOX Philosophy</p>
          <Reveal className="md:col-span-8">
            <h2 className="display text-5xl md:text-8xl">Less, but better.</h2>
            <p className="mt-10 max-w-2xl font-serif text-2xl leading-snug text-ink-soft md:text-3xl">
              ALOX is built around the belief that true luxury does not need to shout. Every detail is considered —
              from materials and form to the experience surrounding them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Crafted with intention */}
      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[60vh] overflow-hidden">
          <img src={editorial.craft} alt="Artisan hand-stitching black leather" loading="lazy" width={1152} height={1440}
            className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-ink px-6 py-20 text-primary-foreground md:px-16 lg:px-24">
          <p className="eyebrow text-gold">Crafted with Intention</p>
          <h2 className="display mt-5 text-4xl md:text-6xl">Made slowly,<br />made to last.</h2>
          <ol className="mt-14 divide-y divide-primary-foreground/15 border-y border-primary-foreground/15">
            {principles.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 120}>
                <li className="grid grid-cols-[3rem_1fr] gap-4 py-7">
                  <span className="font-serif text-lg text-gold">{n}</span>
                  <div>
                    <h3 className="eyebrow">{t}</h3>
                    <p className="mt-2 text-sm opacity-70">{d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Editorial */}
      <section className="container-lux py-24 md:py-36">
        <p className="eyebrow text-gold">Campaign</p>
        <h2 className="display mt-4 text-4xl md:text-6xl">Quiet architecture</h2>
        <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-8">
            <img src={editorial.ed2} alt="Model in an ivory suit seated on a black stone bench" loading="lazy" width={1600} height={1072}
              className="aspect-[3/2] w-full object-cover" />
          </Reveal>
          <Reveal className="md:col-span-4 md:mt-32" delay={150}>
            <img src={editorial.ed1} alt="Hands holding a black leather bag" loading="lazy" width={896} height={1152}
              className="aspect-[4/5] w-full object-cover" />
            <p className="mt-6 max-w-xs text-sm text-muted-foreground">
              Shot in a travertine gallery — the collection framed by stone, shadow and stillness.
            </p>
          </Reveal>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-lux border-t pb-24 pt-24 md:pb-36">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="eyebrow text-gold">New Arrivals</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">Just in</h2>
          </div>
          <Link to="/shop" search={{ filter: "New Arrivals" }} className="eyebrow link-line">Shop new</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
          {arrivals.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}><ProductCard product={p} /></Reveal>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("error");
    setState("done");
  };
  return (
    <section className="bg-ivory">
      <div className="container-lux grid gap-10 py-24 md:grid-cols-2 md:items-end md:py-32">
        <div>
          <p className="eyebrow text-gold">Newsletter</p>
          <h2 className="display mt-4 text-4xl md:text-6xl">Join the ALOX world.</h2>
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">Private previews, new collections and stories from the atelier.</p>
        </div>
        {state === "done" ? (
          <p className="font-serif text-2xl">Thank you — you're on the list.</p>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex-1">
              <span className="sr-only">Email address</span>
              <input value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
                placeholder="Email address" className="field" aria-invalid={state === "error"} />
              {state === "error" && <span className="mt-2 block text-xs text-destructive">Please enter a valid email.</span>}
            </label>
            <button className="btn-solid">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
