import { z } from "zod";

export const roomTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  branchId: z.number(),
  price: z.number(),
  description: z.string().optional(),
});
