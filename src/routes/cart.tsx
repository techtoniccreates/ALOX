import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { formatPrice, getProduct } from "@/lib/products";
import { shippingFor, SHIPPING_THRESHOLD, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — ALOX" },
      { name: "description", content: "Review the pieces in your ALOX bag." },
      { property: "og:title", content: "Your Bag — ALOX" },
      { property: "og:description", content: "Review the pieces in your ALOX bag." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty, remove, subtotal } = useStore();
  const shipping = shippingFor(subtotal);

  return (
    <section className="container-lux pb-24 pt-32 md:pb-36 md:pt-44">
      <h1 className="display text-5xl md:text-7xl">Your Bag</h1>
      {cart.length === 0 ? (
        <div className="mt-16 border-t pt-16">
          <p className="font-serif text-3xl">Your bag is empty.</p>
          <Link to="/shop" className="btn-solid mt-10">Explore Collection</Link>
        </div>
      ) : (
        <div className="mt-14 grid gap-16 lg:grid-cols-12">
          <ul className="divide-y border-y lg:col-span-8">
            {cart.map((l) => {
              const p = getProduct(l.slug);
              if (!p) return null;
              return (
                <li key={l.slug + l.option} className="grid grid-cols-[96px_1fr] gap-5 py-8 sm:grid-cols-[140px_1fr] sm:gap-8">
                  <Link to="/product/$slug" params={{ slug: p.slug }} className="bg-ivory">
                    <img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-serif text-2xl leading-tight">{p.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{p.options.label}: {l.option}</p>
                      </div>
                      <p className="shrink-0 tabular-nums">{formatPrice(p.price * l.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div className="flex items-center border">
                        <button onClick={() => setQty(l.slug, l.option, l.qty - 1)} className="p-3" aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm tabular-nums">{l.qty}</span>
                        <button onClick={() => setQty(l.slug, l.option, l.qty + 1)} className="p-3" aria-label="Increase quantity"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => remove(l.slug, l.option)} className="eyebrow link-line text-muted-foreground">Remove</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <OrderSummary subtotal={subtotal} shipping={shipping}>
            <Link to="/checkout" className="btn-solid mt-8 w-full">Proceed to Checkout</Link>
            <Link to="/shop" className="eyebrow link-line mt-6 inline-block text-muted-foreground">Continue shopping</Link>
          </OrderSummary>
        </div>
      )}
    </section>
  );
}

export function OrderSummary({ subtotal, shipping, children }: { subtotal: number; shipping: number; children?: React.ReactNode }) {
  return (
    <aside className="self-start bg-ivory p-8 lg:sticky lg:top-28 lg:col-span-4">
      <h2 className="eyebrow">Order Summary</h2>
      <dl className="mt-8 space-y-4 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Shipping</dt><dd className="tabular-nums">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd></div>
        <div className="flex justify-between border-t border-ink/15 pt-4 text-base"><dt>Total</dt><dd className="tabular-nums">{formatPrice(subtotal + shipping)}</dd></div>
      </dl>
      {shipping > 0 && <p className="mt-4 text-xs text-muted-foreground">Complimentary shipping on orders over {formatPrice(SHIPPING_THRESHOLD)}.</p>}
      {children}
    </aside>
  );
}
