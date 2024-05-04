import React from "react";
import style from "./Sidebar.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { MdOutlineBookmarkBorder, MdInfoOutline } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

export const Sidebar = () => {
  const sx = classNames.bind(style);
  const location = useLocation();
  const matches = useMediaQuery("(max-width: 800px)");
  return (
    <div className={sx("sidebarContainer")}>
      <IconContext.Provider
        value={{ color: "#AAAAAA", size: matches ? "1.75rem" : "2rem" }}
      >
        <div className={sx("linkContainer")}>
          <Link
            to={"/"}
            className={sx("linkButton", {
              activeButton: location.pathname === "/",
            })}
          >
            <RiHome2Line />
            FF42
          </Link>
          <Link
            to={"/collection"}
            className={sx("linkButton", {
              activeButton: location.pathname === "/collection",
            })}
          >
            <MdOutlineBookmarkBorder />
            我的收藏
          </Link>
        </div>
        <div className={sx("bottomContainer")}>
          <Link
            to={"/about"}
            className={sx("linkButton", {
              activeButton: location.pathname === "/about",
            })}
          >
            <MdInfoOutline />
            關於我們
          </Link>
        </div>
      </IconContext.Provider>
    </div>
  );
};
