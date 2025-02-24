import z from "zod";

export const uploadImageRes = z.object({
  data: z.string(),
  message: z.string(),
});

export type TUploadImageRes = z.TypeOf<typeof uploadImageRes>;
