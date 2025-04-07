import { z } from "zod";
import { type ValidationErrorFields } from "@core/entities/wrappers/validation";

export const emptyLimitSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(-1),
});
export type EmptyLimit = z.infer<typeof emptyLimitSchema>;
export type EmptyLimitValidationField = ValidationErrorFields<
  typeof emptyLimitSchema
>;
