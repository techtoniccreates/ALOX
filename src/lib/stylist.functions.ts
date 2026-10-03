import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  style: z.string().max(400),
  occasion: z.string().max(100),
  budget: z.string().max(50),
});

export const getRecommendations = createServerFn({ method: "POST" })
  .validator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const { recommend } = await import("./stylist.server");
    return recommend(data);
  });
