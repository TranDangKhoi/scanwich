import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_PRODUCTION_API_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_URL: z.string().url(),
});
