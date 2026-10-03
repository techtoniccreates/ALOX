import type { ReactNode } from "react";
import { formatPrice } from "@/lib/products";
import { SHIPPING_THRESHOLD } from "@/lib/store";

export function OrderSummary({ subtotal, shipping, children }: { subtotal: number; shipping: number; children?: ReactNode }) {
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
