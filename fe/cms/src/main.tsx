import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink, loggerLink } from "@trpc/client";

import "./index.css";
import { routeTree } from "./routeTree.gen";
import { trpc } from "./helper/trpc.ts";

const router = createRouter({ routeTree });

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
    }),
    loggerLink(),
  ],
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>,
  );
}
