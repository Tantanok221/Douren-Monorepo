import React from "react";
import style from "./Sidebar.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const sx = classNames.bind(style);
  return (
    <div className={sx("sidebarContainer")}>
      <IconContext.Provider value={{ color: "#AAAAAA", size: "1.5rem" }}>
        <div className={sx("linkContainer")}>
          <Link to={"/"} className={sx("linkButton")}>
            <RiHome2Line />
            FF42
          </Link>
          <Link to={"/collection"} className={sx("linkButton")}>
            
            <MdOutlineBookmarkBorder />
            我的收藏
          </Link>
        </div>
      </IconContext.Provider>
    </div>
  );
};
