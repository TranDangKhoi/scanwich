import { ROLE } from "src/constants/types.constants";
import { orderSchema } from "src/validations/order.validations";
import z from "zod";

export const guestLoginBodySchema = z
  .object({
    name: z.string().min(2).max(50),
    tableNumber: z.number(),
    token: z.string(),
  })
  .strict();

export type TGuestLoginBody = z.TypeOf<typeof guestLoginBodySchema>;

export const guestLoginResSchema = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    guest: z.object({
      id: z.number(),
      name: z.string(),
      role: z.enum([ROLE.Guest]),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  }),
  message: z.string(),
});

export type TGuestLoginRes = z.TypeOf<typeof guestLoginResSchema>;

export const guestCreateOrdersBodySchema = z.array(
  z.object({
    dishId: z.number(),
    quantity: z.number(),
  }),
);

export type TGuestCreateOrdersBody = z.TypeOf<typeof guestCreateOrdersBodySchema>;

export const guestCreateOrdersResSchema = z.object({
  message: z.string(),
  data: z.array(orderSchema),
});

export type TGuestCreateOrdersRes = z.TypeOf<typeof guestCreateOrdersResSchema>;

export const guestGetOrdersResSchema = guestCreateOrdersResSchema;

export type TGuestGetOrdersRes = z.TypeOf<typeof guestGetOrdersResSchema>;
