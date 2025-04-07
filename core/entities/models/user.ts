import { z } from "zod";
import { type ValidationErrorFields } from "@core/entities/wrappers/validation";
import { permissionSchema } from "@core/entities/models/permission";

export const userSchema = z.object({
  id: z.number().int(),
  user_leader: z.number().int().optional().nullable(),
  permissions: z.array(permissionSchema).optional().nullable(),
  email: z.string().email(),
  first_name: z.string().min(1).max(255),
  second_name: z.string().min(1).max(255),
  middle_name: z.string().max(255).optional().nullable(),
  dismiss_at: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional().nullable(),
  deleted_at: z.coerce.date().optional().nullable(),
});
export type User = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  position: z.number().int().positive(),
  company: z.number().int().positive(),
  group: z.number().int().positive(),
  user_leader: z.number().int().positive(),
  email: z.string().email(),
  first_name: z.string().min(1).max(255),
  second_name: z.string().min(1).max(255),
  middle_name: z.string().max(255).optional().nullable(),
  password: z.string().min(6).max(255),
});

export type CreateUser = z.infer<typeof createUserSchema>;
export type CreateUserValidationField = ValidationErrorFields<
  typeof createUserSchema
>;

export const updateUserSchema = z.object({
  id: z.number().int().positive(),
  position: z.number().int().positive(),
  company: z.number().int().positive(),
  group: z.number().int().positive(),
  user_leader: z.number().int().positive(),
  email: z.string().email(),
  first_name: z.string().min(1).max(255),
  second_name: z.string().min(1).max(255),
  middle_name: z.string().max(255).optional().nullable(),
  password: z.string().min(6).max(255),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UpdateUserValidationField = ValidationErrorFields<
  typeof updateUserSchema
>;

export const authSchema = z.object({
  email: z.string().email("Некорректный формат email"),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(255, "Пароль слишком длинный"),
});
export type AuthUser = z.infer<typeof authSchema>;
export type AuthUserValidationField = ValidationErrorFields<typeof authSchema>;

export const jwtSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
});

export type JWT = z.infer<typeof jwtSchema>;
