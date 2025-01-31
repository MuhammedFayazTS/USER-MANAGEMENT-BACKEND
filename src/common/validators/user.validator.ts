import { z } from "zod";
import { emailSchema } from "./auth.validator";

export const newUserSchema = z.object({
  firstName: z.string().trim().min(1).max(255),
  lastName: z.string().trim().min(1).max(255),
  email: emailSchema,
  roleId: z.number(),
});
