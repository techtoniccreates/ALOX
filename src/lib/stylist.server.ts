import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, streamText } from "ai";
import { formatPrice, products } from "./products";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export type StylistInput = { style: string; occasion: string; budget: string };
export type StylistResult =
  | { ok: true; intro: string; picks: { slug: string; reason: string }[] }
  | { ok: false; error: string };

function runIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
    const res = await fetch(input, { ...init, headers });
    runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
    return res;
  };
}

export async function recommend(input: StylistInput): Promise<StylistResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return { ok: false, error: "The stylist is not configured yet." };

  const catalog = products
    .map((p) => `- slug: ${p.slug} | ${p.name} | ${p.category} | ${formatPrice(p.price)} | ${p.descriptor}. ${p.material}`)
    .join("\n");

  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch(),
  });

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      system:
        "You are the ALOX personal stylist: a restrained, editorial luxury voice (British English, no exclamation marks, no emojis). " +
        "Recommend ONLY products from the catalogue below, referenced by exact slug. Choose 2 to 4 pieces that work together and respect the budget " +
        "(total of picks should stay within it where possible). Reply with JSON only, no markdown: " +
        '{"intro": "one or two sentences addressed to the client", "picks": [{"slug": "...", "reason": "one sentence on why it suits them"}]}\n\nCatalogue:\n' +
        catalog,
      prompt: `Style: ${input.style || "not specified"}\nOccasion: ${input.occasion || "not specified"}\nBudget: ${input.budget || "no limit"}`,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const text = await result.text;
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    const valid = new Set(products.map((p) => p.slug));
    const picks = (Array.isArray(json.picks) ? json.picks : [])
      .filter((p: { slug?: unknown }) => typeof p?.slug === "string" && valid.has(p.slug))
      .slice(0, 4)
      .map((p: { slug: string; reason?: unknown }) => ({ slug: p.slug, reason: String(p.reason ?? "") }));
    if (!picks.length) return { ok: false, error: "The stylist couldn't find a match. Try describing your style differently." };
    return { ok: true, intro: String(json.intro ?? ""), picks };
  } catch (e) {
    const status = APICallError.isInstance(e) ? e.statusCode : undefined;
    if (status === 429) return { ok: false, error: "The stylist is busy right now. Please try again in a moment." };
    if (status === 402) return { ok: false, error: "AI credits have run out for this workspace. Add credits in workspace billing settings." };
    if (status === 403) return { ok: false, error: "AI access is currently disabled for this workspace." };
    console.error("stylist error", e);
    return { ok: false, error: "The stylist is unavailable at the moment. Please try again." };
  }
}
