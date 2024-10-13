import classNames from "classnames/bind";
import React from "react";
import style from "./root.module.css";
import {AnimatePresence} from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import {createRootRoute, createRouter, Outlet} from "@tanstack/react-router";


const root = () => {
  const sx = classNames.bind(style);

  return (
    <AnimatePresence>
      <div className={sx("Root")}>
        <Navbar/>
        <Outlet/>
      </div>
    </AnimatePresence>
  );
};


export const Route = createRootRoute({
    component: root,
  });

