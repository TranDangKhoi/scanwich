import z from "zod";

export const messageResSchema = z
  .object({
    message: z.string(),
  })
  .strict();

export type TMessageRes = z.TypeOf<typeof messageResSchema>;
