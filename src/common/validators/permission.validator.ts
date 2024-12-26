import { z } from "zod";

const nameSchema = z.string().trim().min(6).max(255);
const descriptionSchema = z.string().trim().min(6).max(255);

export const permissionSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});
