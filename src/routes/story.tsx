import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { editorial, products } from "@/lib/products";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "The Story of ALOX" },
      { name: "description", content: "From a single leather bag to a modern luxury house — the beginning, vision, evolution and future of ALOX." },
      { property: "og:title", content: "The Story of ALOX" },
      { property: "og:description", content: "The beginning, vision, evolution and future of ALOX." },
    ],
  }),
  component: Story,
});

const chapters = [
  { year: "2019", title: "The Beginning", img: editorial.craft, text: "ALOX began at a single workbench, with one bag and an obsession with proportion. Six months, forty prototypes, one final line." },
  { year: "2021", title: "The Vision", img: editorial.ed1, text: "A house built on restraint: objects that carry no logo but are recognisable by their form, their weight, their finish." },
  { year: "2024", title: "The Evolution", img: products[1].images[0], text: "From leather goods to timepieces and fragrance — each new category held to the same question: what can be removed?" },
  { year: "Next", title: "The Future", img: editorial.ed2, text: "Fewer, better collections. A lifetime repair programme. Materials traced from source to stitch." },
];

function Story() {
  return (
    <>
      <section className="relative flex h-[85svh] min-h-[560px] items-end overflow-hidden bg-ink text-primary-foreground">
        <img src={hero} alt="" width={1920} height={1088} className="animate-zoomout absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="container-lux relative pb-16 md:pb-24">
          <p className="eyebrow text-gold">Our Story</p>
          <h1 className="display animate-rise mt-6 text-6xl md:text-9xl">The Story<br />of ALOX</h1>
        </div>
      </section>

      <section className="container-lux py-24 md:py-36">
        <div className="relative space-y-24 md:space-y-40">
          <div className="absolute bottom-0 left-[7px] top-0 w-px bg-border md:left-1/2" aria-hidden />
          {chapters.map((c, i) => (
            <Reveal key={c.title}>
              <article className="relative grid gap-8 pl-10 md:grid-cols-2 md:gap-24 md:pl-0">
                <span className="absolute left-0 top-2 h-[15px] w-[15px] border border-gold bg-background md:left-1/2 md:-translate-x-1/2" aria-hidden />
                <div className={cn(i % 2 ? "md:order-2" : "md:text-right")}>
                  <p className="font-serif text-2xl text-gold">{c.year}</p>
                  <h2 className="display mt-3 text-4xl md:text-6xl">{c.title}</h2>
                  <p className={cn("mt-6 max-w-md text-muted-foreground", !(i % 2) && "md:ml-auto")}>{c.text}</p>
                </div>
                <img src={c.img} alt={c.title} loading="lazy" className={cn("aspect-[4/5] w-full max-w-md object-cover", i % 2 ? "md:order-1 md:ml-auto" : "")} />
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-32 text-center">
          <p className="display text-4xl md:text-5xl">The story continues with you.</p>
          <Link to="/shop" className="btn-solid mt-10">Explore Collection</Link>
        </div>
      </section>
    </>
  );
}
