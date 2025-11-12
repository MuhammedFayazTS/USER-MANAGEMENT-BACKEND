import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  countryId: z.number().optional(),
});
