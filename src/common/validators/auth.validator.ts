import { z } from "zod";

export const emailSchema = z.string().trim().email().min(1).max(255);
const passwordSchema = z.string().trim().min(6).max(255);
const verficationCodeSchema = z.string().trim().min(1).max(255);

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1).max(255),
    lastName: z.string().trim().min(1).max(255),
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

export const verficationEmailSchema = z.object({
  code: verficationCodeSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verficationCodeSchema,
});

export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  })
  .refine((val) => val.password !== val.oldPassword, {
    message: "New password must not be same as old password",
    path: ["oldPassword"],
  });

export const googleAuthSchema = z.object({
  email: z.string().email(),
  firstName: z.string().regex(/^[a-zA-Z ]*$/),
  lastName: z.string().regex(/^[a-zA-Z ]*$/),
  image: z.string().optional(),
  externalUserId: z.string(),
  userAgent: z.string().optional(),
});
