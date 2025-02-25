import { z } from "zod";

const stringSchema = z.string().trim().min(1).max(255);

export const moduleSchema = z.object({
  name: stringSchema,
  type: stringSchema,
  slug: stringSchema,
  isActive: z.boolean(),
});
