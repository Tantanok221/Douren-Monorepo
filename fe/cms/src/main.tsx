import { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink, loggerLink } from "@trpc/client";
import { trpc } from "./lib/trpc.ts";
import { AuthProvider } from "@/components";
import { authClient } from "./lib/auth";

// Create a new router instance
const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5, // 5 minute
    },
  },
});
const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: import.meta.env.VITE_BACKEND_URL,
      headers: () => {
        const token = import.meta.env.VITE_ADMIN_AUTH_TOKEN;
        return token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
      },
    }),
    loggerLink(),
  ],
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider data={authClient}>{children}</AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
};

// Render the app
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
