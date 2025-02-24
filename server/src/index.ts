// Import the framework and instantiate it
import fastifyAuth from "@fastify/auth";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import path from "path";
import envConfig, { API_URL } from "src/config";
import { initOwnerAccount } from "src/controllers/account.controller";
import autoRemoveRefreshTokenJob from "src/jobs/autoRemoveRefreshToken.job";
import { errorHandlerPlugin } from "src/plugins/errorHandler.plugins";
import { socketPlugin } from "src/plugins/socket.plugins";
import validatorCompilerPlugin from "src/plugins/validatorCompiler.plugins";
import accountRoutes from "src/routes/account.route";
import authRoutes from "src/routes/auth.route";
import dishRoutes from "src/routes/dish.route";
import guestRoutes from "src/routes/guest.route";
import indicatorRoutes from "src/routes/indicator.route";
import mediaRoutes from "src/routes/media.route";
import orderRoutes from "src/routes/order.route";
import staticRoutes from "src/routes/static.route";
import tablesRoutes from "src/routes/table.route";
import testRoutes from "src/routes/test.route";
import { createFolder } from "src/utils/helpers";

const fastify = Fastify({
  logger: false,
});

// Run the server!
const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER));
    autoRemoveRefreshTokenJob();
    const whitelist = ["*"];
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true, // Cho phép trình duyệt gửi cookie đến server
    });

    fastify.register(fastifyAuth, {
      defaultRelation: "and",
    });
    fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    });
    fastify.register(fastifyCookie);
    fastify.register(validatorCompilerPlugin);
    fastify.register(errorHandlerPlugin);
    fastify.register(fastifySocketIO, {
      cors: {
        origin: envConfig.CLIENT_URL,
      },
    });
    fastify.register(socketPlugin);
    fastify.register(authRoutes, {
      prefix: "/auth",
    });
    fastify.register(accountRoutes, {
      prefix: "/accounts",
    });
    fastify.register(mediaRoutes, {
      prefix: "/media",
    });
    fastify.register(staticRoutes, {
      prefix: "/static",
    });
    fastify.register(dishRoutes, {
      prefix: "/dishes",
    });
    fastify.register(tablesRoutes, {
      prefix: "/tables",
    });
    fastify.register(orderRoutes, {
      prefix: "/orders",
    });
    fastify.register(testRoutes, {
      prefix: "/test",
    });
    fastify.register(guestRoutes, {
      prefix: "/guest",
    });
    fastify.register(indicatorRoutes, {
      prefix: "/indicators",
    });
    await initOwnerAccount();
    await fastify.listen({
      port: envConfig.PORT,
      host: envConfig.DOCKER ? "0.0.0.0" : "localhost",
    });
    console.log(`Server đang chạy: ${API_URL}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
