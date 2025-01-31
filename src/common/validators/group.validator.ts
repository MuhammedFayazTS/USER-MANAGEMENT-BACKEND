import { z } from "zod";

// Schema for the group name
const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(255, "Name must be less than 255 characters");

// Schema for the group description (optional)
const descriptionSchema = z
  .string()
  .trim()
  .min(1, "Description must be at least 1 character long")
  .max(255, "Description must be less than 255 characters")
  .optional();

// Schema for roles associated with a group (optional)
const rolesSchema = z
  .array(z.unknown()) // roles as an array of unknown objects
  .optional();
const usersSchema = z
  .array(z.unknown()) // users as an array of unknown objects
  .optional();

// Schema for creating or updating a group
export const groupSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  roles: rolesSchema,
  users: usersSchema,
});

// Schema for adding or removing roles from a group
export const groupRoleSchema = z.object({
  roles: z.array(z.number(), {
    message: "Roles must be an array of role IDs",
  }),
});
