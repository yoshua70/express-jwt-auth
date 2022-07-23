import { createRouter } from "./router";
import { userRouter } from "./routers/user";

export const appRouter = createRouter().merge("user.", userRouter);

export type AppRouter = typeof appRouter;
