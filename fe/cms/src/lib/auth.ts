import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:2000",
  fetchOptions: {
    credentials: "include",
  },
});

export type AuthClient = typeof authClient;
