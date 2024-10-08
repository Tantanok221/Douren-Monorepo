import * as React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "normalize.css";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import { trpc } from "@/helper/trpc.ts";
import {httpBatchLink, httpLink, loggerLink} from "@trpc/client";
import { routeTree } from "@/routeTree.gen.ts";
import { createRouter, RouterProvider } from "@tanstack/react-router";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <__root />,
//     children: [
//       {
//         path: "/",
//         element: <FF42Animate />,
//       },
//       {
//         path: "collection",
//         element: <AnimateCollection />,
//       },
//       {
//         path: "about",
//         element: <about />,
//       },
//       {
//         path: "artist",
//         element: <Artist />,
//       },
//       {
//         path: "artist/:id",
//         element: <ArtistPage />,
//       },
//       {
//         path: "event/:eventName",
//         element: <EventPageAnimate />,
//         loader: async ({ params }):Promise<number> => {
//           if (!params.eventName) {
//             return 0;
//           }
//           const query = supabase
//             .from("Event")
//             .select("id")
//             .eq("name", params?.eventName.toUpperCase());
//           const { data, error } = await query;
//           if (error || !data || data.length === 0) {
//             return 0;
//           }
//           return data[0].id;
//         },
//       },
//     ],
//   },
// ]);

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: import.meta.env.VITE_BACKEND_URL,
    }),
    loggerLink()
  ],
});

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
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
