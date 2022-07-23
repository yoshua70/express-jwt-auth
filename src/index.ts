import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/server";
import { createContext } from "./trpc/context";
import cookieParser from "cookie-parser";

const main = async () => {
  const app = express();

  app.use(cookieParser());
  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
  );

  app.listen(4000, () => {
    console.log("[INFO] Server up and running on port 4000.");
  });
};

main().catch((err) => console.error(err));
