import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getRecommendations } from "@/lib/stylist.functions";
import { formatPrice, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stylist")({
  head: () => ({
    meta: [
      { title: "The ALOX Stylist — Personal Recommendations" },
      { name: "description", content: "Describe your style, occasion and budget, and the AI-powered ALOX stylist will curate pieces for you." },
      { property: "og:title", content: "The ALOX Stylist" },
      { property: "og:description", content: "Personal, AI-powered recommendations from the ALOX collection." },
    ],
  }),
  component: Stylist,
});

const styles = ["Minimal", "Classic", "Contemporary", "Bold", "Relaxed"];
const occasions = ["Work", "Evening", "Weekend", "Travel", "Special occasion", "Everyday"];
const budgets = ["Under £500", "£500 – £1,500", "£1,500 – £3,000", "No limit"];

type Result = Awaited<ReturnType<typeof getRecommendations>>;

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={cn("border px-4 py-2.5 text-sm transition-[color,background-color,border-color,transform] duration-300 active:scale-95", active ? "animate-pop border-ink bg-ink text-primary-foreground" : "hover:-translate-y-0.5 hover:border-ink")}>
      {children}
    </button>
  );
}

function Stylist() {
  const { add } = useStore();
  const [style, setStyle] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [addedAll, setAddedAll] = useState(false);

  const canSubmit = (style.length > 0 || notes.trim()) && occasion && budget && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true); setResult(null); setAddedAll(false);
    try {
      const r = await getRecommendations({ data: { style: [style.join(", "), notes.trim()].filter(Boolean).join(". "), occasion, budget } });
      setResult(r);
    } catch {
      setResult({ ok: false, error: "The stylist is unavailable at the moment. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const picks = result?.ok ? result.picks.map((p) => ({ ...p, product: getProduct(p.slug)! })) : [];
  const total = picks.reduce((a, p) => a + p.product.price, 0);

  return (
    <>
      <section className="container-lux pb-12 pt-32 md:pt-44">
        <p className="eyebrow text-gold">Personal Styling · AI-powered</p>
        <h1 className="display animate-rise mt-5 text-5xl md:text-8xl">The ALOX Stylist</h1>
        <p className="mt-6 max-w-lg text-muted-foreground">Tell us how you dress, where you're going and what you'd like to spend. We'll curate pieces from the collection for you.</p>
      </section>

      <form onSubmit={submit} className="container-lux grid gap-14 border-t py-14 md:grid-cols-3 md:gap-10">
        <fieldset>
          <legend className="eyebrow"><span className="mr-3 font-serif text-base text-gold">01</span>Your style</legend>
          <div className="mt-6 flex flex-wrap gap-2">
            {styles.map((s) => (
              <Chip key={s} active={style.includes(s)} onClick={() => setStyle((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]))}>{s}</Chip>
            ))}
          </div>
          <label className="mt-6 block">
            <span className="sr-only">Describe your style</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} placeholder="In your words — e.g. black tailoring, gold details" className="field" />
          </label>
        </fieldset>
        <fieldset>
          <legend className="eyebrow"><span className="mr-3 font-serif text-base text-gold">02</span>The occasion</legend>
          <div className="mt-6 flex flex-wrap gap-2">
            {occasions.map((o) => <Chip key={o} active={occasion === o} onClick={() => setOccasion(o)}>{o}</Chip>)}
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow"><span className="mr-3 font-serif text-base text-gold">03</span>Your budget</legend>
          <div className="mt-6 flex flex-wrap gap-2">
            {budgets.map((b) => <Chip key={b} active={budget === b} onClick={() => setBudget(b)}>{b}</Chip>)}
          </div>
        </fieldset>
        <div className="flex flex-col items-start gap-3 md:col-span-3">
          <button disabled={!canSubmit} className="btn-solid">{loading ? "Curating your edit…" : "Style Me"}</button>
          {!canSubmit && !loading && <p className="text-xs text-muted-foreground">Choose a style, an occasion and a budget to begin.</p>}
        </div>
      </form>

      <section className="container-lux pb-24 md:pb-36" aria-live="polite">
        {loading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 border-t pt-14 md:gap-x-8 lg:grid-cols-4">
            {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] animate-pulse bg-ivory" />)}
          </div>
        )}
        {result && !result.ok && <p className="border-l-2 border-gold pl-4 text-sm">{result.error}</p>}
        {result?.ok && (
          <div className="animate-fade border-t pt-14">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow text-gold">Your ALOX Edit</p>
                <p className="mt-5 font-serif text-2xl leading-snug md:text-3xl">{result.intro}</p>
              </div>
              <div className="shrink-0">
                <p className="eyebrow text-muted-foreground">Edit total · {formatPrice(total)}</p>
                <button onClick={() => { picks.forEach((p) => add(p.slug, p.product.options.values[0] ?? "")); setAddedAll(true); }} className="btn-outline mt-4">
                  {addedAll ? "Added to Bag ✓" : "Add Entire Edit to Bag"}
                </button>
              </div>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-8 lg:grid-cols-4">
              {picks.map((p, i) => (
                <div key={p.slug} className="animate-rise" style={{ animationDelay: `${200 + i * 180}ms` }}>
                  <ProductCard product={p.product} />
                  <p className="mt-3 border-t pt-3 text-sm italic text-muted-foreground">{p.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
