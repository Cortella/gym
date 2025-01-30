import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import fastify from "fastify";
import { request } from "http";
import { register } from "./http/controllers/register";
import { appRoutes } from "./http/routes";


export const app = fastify();

app.register(appRoutes)

