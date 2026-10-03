import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Wordmark } from "./Logo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/shop", label: "Collection" },
  { to: "/about", label: "About" },
  { to: "/story", label: "Our Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const overHero = path === "/" && !scrolled && !open && !searching;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); setSearching(false); }, [path]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop", search: q.trim() ? { q: q.trim() } : {} });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        overHero ? "text-primary-foreground" : "border-b bg-background text-foreground",
      )}
    >
      <div className="container-lux grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow link-line" activeProps={{ className: "text-gold" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="justify-self-start lg:hidden" aria-label="Open menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-5 w-5" strokeWidth={1.25} /> : <Menu className="h-5 w-5" strokeWidth={1.25} />}
        </button>

        <Link to="/" aria-label="ALOX home"><Wordmark /></Link>

        <div className="flex items-center justify-end gap-4 md:gap-6">
          <button aria-label="Search" onClick={() => setSearching((s) => !s)}>
            <Search className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </button>
          <Link to="/account" aria-label="Account" className="hidden sm:block">
            <User className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </Link>
          <Link to="/account" search={{ tab: "wishlist" }} aria-label="Wishlist" className="relative hidden sm:block">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.25} />
            {wishlist.length > 0 && <span className="absolute -right-1.5 -top-1 h-1.5 w-1.5 bg-gold" />}
          </Link>
          <Link to="/cart" aria-label={`Bag, ${count} items`} className="flex items-center gap-2">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} />
            <span className="eyebrow tabular-nums">{count}</span>
          </Link>
        </div>
      </div>

      {searching && (
        <form onSubmit={submit} className="animate-fade border-t bg-background text-foreground">
          <div className="container-lux flex items-center gap-4 py-5">
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.25} />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the collection"
              className="flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-stone"
            />
            <button className="eyebrow link-line">Search</button>
          </div>
        </form>
      )}

      {open && (
        <div className="animate-fade h-[calc(100dvh-4rem)] border-t bg-background text-foreground lg:hidden">
          <nav className="container-lux flex flex-col gap-6 pt-10">
            {[...nav, { to: "/account", label: "Account" }, { to: "/cart", label: "Bag" }].map((n) => (
              <Link key={n.to} to={n.to} className="font-serif text-4xl">{n.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
