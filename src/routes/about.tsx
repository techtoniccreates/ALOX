import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { editorial, products } from "@/lib/products";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ALOX — Defined by Less" },
      { name: "description", content: "The philosophy, materials, craft and approach behind ALOX." },
      { property: "og:title", content: "About ALOX — Defined by Less" },
      { property: "og:description", content: "The philosophy, materials, craft and approach behind ALOX." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="container-lux pb-16 pt-32 md:pt-44">
        <p className="eyebrow text-gold">About ALOX</p>
        <h1 className="display animate-rise mt-6 text-6xl md:text-[9rem]">Defined<br />by less.</h1>
      </section>
      <img src={hero} alt="ALOX campaign in a travertine hall" width={1920} height={1088} className="h-[70vh] w-full object-cover" />

      <section className="container-lux grid gap-10 py-24 md:grid-cols-12 md:py-36">
        <p className="eyebrow text-gold md:col-span-3">Our Philosophy</p>
        <Reveal className="md:col-span-7">
          <p className="font-serif text-3xl leading-snug md:text-5xl">
            We believe luxury is a feeling of quiet certainty — the weight of good leather, a line drawn once and drawn well.
          </p>
          <p className="mt-8 max-w-xl text-muted-foreground">
            ALOX designs fewer things, more carefully. Each piece begins with a question: what can be removed? What remains is
            proportion, material and use.
          </p>
        </Reveal>
      </section>

      <section className="container-lux grid items-center gap-10 pb-24 md:grid-cols-12 md:pb-36">
        <Reveal className="md:col-span-5 md:col-start-2">
          <img src={products[0].images[0]} alt="Signature Bag in grained calfskin" loading="lazy" className="aspect-[4/5] w-full object-cover" />
        </Reveal>
        <Reveal className="md:col-span-4 md:col-start-8" delay={120}>
          <p className="eyebrow text-gold">Our Materials</p>
          <h2 className="display mt-4 text-4xl md:text-5xl">Chosen for how they age.</h2>
          <p className="mt-6 text-muted-foreground">
            Full-grain calfskin from family tanneries, solid brass hardware and hand-polished acetate. Materials that soften,
            deepen and record a life of use.
          </p>
        </Reveal>
      </section>

      <section className="bg-ink text-primary-foreground">
        <div className="container-lux grid items-center gap-10 py-24 md:grid-cols-12 md:py-36">
          <Reveal className="md:col-span-4 md:order-1">
            <p className="eyebrow text-gold">Our Craft</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">By hand, by eye.</h2>
            <p className="mt-6 opacity-70">
              Edges painted in seven layers. Saddle-stitched seams. Each piece passes through the hands of a single artisan
              from cutting to finish.
            </p>
          </Reveal>
          <Reveal className="md:col-span-7 md:col-start-6 md:order-2" delay={120}>
            <img src={editorial.craft} alt="Artisan stitching leather" loading="lazy" className="aspect-[4/5] w-full object-cover md:aspect-[5/4]" />
          </Reveal>
        </div>
      </section>

      <section className="container-lux grid gap-10 py-24 md:grid-cols-12 md:py-36">
        <p className="eyebrow text-gold md:col-span-3">Our Approach</p>
        <Reveal className="md:col-span-8">
          <h2 className="display text-4xl md:text-6xl">Seasonless by design.</h2>
          <div className="mt-10 grid gap-8 text-muted-foreground sm:grid-cols-2">
            <p>We release small collections when they are ready, not when a calendar demands. Nothing is designed to expire.</p>
            <p>Every ALOX piece can be returned to us for repair, so that what you buy once, you keep.</p>
          </div>
          <Link to="/story" className="btn-outline mt-12">Read our story</Link>
        </Reveal>
      </section>
    </>
  );
}
