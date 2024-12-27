import { z } from "zod";

const nameSchema = z.string().trim().min(1, "Name is required").max(255);
const descriptionSchema = z.string().trim().min(1).max(255).optional();

export const roleSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export const rolePermissionSchema = z.object({
  permissions: z.array(z.number()),
});
