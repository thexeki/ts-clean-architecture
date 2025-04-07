import { z } from "zod";

export const permissionSchema = z.object({
  slug: z.string(),
  type: z.string(),
  label: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional().nullable(),
});
export type Permission = z.infer<typeof permissionSchema>;
