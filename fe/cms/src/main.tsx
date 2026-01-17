import { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { httpLink, loggerLink } from "@trpc/client";

import "./index.css";
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "@/components";
import { authClient } from "./lib/auth";
import { trpc } from "./lib/trpc.ts";

const router = createRouter({
  routeTree,
  context: {
    authClient,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5, // 5 minute
    },
  },
});

const backendBaseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");
const trpcUrl = backendBaseUrl.endsWith("/trpc")
  ? backendBaseUrl
  : `${backendBaseUrl}/trpc`;

const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: trpcUrl,
      headers: () => {
        const token = import.meta.env.VITE_ADMIN_AUTH_TOKEN;
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
      fetch: (url, options) =>
        fetch(url, { ...options, credentials: "include" }),
    }),
    loggerLink(),
  ],
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface RouterContext {
    authClient: typeof authClient;
  }
}

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider data={authClient}>{children}</AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </StrictMode>,
  );
}
