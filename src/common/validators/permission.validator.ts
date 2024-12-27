import { z } from "zod";

const nameSchema = z.string().trim().min(1).max(255);
const descriptionSchema = z.string().trim().max(255).optional();

export const permissionSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});
