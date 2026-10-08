import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REVIEW_KEY, readReviews, type OutfitReview } from "@/lib/reviews";
import { cn } from "@/lib/utils";

export function OutfitReviews({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<OutfitReview[]>([]);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [fit, setFit] = useState<OutfitReview["fit"]>("True to size");
  const [sort, setSort] = useState("newest");
  const [status, setStatus] = useState("");
  useEffect(() => {
    const load = () => { try { setReviews(readReviews(localStorage.getItem(REVIEW_KEY)).filter((r) => r.look === slug)); } catch { setReviews([]); } };
    load(); window.addEventListener("storage", load); return () => window.removeEventListener("storage", load);
  }, [slug]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating || !name.trim() || text.trim().length < 10) { setStatus("Choose a rating, add your name and write at least 10 characters."); return; }
    try {
      const review: OutfitReview = { id: crypto.randomUUID(), look: slug, name: name.trim(), rating, text: text.trim(), fit, date: new Date().toISOString() };
      const all = readReviews(localStorage.getItem(REVIEW_KEY));
      localStorage.setItem(REVIEW_KEY, JSON.stringify([review, ...all]));
      setReviews([review, ...all.filter((r) => r.look === slug)]); setOpen(false); setRating(0); setName(""); setText(""); setStatus("Your review was saved in this browser.");
    } catch { setStatus("This browser could not save your review. Please allow local storage and try again."); }
  };
  const average = reviews.length ? (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length).toFixed(1) : null;
  const sorted = [...reviews].sort((a, b) => sort === "highest" ? b.rating - a.rating : sort === "lowest" ? a.rating - b.rating : Date.parse(b.date) - Date.parse(a.date));
  return (
    <section className="container-lux border-t py-20 md:py-28" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow text-gold">The fitting room</p><h2 id="reviews-title" className="display mt-4 text-4xl md:text-5xl">Outfit reviews</h2><p className="mt-4 text-sm text-muted-foreground">{average ? `${average} / 5 · ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}` : "No reviews yet"}</p></div><Button variant="luxury" size="natural" onClick={() => { setOpen(!open); setStatus(""); }}>{open ? "Cancel review" : "Write a review"}</Button></div>
      <p className="mt-5 text-xs text-muted-foreground">Portfolio demo · Reviews are saved only in this browser, not shared publicly.</p>
      {open && <form onSubmit={submit} className="mt-10 max-w-xl space-y-6" noValidate>
        <fieldset><legend className="eyebrow mb-3">Your rating</legend><div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <Button key={n} type="button" variant="editorial" size="icon" aria-label={`${n} ${n === 1 ? "star" : "stars"}`} aria-pressed={rating === n} onClick={() => setRating(n)}><Star className={cn("size-5", n <= rating ? "fill-gold text-gold" : "text-muted-foreground")} /></Button>)}</div></fieldset>
        <label className="block text-sm">Name<input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required autoComplete="name" /></label>
        <label className="block text-sm">Your review<textarea className="field min-h-28 resize-y" value={text} onChange={(e) => setText(e.target.value)} minLength={10} maxLength={1000} required /></label>
        <fieldset><legend className="eyebrow mb-3">Overall fit</legend><div className="flex flex-wrap gap-3">{(["Small", "True to size", "Large"] as const).map((f) => <label key={f} className="flex items-center gap-2 text-sm"><input type="radio" name="review-fit" checked={fit === f} onChange={() => setFit(f)} className="accent-primary" />{f}</label>)}</div></fieldset>
        <Button variant="luxury" size="natural" type="submit">Submit review</Button>
      </form>}
      {status && <p role="status" className="mt-5 text-sm">{status}</p>}
      {reviews.length > 0 ? <><div className="mt-10 flex justify-end"><label className="flex items-center gap-3 text-sm">Sort reviews<select className="border bg-background p-2" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest first</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option></select></label></div><div className="mt-5 divide-y border-t">{sorted.map((r) => <article key={r.id} className="grid gap-4 py-8 md:grid-cols-[220px_1fr]"><div><p className="break-words">{r.name}</p><time dateTime={r.date} className="mt-2 block text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time></div><div><div className="flex gap-1 text-gold" aria-label={`${r.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} aria-hidden className={cn("size-3", n <= r.rating && "fill-current")} />)}</div><p className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-sm leading-relaxed">{r.text}</p><p className="mt-3 text-xs text-muted-foreground">Fit · {r.fit}</p></div></article>)}</div></> : <p className="mt-10 border-t pt-8 font-serif text-2xl">Be the first to share your impression.</p>}
    </section>
  );
}