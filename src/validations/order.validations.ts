import { DISH_STATUS_VALUES, ORDER_STATUS_VALUES } from "src/constants/type";
import { accountSchema } from "src/validations/account.validations";
import { tableSchema } from "src/validations/table.validations";
import z from "zod";

const dishSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  status: z.enum(DISH_STATUS_VALUES),
  dishId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const orderSchema = z.object({
  id: z.number(),
  guestId: z.number().nullable(),
  guest: z
    .object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .nullable(),
  tableNumber: z.number().nullable(),
  dishSnapshotId: z.number(),
  dishSnapshot: dishSnapshotSchema,
  quantity: z.number(),
  orderHandlerId: z.number().nullable(),
  orderHandler: accountSchema.nullable(),
  status: z.enum(ORDER_STATUS_VALUES),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateOrderBody = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
  dishId: z.number(),
  quantity: z.number(),
});

export type TUpdateOrderBody = z.TypeOf<typeof updateOrderBody>;

export const orderParam = z.object({
  orderId: z.coerce.number(),
});

export type TOrderParam = z.TypeOf<typeof orderParam>;

export const updateOrderRes = z.object({
  message: z.string(),
  data: orderSchema,
});

export type TUpdateOrderRes = z.TypeOf<typeof updateOrderRes>;

export const getOrdersQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type TGetOrdersQueryParams = z.TypeOf<typeof getOrdersQueryParams>;

export const getOrdersRes = z.object({
  message: z.string(),
  data: z.array(orderSchema),
});

export type TGetOrdersRes = z.TypeOf<typeof getOrdersRes>;

export const getOrderDetailRes = z.object({
  message: z.string(),
  data: orderSchema.extend({
    table: tableSchema,
  }),
});

export type TGetOrderDetailRes = z.TypeOf<typeof getOrderDetailRes>;

export const payGuestOrdersBody = z.object({
  guestId: z.number(),
});

export type TPayGuestOrdersBody = z.TypeOf<typeof payGuestOrdersBody>;

export const payGuestOrdersRes = getOrdersRes;

export type TPayGuestOrdersRes = z.TypeOf<typeof payGuestOrdersRes>;

export const createOrdersBody = z
  .object({
    guestId: z.number(),
    orders: z.array(
      z.object({
        dishId: z.number(),
        quantity: z.number(),
      }),
    ),
  })
  .strict();

export type TCreateOrdersBody = z.TypeOf<typeof createOrdersBody>;

export const createOrdersRes = z.object({
  message: z.string(),
  data: z.array(orderSchema),
});

export type TCreateOrdersRes = z.TypeOf<typeof createOrdersRes>;
