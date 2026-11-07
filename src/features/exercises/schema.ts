import { z } from "zod";
export const responseSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("mcq"), choice: z.number().int().min(0).max(20) }),
  z.object({ type: z.literal("fill"), choice: z.number().int().min(0).max(20) }),
  z.object({ type: z.literal("listen"), choice: z.number().int().min(0).max(20) }),
  z.object({ type: z.literal("match"), pairs: z.array(z.tuple([z.string().max(100), z.string().max(100)])).max(12) }),
  z.object({ type: z.literal("build"), tokens: z.array(z.string().max(100)).max(30) }),
  z.object({ type: z.literal("translate"), text: z.string().max(300) }),
]);
