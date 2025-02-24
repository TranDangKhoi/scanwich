import { Account } from "@prisma/client";
import { type FastifyRequest, FastifyInstance, FastifyReply } from "fastify";
import type { Server } from "socket.io";
import { TokenPayload } from "src/types/jwt.types";
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
  interface FastifyRequest {
    decodedAccessToken?: TokenPayload;
  }
}
