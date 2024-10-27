import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "./-components/Navbar.tsx";

const Root = () => {
  return (
    <div className={"flex flex-col items-center w-full h-screen"}>
      <Navbar />
      <div className={"w-full py-4 px-40"}>
        <Outlet />
      </div>
    </div>);
};

export const Route = createRootRoute({
  component: Root
});
