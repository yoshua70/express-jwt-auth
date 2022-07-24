import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { getToken } from "../jwt";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const token = await getToken({ req, cookieName: "auth_jwt" });

  return {
    req,
    res,
    token,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
