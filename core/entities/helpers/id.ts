import { z } from "zod";
import { type ValidationErrorFields } from "@core/entities/wrappers/validation";

export const idSchema = z.object({
  id: z.number().int().min(1),
});

export type ID = z.infer<typeof idSchema>;
export type IDValidationField = ValidationErrorFields<typeof idSchema>;
