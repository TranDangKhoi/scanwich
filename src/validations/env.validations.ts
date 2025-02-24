import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_COOKIE_MODE: z.enum(["lax", "strict", "none"]),
});
