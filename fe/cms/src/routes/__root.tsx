import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "./-components/Navbar.tsx";
import { ThemeProvider } from "../components/ThemeProvider/ThemeProvider.tsx";

const Root = () => {
  return (
    <ThemeProvider defaultTheme={"dark"} storageKey={"douren-cms-theme"}>
      <div className={"flex flex-col items-center w-full h-screen dark"}>
        <Navbar />
        <div className={"w-full py-4 px-40"}>
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: Root
});
