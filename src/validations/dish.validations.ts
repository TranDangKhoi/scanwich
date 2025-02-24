import { DISH_STATUS_VALUES } from "src/constants/types.constants.ts";
import z from "zod";

export const createDishBodySchema = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000),
  image: z.string().url(),
  status: z.enum(DISH_STATUS_VALUES).optional(),
});

export type TCreateDishBody = z.TypeOf<typeof createDishBodySchema>;

export const dishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.coerce.number(),
  description: z.string(),
  image: z.string(),
  status: z.enum(DISH_STATUS_VALUES),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TDish = z.TypeOf<typeof dishSchema>;

export const dishResSchema = z.object({
  data: dishSchema,
  message: z.string(),
});

export type TDishRes = z.TypeOf<typeof dishResSchema>;

export const dishListResSchema = z.object({
  data: z.array(dishSchema),
  message: z.string(),
});

export type TDishListRes = z.TypeOf<typeof dishListResSchema>;

export const updateDishBodySchema = createDishBodySchema;
export type TUpdateDishBody = TCreateDishBody;

export const dishParamsSchema = z.object({
  id: z.coerce.number(),
});

export type TDishParams = z.TypeOf<typeof dishParamsSchema>;
