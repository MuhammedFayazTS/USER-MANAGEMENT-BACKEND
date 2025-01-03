import { z } from "zod";

const nameSchema = z.string().trim().min(1, "Name is required").max(255);
const descriptionSchema = z.string().trim().min(1).max(255).optional();
const permissionsSchema =  z
.array(z.unknown()) // permissions as an array of unknown objects
.optional()

export const roleSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  permissions:permissionsSchema
});

export const rolePermissionSchema = z.object({
  permissions: z.array(z.number()),
});
