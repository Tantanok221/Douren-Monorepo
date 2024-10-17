import classNames from "classnames/bind";
import React from "react";
import style from "./root.module.css";
import { AnimatePresence } from "framer-motion";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/routes/-components/Navbar.tsx";

const root = () => {
  const sx = classNames.bind(style);

  return (
    <AnimatePresence>
      <div className={sx("Root")}>
        <Navbar />
        <Outlet />
      </div>
    </AnimatePresence>
  );
};

export const Route = createRootRoute({
  component: root,
});
