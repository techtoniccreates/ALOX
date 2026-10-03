export function PageHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <section className="container-lux pb-12 pt-32 md:pb-20 md:pt-44">
      {eyebrow && <p className="eyebrow animate-fade text-gold">{eyebrow}</p>}
      <h1 className="display animate-rise mt-5 text-5xl md:text-7xl lg:text-8xl">{title}</h1>
      {sub && <p className="animate-rise mt-6 max-w-lg text-muted-foreground [animation-delay:150ms]">{sub}</p>}
    </section>
  );
}
