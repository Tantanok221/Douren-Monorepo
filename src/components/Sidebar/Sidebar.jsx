import React from "react";
import style from "./Sidebar.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";
import { IconContext } from "react-icons";

export const Sidebar = () => {
  const sx = classNames.bind(style);
  return (
    <div className={sx("sidebarContainer")}>
      <IconContext.Provider value={{ color: "#AAAAAA", size: "1.5rem" }}>
        <div className={sx("linkContainer")}>
          <a className={sx("linkButton")}>
            <MdOutlineBookmarkBorder />
            FF42
          </a>
          <a className={sx("linkButton")}>
            <RiHome2Line />
            我的收藏
          </a>
        </div>
      </IconContext.Provider>
    </div>
  );
};
