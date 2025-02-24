import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { dashboardIndicatorController } from "src/controllers/indicator.controller";
import { requireEmployeeHook, requireLoginedHook, requireOwnerHook } from "src/hooks/auth.hooks";
import {
  DashboardIndicatorQueryParams,
  DashboardIndicatorQueryParamsType,
  DashboardIndicatorRes,
  DashboardIndicatorResType,
} from "src/schemaValidations/indicator.schema";

export default async function indicatorRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook(
    "preValidation",
    fastify.auth([requireLoginedHook, [requireOwnerHook, requireEmployeeHook]], {
      relation: "and",
    }),
  );
  fastify.get<{ Reply: DashboardIndicatorResType; Querystring: DashboardIndicatorQueryParamsType }>(
    "/dashboard",
    {
      schema: {
        response: {
          200: DashboardIndicatorRes,
        },
        querystring: DashboardIndicatorQueryParams,
      },
    },
    async (request, reply) => {
      const queryString = request.query;
      const result = await dashboardIndicatorController(queryString);
      reply.send({
        message: "Lấy các chỉ số thành công",
        data: result as DashboardIndicatorResType["data"],
      });
    },
  );
}
