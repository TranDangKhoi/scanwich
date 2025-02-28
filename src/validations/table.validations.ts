import { TABLE_STATUS_VALUES } from "src/constants/types.constants";
import z from "zod";

export const createTableBody = z.object({
  number: z.coerce.number().positive(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TABLE_STATUS_VALUES).optional(),
});

export type TCreateTableBody = z.TypeOf<typeof createTableBody>;

export const tableSchema = z.object({
  number: z.coerce.number(),
  capacity: z.coerce.number(),
  status: z.enum(TABLE_STATUS_VALUES),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const tableRes = z.object({
  data: tableSchema,
  message: z.string(),
});

export type TTableRes = z.TypeOf<typeof tableRes>;

export const tableListRes = z.object({
  data: z.array(tableSchema),
  message: z.string(),
});

export type TTableListRes = z.TypeOf<typeof tableListRes>;

export const updateTableBody = z.object({
  changeToken: z.boolean(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TABLE_STATUS_VALUES).optional(),
});

export type TUpdateTableBody = z.TypeOf<typeof updateTableBody>;

export const tableParams = z.object({
  number: z.coerce.number(),
});

export type TTableParams = z.TypeOf<typeof tableParams>;
