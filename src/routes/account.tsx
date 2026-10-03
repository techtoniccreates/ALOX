import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

const tabs = ["overview", "orders", "wishlist", "profile", "addresses", "settings"] as const;
type Tab = (typeof tabs)[number];

export const Route = createFileRoute("/account")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab | undefined } => ({
    tab: tabs.includes(s["tab"] as Tab) ? (s["tab"] as Tab) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your Account — ALOX" },
      { name: "description", content: "Manage your ALOX orders, wishlist, profile and addresses." },
      { property: "og:title", content: "Your Account — ALOX" },
      { property: "og:description", content: "Manage your ALOX orders, wishlist and profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

const orders = [
  { id: "ALX-482193", date: "12 Sep 2026", status: "Delivered", items: [products[2]!], total: 285 },
  { id: "ALX-371046", date: "28 Jun 2026", status: "Delivered", items: [products[5]!, products[6]!], total: 600 },
];

function Account() {
  const { tab = "overview" } = Route.useSearch();
  const navigate = useNavigate({ from: "/account" });
  const { wishlist } = useStore();
  const wished = products.filter((p) => wishlist.includes(p.slug));

  return (
    <section className="container-lux pb-24 pt-32 md:pb-36 md:pt-44">
      <p className="eyebrow text-gold">Demo member account</p>
      <h1 className="display mt-4 text-5xl md:text-7xl">Good evening, Amara.</h1>

      <div className="mt-14 grid gap-12 md:grid-cols-12">
        <nav className="-mx-1 flex gap-6 overflow-x-auto border-b px-1 pb-4 md:col-span-3 md:mx-0 md:flex-col md:gap-4 md:border-b-0 md:border-r md:px-0">
          {tabs.map((t) => (
            <button key={t} onClick={() => navigate({ search: { tab: t } })}
              className={cn("eyebrow shrink-0 text-left transition-colors", tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {tab === t && <span className="mr-2 text-gold">—</span>}{t}
            </button>
          ))}
        </nav>

        <div className="animate-fade md:col-span-9" key={tab}>
          {tab === "overview" && (
            <div className="grid gap-px bg-border sm:grid-cols-3">
              {[["Orders", orders.length, "orders"], ["Wishlist", wished.length, "wishlist"], ["Member since", "2024", "profile"]].map(([k, v, t]) => (
                <button key={k as string} onClick={() => navigate({ search: { tab: t as Tab } })} className="bg-background p-8 text-left hover:bg-ivory">
                  <p className="eyebrow text-muted-foreground">{k}</p>
                  <p className="display mt-4 text-5xl">{v}</p>
                </button>
              ))}
            </div>
          )}
          {tab === "orders" && (
            <ul className="divide-y border-y">
              {orders.map((o) => (
                <li key={o.id} className="grid gap-4 py-8 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-center gap-4">
                    {o.items.map((p) => <img key={p.slug} src={p.images[0]} alt={p.name} className="aspect-[4/5] w-16 object-cover" />)}
                    <div className="min-w-0">
                      <p className="eyebrow">{o.id}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{o.date} · {o.items.map((p) => p.name).join(", ")}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="tabular-nums">{formatPrice(o.total)}</p>
                    <p className="eyebrow mt-1 text-gold">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {tab === "wishlist" &&
            (wished.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-3">
                {wished.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            ) : (
              <div>
                <p className="font-serif text-3xl">Your wishlist is empty.</p>
                <p className="mt-3 text-muted-foreground">Tap the heart on any piece to save it here.</p>
                <Link to="/shop" className="btn-outline mt-8">Explore Collection</Link>
              </div>
            ))}
          {tab === "profile" && <ProfileForm />}
          {tab === "addresses" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border p-8">
                <p className="eyebrow text-gold">Default</p>
                <p className="mt-4 leading-relaxed">Amara Okafor<br />14 Wimpole Street<br />London W1G 9SX<br />United Kingdom</p>
              </div>
              <div className="flex items-center justify-center border border-dashed p-8 text-muted-foreground">
                <span className="eyebrow">Add address (demo)</span>
              </div>
            </div>
          )}
          {tab === "settings" && <Settings />}
        </div>
      </div>
    </section>
  );
}

function ProfileForm() {
  const [saved, setSaved] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSaved(true); }} className="max-w-xl space-y-8">
      {[["Full name", "Amara Okafor"], ["Email", "amara@example.com"], ["Phone", "+44 7700 900000"]].map(([l, v]) => (
        <label key={l} className="block">
          <span className="eyebrow text-muted-foreground">{l}</span>
          <input defaultValue={v} onChange={() => setSaved(false)} className="field" />
        </label>
      ))}
      <div className="flex items-center gap-6">
        <button className="btn-solid">Save Changes</button>
        {saved && <span className="eyebrow animate-fade text-gold">Saved</span>}
      </div>
    </form>
  );
}

function Settings() {
  const [prefs, setPrefs] = useState({ news: true, previews: true, sms: false });
  const rows: [keyof typeof prefs, string][] = [["news", "Newsletter"], ["previews", "Private collection previews"], ["sms", "SMS order updates"]];
  return (
    <ul className="max-w-xl divide-y border-y">
      {rows.map(([k, l]) => (
        <li key={k} className="flex items-center justify-between py-6">
          <span>{l}</span>
          <button role="switch" aria-checked={prefs[k]} onClick={() => setPrefs({ ...prefs, [k]: !prefs[k] })}
            className={cn("relative h-5 w-10 border transition-colors", prefs[k] ? "border-ink bg-ink" : "border-input")}>
            <span className={cn("absolute top-0.5 h-3.5 w-3.5 transition-all", prefs[k] ? "left-5 bg-gold" : "left-0.5 bg-stone")} />
          </button>
        </li>
      ))}
    </ul>
  );
}
