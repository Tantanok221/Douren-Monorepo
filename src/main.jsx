import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "normalize.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <MainLayout />
      </div>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
