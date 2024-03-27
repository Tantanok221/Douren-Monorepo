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
import Collection from "./pages/Collection/Collection.tsx";
import Root from "./routes/Root/Root";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import { PostHogProvider } from "posthog-js/react";
import posthog from 'posthog-js';
import Artist from "./pages/Artist/Artist.tsx";
import FF42 from "./pages/FF42/FF42.jsx";
import ArtistPage from "./pages/ArtistPage/ArtistPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <FF42 />,
      },
      {
        path: "collection",
        element: <Collection />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "artist",
        element: <Artist/>,
      },
      {
        path: "artist/:id",
        element: <ArtistPage/>,
      }
    ],
  },
]);
const queryClient = new QueryClient();

posthog.init(
  import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  {
    api_host: "https://app.posthog.com",
  }
);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PostHogProvider
        client={posthog}
      >
        <RouterProvider router={router} />
      </PostHogProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
