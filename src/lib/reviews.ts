export type OutfitReview = { id: string; look: string; name: string; rating: number; text: string; fit: "Small" | "True to size" | "Large"; date: string };
export const REVIEW_KEY = "alox-outfit-reviews-v1";

export function readReviews(raw: string | null): OutfitReview[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((r): r is OutfitReview => typeof r === "object" && r !== null && typeof r.id === "string" && typeof r.look === "string" && typeof r.name === "string" && r.name.length <= 60 && typeof r.text === "string" && r.text.length <= 1000 && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 && ["Small", "True to size", "Large"].includes(r.fit) && typeof r.date === "string" && Number.isFinite(Date.parse(r.date)));
  } catch { return []; }
}