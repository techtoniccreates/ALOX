import { useState } from "react";
import { Ruler } from "lucide-react";
import type { Product } from "@/lib/products";
import { needsSize, sizeReference } from "@/lib/sizing";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SizeGuide({ product }: { product: Product }) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  if (!needsSize(product)) return null;
  const guide = sizeReference(product, unit);
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="editorial" size="natural" className="gap-2 p-0 text-xs font-normal underline underline-offset-4" aria-label={`Size guide for ${product.name}`}><Ruler />Size guide</Button></DialogTrigger>
      <DialogContent className="max-h-[85svh] w-[calc(100%-2rem)] overflow-y-auto data-[state=open]:animate-none data-[state=closed]:animate-none">
        <DialogTitle className="font-serif text-3xl font-normal tracking-normal">Size guide</DialogTitle>
        <DialogDescription>{product.name} · Illustrative sizing reference for this demo collection, not verified garment measurements.</DialogDescription>
        <div className="flex gap-2" aria-label="Measurement units">{(["cm", "in"] as const).map((u) => <Button key={u} variant="editorial" size="sm" aria-pressed={unit === u} onClick={() => setUnit(u)} className={unit === u ? "border border-ink bg-ink text-primary-foreground" : "border"}>{u === "cm" ? "Centimetres" : "Inches"}</Button>)}</div>
        <table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="py-3 font-normal">{product.options.label}</th><th className="py-3 font-normal">{guide.heading}</th></tr></thead><tbody>{guide.rows.map(([size, value]) => <tr key={size} className="border-b"><td className="py-3">{size}</td><td className="py-3 tabular-nums">{value}</td></tr>)}</tbody></table>
        <p className="text-sm text-muted-foreground">{product.category === "Footwear" ? "Measure from heel to longest toe while standing, using the longer foot." : product.options.label === "Waist" ? "Measure around your natural waist with the tape relaxed, not tight." : product.slug === "classic-leather-belt" ? "Measure an existing belt from the buckle pin to the hole you use." : "Measure around the fullest part of your chest with the tape level."} If between sizes, choose the larger size.</p>
      </DialogContent>
    </Dialog>
  );
}