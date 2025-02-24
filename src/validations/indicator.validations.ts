import { dishSchema } from "src/validations/dish.validations";
import z from "zod";

export const dashboardIndicatorQueryParams = z.object({
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
});

export type TDashboardIndicatorQueryParams = z.TypeOf<typeof dashboardIndicatorQueryParams>;

export const dashboardIndicatorRes = z.object({
  data: z.object({
    revenue: z.number(),
    guestCount: z.number(),
    orderCount: z.number(),
    servingTableCount: z.number(),
    dishIndicator: z.array(
      dishSchema.extend({
        successOrders: z.number(),
      }),
    ),
    revenueByDate: z.array(
      z.object({
        date: z.string(),
        revenue: z.number(),
      }),
    ),
  }),
  message: z.string(),
});

export type TDashboardIndicatorRes = z.TypeOf<typeof dashboardIndicatorRes>;
