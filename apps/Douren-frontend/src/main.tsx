import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "normalize.css";
import Root from "./pages/Root/Root.tsx";
import AboutUs from "./pages/AboutUs/AboutUs.tsx";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import Artist from "./pages/Artist/Artist.tsx";
import ArtistPage from "./pages/ArtistPage/ArtistPage.tsx";
import FF42Animate from "./pages/FF42/FF42.tsx";
import AnimateCollection from "./pages/Collection/Collection.tsx";
import EventPageAnimate from "./pages/EventPage/EventPage.tsx";
import { useEventIDQuery } from "./hooks/useEventIDQuery.ts";
import { supabase } from "./helper/supabase.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <FF42Animate />,
      },
      {
        path: "collection",
        element: <AnimateCollection />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "artist",
        element: <Artist />,
      },
      {
        path: "artist/:id",
        element: <ArtistPage />,
      },
      {
        path: "event/:eventName",
        element: <EventPageAnimate />,
        loader: async ({ params }):Promise<number> => {
          if (!params.eventName) {
            return 0;
          }
          const query = supabase
            .from("Event")
            .select("id")
            .eq("name", params?.eventName.toUpperCase());
          const { data, error } = await query;
          if (error || !data || data.length === 0) {
            return 0;
          }
          return data[0].id;
        },
      },
    ],
  },
]);
const queryClient = new QueryClient();

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: "https://app.posthog.com",
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PostHogProvider client={posthog}>
        <RouterProvider router={router} />
      </PostHogProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
