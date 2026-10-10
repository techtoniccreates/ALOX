const KEY = "alox-recent-v1";

export function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string").slice(0, 8) : [];
  } catch { return []; }
}

export function pushRecent(slug: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([slug, ...readRecent().filter((s) => s !== slug)].slice(0, 8)));
  } catch {}
}
