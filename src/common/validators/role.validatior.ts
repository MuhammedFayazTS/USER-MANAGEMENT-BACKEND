import { z } from "zod";

const nameSchema = z.string().trim().min(6).max(255);
const descriptionSchema = z.string().trim().min(6).max(255);

export const roleSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export const rolePermissionSchema = z.object({
  permissions: z.array(z.number()),
});
