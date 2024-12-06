import { z } from "zod";

export const verifyMFASchema = z.object({
  code: z.string().trim().min(1).max(6),
  secretKey: z.string().trim().min(1),
});
