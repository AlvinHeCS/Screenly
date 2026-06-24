import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

import { type AppRouter, appRouter, createCaller } from "./root";
import { createTRPCContext } from "./trpc";

export { appRouter, createCaller, createTRPCContext };
export type { AppRouter };

/** Inference helpers: `RouterInputs['video']['create']`, etc. */
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
