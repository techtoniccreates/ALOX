import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatPrice, getProduct, products } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
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

type Order = { id: string; order_number: string; created_at: string; status: string; total: number; items: { slug: string; name: string; qty: number; option: string }[]; address: Record<string, string> };

function Account() {
  const { tab = "overview" } = Route.useSearch();
  const navigate = useNavigate({ from: "/account" });
  const nav = useNavigate();
  const { user, ready, signOut } = useAuth();
  const { wishlist } = useStore();
  const wished = products.filter((p) => wishlist.includes(p.slug));
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<{ full_name: string; phone: string }>({ full_name: "", phone: "" });

  useEffect(() => {
    if (ready && !user) nav({ to: "/auth", search: { redirect: "/account" }, replace: true });
  }, [ready, user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id, order_number, created_at, status, total, items, address").order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data ?? []) as unknown as Order[]));
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile({ full_name: data?.full_name ?? (user.user_metadata["full_name"] as string | undefined) ?? "", phone: data?.phone ?? "" }));
  }, [user]);

  if (!ready || !user) return <section className="container-lux pb-36 pt-44"><p className="eyebrow text-muted-foreground">Loading your account…</p></section>;

  const first = profile.full_name.split(" ")[0] || "there";
  const lastAddress = orders[0]?.address;
  const doSignOut = async () => { await signOut(); nav({ to: "/", replace: true }); };

  return (
    <section className="container-lux pb-24 pt-32 md:pb-36 md:pt-44">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-gold">Your account</p>
          <h1 className="display mt-4 text-5xl md:text-7xl">Welcome, {first}.</h1>
        </div>
        <button onClick={doSignOut} className="eyebrow link-line text-muted-foreground">Sign out</button>
      </div>

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
              {[["Orders", orders.length, "orders"], ["Wishlist", wished.length, "wishlist"], ["Member since", new Date(user.created_at).getFullYear(), "profile"]].map(([k, v, t]) => (
                <button key={k as string} onClick={() => navigate({ search: { tab: t as Tab } })} className="bg-background p-8 text-left hover:bg-ivory">
                  <p className="eyebrow text-muted-foreground">{k}</p>
                  <p className="display mt-4 text-5xl">{v}</p>
                </button>
              ))}
            </div>
          )}
          {tab === "orders" && (orders.length ? (
            <ul className="divide-y border-y">
              {orders.map((o) => (
                <li key={o.id} className="grid gap-4 py-8 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-center gap-4">
                    {o.items.slice(0, 4).map((it) => { const p = getProduct(it.slug); return p ? <img key={it.slug + it.option} src={p.images[0]} alt={it.name} className="aspect-[4/5] w-16 object-cover" /> : null; })}
                    <div className="min-w-0">
                      <p className="eyebrow">{o.order_number}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {o.items.map((i) => i.name).join(", ")}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="tabular-nums">{formatPrice(o.total)}</p>
                    <p className="eyebrow mt-1 text-gold">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div><p className="font-serif text-3xl">No orders yet.</p><Link to="/shop" className="btn-outline mt-8">Explore Collection</Link></div>
          ))}
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
          {tab === "profile" && <ProfileForm userId={user.id} email={user.email ?? ""} initial={profile} onSaved={setProfile} />}
          {tab === "addresses" && (
            lastAddress ? (
              <div className="max-w-sm border p-8">
                <p className="eyebrow text-gold">Last used</p>
                <p className="mt-4 leading-relaxed">{lastAddress["name"]}<br />{lastAddress["address"]}<br />{lastAddress["city"]}<br />{lastAddress["country"]}</p>
              </div>
            ) : <p className="text-muted-foreground">Your delivery address will appear here after your first order.</p>
          )}
          {tab === "settings" && <Settings />}
        </div>
      </div>
    </section>
  );
}

function ProfileForm({ userId, email, initial, onSaved }: { userId: string; email: string; initial: { full_name: string; phone: string }; onSaved: (p: { full_name: string; phone: string }) => void }) {
  const [f, setF] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("saving");
    const v = { full_name: f.full_name.trim().slice(0, 120), phone: f.phone.trim().slice(0, 40) };
    const { error } = await supabase.from("profiles").upsert({ id: userId, ...v, updated_at: new Date().toISOString() });
    if (error) setState("error"); else { setState("saved"); onSaved(v); }
  };
  return (
    <form onSubmit={save} className="max-w-xl space-y-8">
      <label className="block"><span className="eyebrow text-muted-foreground">Full name</span>
        <input value={f.full_name} onChange={(e) => { setF({ ...f, full_name: e.target.value }); setState("idle"); }} className="field" /></label>
      <label className="block"><span className="eyebrow text-muted-foreground">Email</span>
        <input value={email} disabled className="field opacity-60" /></label>
      <label className="block"><span className="eyebrow text-muted-foreground">Phone</span>
        <input type="tel" value={f.phone} onChange={(e) => { setF({ ...f, phone: e.target.value }); setState("idle"); }} className="field" /></label>
      <div className="flex items-center gap-6">
        <button disabled={state === "saving"} className="btn-solid">{state === "saving" ? "Saving…" : "Save Changes"}</button>
        {state === "saved" && <span className="eyebrow animate-fade text-gold">Saved</span>}
        {state === "error" && <span className="text-sm text-destructive">Couldn't save. Try again.</span>}
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
