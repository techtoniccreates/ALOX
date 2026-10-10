import { useSyncExternalStore } from "react";

// Indicative display rates from GBP (demo). Checkout settles in GBP.
export const currencies = {
  GBP: { rate: 1, locale: "en-GB" },
  USD: { rate: 1.27, locale: "en-US" },
  EUR: { rate: 1.17, locale: "de-DE" },
  NGN: { rate: 2000, locale: "en-NG" },
} as const;
export type Currency = keyof typeof currencies;

const KEY = "alox-currency";
let current: Currency = "GBP";
const subs = new Set<() => void>();

export function getCurrency() { return current; }
export function setCurrency(c: Currency) {
  current = c;
  try { localStorage.setItem(KEY, c); } catch {}
  subs.forEach((f) => f());
}
export function loadCurrency() {
  try {
    const v = localStorage.getItem(KEY);
    if (v && v in currencies && v !== current) setCurrency(v as Currency);
  } catch {}
}
export function useCurrency() {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => current,
    () => "GBP" as Currency,
  );
}
