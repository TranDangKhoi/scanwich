import { ROLE } from "src/constants/type";
import z from "zod";

export const loginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type TLoginBody = z.TypeOf<typeof loginBodySchema>;

export const loginResSchema = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum([ROLE.Owner, ROLE.Employee]),
    }),
  }),
  message: z.string(),
});

export type TLoginRes = z.TypeOf<typeof loginResSchema>;

export const refreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type TRefreshTokenBody = z.TypeOf<typeof refreshTokenBodySchema>;

export const refreshTokenResSchema = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
});

export type TRefreshTokenRes = z.TypeOf<typeof refreshTokenResSchema>;

export const logoutBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type TLogoutBody = z.TypeOf<typeof logoutBodySchema>;
