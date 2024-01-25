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
import  Collection  from "./pages/Collection/Collection.jsx";
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
        element: <Main/>,
      },
      {
        path: "collection",
        element: <Collection/>
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
