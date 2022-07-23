import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma-client";
import argon2 from "argon2";
import { Context } from "./context";

export const appRouter = trpc
  .router<Context>()
  .query("getUser", {
    input: z.string(),
    async resolve(req) {
      const user = await prisma.user
        .findFirst({ where: { id: req.input } })
        .finally(() => prisma.$disconnect);
      console.log(req.ctx.token);
      return user;
    },
  })
  .mutation("createUser", {
    input: z.object({
      name: z.string().min(5),
      phone: z.string().length(10),
      password: z.string().min(8),
    }),
    async resolve(req) {
      const { phone, password, name } = req.input;

      let user = await prisma.user
        .findFirst({ where: { phone } })
        .finally(() => prisma.$disconnect);

      if (user) return { errors: "Phone is already registered" };

      const hashedPassword = await argon2.hash(password);

      return await prisma.user
        .create({ data: { phone, name, password: hashedPassword } })
        .finally(() => prisma.$disconnect);
    },
  });

export type AppRouter = typeof appRouter;
