import React from "react";
import style from "./Navbar.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import { useMediaQuery } from "@mantine/hooks";
import { MdOutlineBookmarkBorder, MdInfoOutline } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";

interface Props {}

const Navbar = ({}: Props) => {
  const sx = classNames.bind(style);
  const matches = useMediaQuery("(max-width: 800px)");
  const location = useLocation();
  return (
    <motion.div className={sx("Navbar")}>
      <IconContext.Provider value={{ color: "#AAAAAA", size: "1.75rem" }}>
        <div className={sx("linkContainer")}>
          <Link
            to={"/"}
            className={sx("linkButton", {
              activeButton: location.pathname === "/",
            })}
          >
            {matches ? <RiHome2Line /> : "FF42"}
          </Link>
          <Link
            to={"/collection"}
            className={sx("linkButton", {
              activeButton: location.pathname === "/collection",
            })}
          >
            {matches ? <MdOutlineBookmarkBorder /> : "我的收藏"}
          </Link>
          <Link
            to={"/artist"}
            className={sx("linkButton", {
              activeButton: location.pathname === "/artist",
            })}
          >
            {matches ? <MdOutlineBookmarkBorder /> : "创作者"}
          </Link>
          <Link
            to={"/about"}
            className={sx("linkButton", {
              activeButton: location.pathname === "/about",
            })}
          >
            {matches ? <MdInfoOutline /> : "關於我們"}
          </Link>
        </div>
      </IconContext.Provider>
    </motion.div>
  );
};

export default Navbar;
