import { z } from "zod";
import { emailSchema } from "./auth.validator";

const string255 = z.string().trim().max(255);
const optionalString255 = string255.optional();

export const branchSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, "Name is required").max(255),
  countryId: z.number(),
  image: optionalString255,
  address: optionalString255,
  city: optionalString255,
  state: optionalString255,
  postalCode: optionalString255,
  phone: optionalString255,
  email: emailSchema.optional()
});
