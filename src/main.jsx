import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "normalize.css";
import Collection from "./pages/Collection/Collection.jsx";
import Root from "./routes/Root/Root.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import { PostHogProvider } from "posthog-js/react";
import posthog from 'posthog-js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "collection",
        element: <Collection />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
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

createRoot(document.getElementById("root")).render(
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
