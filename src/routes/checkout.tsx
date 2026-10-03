import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatPrice, getProduct } from "@/lib/products";
import { shippingFor, useStore } from "@/lib/store";
import { OrderSummary } from "@/components/site/OrderSummary";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ALOX" },
      { name: "description", content: "Secure, simple checkout for your ALOX order (portfolio demo)." },
      { property: "og:title", content: "Checkout — ALOX" },
      { property: "og:description", content: "Checkout for your ALOX order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const steps = ["Information", "Delivery", "Payment", "Confirmation"];
const deliveries = [
  { id: "standard", label: "Standard", note: "3–5 working days", price: 0 },
  { id: "express", label: "Express", note: "1–2 working days", price: 20 },
  { id: "atelier", label: "Atelier collection", note: "Collect in Marylebone", price: 0 },
];

type Info = { name: string; email: string; phone: string; address: string; city: string; country: string };

function Checkout() {
  const { cart, subtotal, clear } = useStore();
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<Info>({ name: "", email: "", phone: "", address: "", city: "", country: "United Kingdom" });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [delivery, setDelivery] = useState("standard");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", holder: "" });
  const [order, setOrder] = useState<{ id: string; total: number; items: number } | null>(null);

  const deliveryPrice = deliveries.find((d) => d.id === delivery)!.price;
  const shipping = shippingFor(subtotal) + deliveryPrice;

  if (cart.length === 0 && !order) {
    return (
      <section className="container-lux pb-36 pt-44">
        <h1 className="display text-5xl md:text-7xl">Checkout</h1>
        <p className="mt-10 font-serif text-3xl">Your bag is empty.</p>
        <Link to="/shop" className="btn-solid mt-10">Explore Collection</Link>
      </section>
    );
  }

  const validateInfo = () => {
    const e: Partial<Record<string, string>> = {};
    if (!info.name.trim()) e.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(info.email)) e.email = "Enter a valid email";
    if (info.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone";
    if (!info.address.trim()) e.address = "Required";
    if (!info.city.trim()) e.city = "Required";
    if (!info.country.trim()) e.country = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const validateCard = () => {
    const e: Partial<Record<string, string>> = {};
    if (card.number.replace(/\s/g, "").length !== 16) e.number = "Enter 16 digits";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = "3–4 digits";
    if (!card.holder.trim()) e.holder = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 0 && !validateInfo()) return;
    if (step === 2) {
      if (!validateCard()) return;
      setOrder({ id: `ALX-${Math.floor(100000 + Math.random() * 900000)}`, total: subtotal + shipping, items: cart.reduce((a, l) => a + l.qty, 0) });
      clear();
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const input = (k: string, label: string, value: string, onChange: (v: string) => void, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field" aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <section className="container-lux pb-24 pt-28 md:pb-36 md:pt-40">
      <h1 className="display text-5xl md:text-7xl">Checkout</h1>

      <ol className="mt-12 grid grid-cols-4 border-t">
        {steps.map((s, i) => (
          <li key={s} className={cn("border-t-2 pt-4 transition-colors -mt-px", i <= step ? "border-ink" : "border-transparent text-muted-foreground")}>
            <span className="font-serif text-lg text-gold">0{i + 1}</span>
            <span className="eyebrow mt-1 hidden sm:block">{s}</span>
          </li>
        ))}
      </ol>

      {step === 3 && order ? (
        <div className="animate-rise mx-auto max-w-2xl py-24 text-center">
          <p className="eyebrow text-gold">Order {order.id}</p>
          <h2 className="display mt-6 text-5xl md:text-6xl">Thank you, {info.name.split(" ")[0]}.</h2>
          <p className="mt-6 text-muted-foreground">
            Your order of {order.items} {order.items === 1 ? "piece" : "pieces"} totalling {formatPrice(order.total)} is confirmed.
            A confirmation would be sent to {info.email}.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">Portfolio demo — no payment was taken and no order was placed.</p>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/shop" className="btn-solid">Continue Shopping</Link>
            <Link to="/account" className="btn-outline">View Account</Link>
          </div>
        </div>
      ) : (
        <div className="mt-14 grid gap-16 lg:grid-cols-12">
          <div className="animate-fade lg:col-span-7" key={step}>
            {step === 0 && (
              <div className="space-y-8">
                <h2 className="display text-3xl">Contact & address</h2>
                <div className="grid gap-8 sm:grid-cols-2">
                  {input("name", "Full name", info.name, (v) => setInfo({ ...info, name: v }), { autoComplete: "name" })}
                  {input("email", "Email", info.email, (v) => setInfo({ ...info, email: v }), { type: "email", autoComplete: "email" })}
                </div>
                {input("phone", "Phone", info.phone, (v) => setInfo({ ...info, phone: v }), { type: "tel", autoComplete: "tel" })}
                {input("address", "Address", info.address, (v) => setInfo({ ...info, address: v }), { autoComplete: "street-address" })}
                <div className="grid gap-8 sm:grid-cols-2">
                  {input("city", "City", info.city, (v) => setInfo({ ...info, city: v }), { autoComplete: "address-level2" })}
                  {input("country", "Country", info.country, (v) => setInfo({ ...info, country: v }), { autoComplete: "country-name" })}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="display text-3xl">Delivery method</h2>
                <div className="mt-8 divide-y border-y">
                  {deliveries.map((d) => (
                    <label key={d.id} className="flex cursor-pointer items-center justify-between gap-4 py-6">
                      <span className="flex items-center gap-4">
                        <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} className="h-4 w-4 accent-[var(--ink)]" />
                        <span><span className="block">{d.label}</span><span className="text-sm text-muted-foreground">{d.note}</span></span>
                      </span>
                      <span className="text-sm tabular-nums">{d.price ? formatPrice(d.price) : "Complimentary"}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-6 text-sm text-muted-foreground">Delivering to {info.address}, {info.city}, {info.country}.</p>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-8">
                <div className="flex items-baseline justify-between">
                  <h2 className="display text-3xl">Payment</h2>
                  <span className="eyebrow text-gold">Demo mode</span>
                </div>
                <p className="border-l-2 border-gold pl-4 text-sm text-muted-foreground">
                  This is a portfolio demonstration. No real payment is processed — use any 16 digits, e.g. 4242 4242 4242 4242.
                </p>
                {input("number", "Card number", card.number, (v) => setCard({ ...card, number: v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() }), { inputMode: "numeric", placeholder: "0000 0000 0000 0000" })}
                <div className="grid grid-cols-2 gap-8">
                  {input("expiry", "Expiry", card.expiry, (v) => { const d = v.replace(/\D/g, "").slice(0, 4); setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }); }, { placeholder: "MM/YY", inputMode: "numeric" })}
                  {input("cvc", "CVC", card.cvc, (v) => setCard({ ...card, cvc: v.replace(/\D/g, "").slice(0, 4) }), { placeholder: "123", inputMode: "numeric" })}
                </div>
                {input("holder", "Name on card", card.holder, (v) => setCard({ ...card, holder: v }))}
              </div>
            )}
            <div className="mt-12 flex items-center justify-between gap-4">
              {step > 0 ? <button onClick={() => setStep((s) => s - 1)} className="eyebrow link-line">Back</button> : <Link to="/cart" className="eyebrow link-line">Return to bag</Link>}
              <button onClick={next} className="btn-solid">{step === 2 ? `Place Order · ${formatPrice(subtotal + shipping)}` : "Continue"}</button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <ul className="mb-6 space-y-4">
              {cart.map((l) => {
                const p = getProduct(l.slug)!;
                return (
                  <li key={l.slug + l.option} className="grid grid-cols-[56px_1fr_auto] items-center gap-4 text-sm">
                    <img src={p.images[0]} alt="" className="aspect-[4/5] w-14 object-cover" />
                    <span className="min-w-0"><span className="block truncate">{p.name}</span><span className="text-muted-foreground">{l.option} × {l.qty}</span></span>
                    <span className="tabular-nums">{formatPrice(p.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <OrderSummary subtotal={subtotal} shipping={shipping} />
          </div>
        </div>
      )}
    </section>
  );
}
