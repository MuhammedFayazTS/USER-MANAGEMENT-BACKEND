import { z } from "zod";

const emailSchema = z.string().trim().email().min(1).max(255);
const passwordSchema = z.string().trim().min(6).max(255);
const verficationCodeSchema = z.string().trim().min(1).max(255);

export const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const verficationSchema = z.object({
  code: verficationCodeSchema,
});

export const resetPassword = z.object({
  password: passwordSchema,
  code: verficationCodeSchema,
});
