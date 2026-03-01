import * as React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { httpLink, loggerLink } from "@trpc/client";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import "normalize.css";
import "./index.css";
import { routeTree } from "@/routeTree.gen.ts";
import { trpc } from "@/helper/trpc.ts";

const queryClient = new QueryClient();
const backendBaseUrl = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:2000"
).replace(/\/+$/, "");
const trpcUrl = backendBaseUrl.endsWith("/trpc")
  ? backendBaseUrl
  : `${backendBaseUrl}/trpc`;
const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: trpcUrl,
    }),
    loggerLink(),
  ],
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: "https://app.posthog.com",
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        <PostHogProvider client={posthog}>
          <RouterProvider router={router} />
        </PostHogProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);
