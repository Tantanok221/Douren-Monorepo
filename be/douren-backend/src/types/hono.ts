import type { initDB } from "@pkg/database/db";
import type { Auth, AuthSession } from "@/lib/auth";
import type { ENV_BINDING } from "@pkg/env/constant";

export type HonoVariables = {
  db: ReturnType<typeof initDB>;
  user: Auth["$Infer"]["Session"]["user"] | null;
  session: AuthSession | null;
};

export type HonoEnv = { Bindings: ENV_BINDING; Variables: HonoVariables };
