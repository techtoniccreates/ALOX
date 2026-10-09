import { describe, expect, it } from "vitest";
import { getProduct } from "@/lib/products";
import { needsSize, sizeReference } from "@/lib/sizing";
import { readReviews } from "@/lib/reviews";

describe("Sizing", () => {
  it("requires explicit clothing and footwear sizes, not fragrance volume", () => {
    const blazer = getProduct("structured-black-blazer");
    const fragrance = getProduct("signature-fragrance");
    if (!blazer || !fragrance) throw new Error("Missing catalogue fixtures");
    expect(needsSize(blazer)).toBe(true); expect(needsSize(fragrance)).toBe(false);
    expect(sizeReference(blazer, "cm").rows).toHaveLength(blazer.options.values.length);
  });
  it("converts waist measurements between units", () => {
    const product = getProduct("tailored-black-trousers");
    if (!product) throw new Error("Missing trousers");
    expect(sizeReference(product, "in").rows[0]).toEqual(["28", "28.0"]);
  });
});
describe("Reviews", () => {
  it("handles malformed storage and excludes invalid ratings", () => {
    expect(readReviews("broken")).toEqual([]); expect(readReviews('{}')).toEqual([]);
    const valid = { id: "1", look: "the-evening-edit", name: "Guest", text: "A thoughtful outfit", rating: 4, fit: "True to size", date: "2026-10-08T12:00:00Z" };
    expect(readReviews(JSON.stringify([valid, { ...valid, rating: 9 }, null]))).toEqual([valid]);
  });
});