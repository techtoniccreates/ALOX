import type { Product } from "./products";

export const needsSize = (product: Product) => product.category === "Clothing" || product.category === "Footwear" || product.slug === "classic-leather-belt";

export function sizeReference(product: Product, unit: "cm" | "in") {
  const measurement = (cm: number) => unit === "cm" ? String(cm) : (cm / 2.54).toFixed(1);
  if (product.category === "Footwear") {
    return { heading: `Foot length (${unit})`, rows: product.options.values.map((size, i) => [size, measurement(24.5 + i * 0.7)]) };
  }
  if (product.options.label === "Waist") {
    return { heading: `Body waist (${unit})`, rows: product.options.values.map((size) => [size, measurement(Number(size) * 2.54)]) };
  }
  if (product.slug === "classic-leather-belt") {
    return { heading: `Belt length (${unit})`, rows: product.options.values.map((size) => [size, measurement(Number(size))]) };
  }
  return { heading: `Body chest (${unit})`, rows: product.options.values.map((size, i) => [size, `${measurement(84 + i * 8)}–${measurement(91 + i * 8)}`]) };
}