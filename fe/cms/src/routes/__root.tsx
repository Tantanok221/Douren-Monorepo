import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "./-components/Navbar.tsx";
import { globalStyles, initializeGlobalStyles, styled } from "@lib/ui";
import { useEffect } from "react";

const RootComponent = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  alignItems: "center",
  width: "100%"
});
const OutletMargin = styled("div", {
  padding: "2rem 10.5rem",
  width: "100%"
});

const Root = () => {
  useEffect(() => {
    initializeGlobalStyles();
  }, []);
  return (
    <RootComponent>
      <Navbar />
      <OutletMargin>
        <Outlet />
      </OutletMargin>
    </RootComponent>);
};

export const Route = createRootRoute({
  component: Root
});
