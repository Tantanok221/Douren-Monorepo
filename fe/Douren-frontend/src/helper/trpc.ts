import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@be/douren-backend/src/";

export const trpc = createTRPCReact<AppRouter>();
