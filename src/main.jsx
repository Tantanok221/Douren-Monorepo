import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "normalize.css";
import { CollectionLayout } from "./layout/CollectionLayout/CollectionLayout.jsx";
import Root from "./routes/Root/Root.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Root/>
    ),
    children : [
      {
        path: "/",
        element: <MainLayout/>,
      },
      {
        path: "collection",
        element: <CollectionLayout/>
      }
    ]
  },
  {
    path: "about",
    element: <div>About</div>,
  }

]);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
