import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "./-components/Navbar.tsx";
import { Toaster } from "@/components/ui/sonner";
import type { AuthClient } from "@/lib/auth";

interface RouterContext {
  authClient: AuthClient;
}

const Root = () => {
  return (
    <>
      <Toaster />
      <div className={"flex flex-col items-center w-full h-screen dark"}>
        <Navbar />
        <div className={"w-full pt-20 py-4 px-40"}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export const Route = createRootRoute({
  component: Root,
});
