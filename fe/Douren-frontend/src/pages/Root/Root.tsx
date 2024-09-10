import classNames from "classnames/bind";
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import style from "./root.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "../../components/Navbar/Navbar";

const Root = () => {
  const queryClient = useQueryClient();
  const sx = classNames.bind(style);
  const location = useLocation();

  return (
    <AnimatePresence>
      <div className={sx("Root")}>
        <Navbar/>
        <Outlet key={location.key} />
        <SpeedInsights />
      </div>
    </AnimatePresence>
  );
};

export default Root;
