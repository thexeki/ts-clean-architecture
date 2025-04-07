import { z } from "zod";

export interface EmptyList<T> {
  list: T[];
  total: number;
}

export function createEmptyListSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    list: z.array(dataSchema),
    total: z.number(),
  });
}
