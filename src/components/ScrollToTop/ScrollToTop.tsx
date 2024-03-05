import React from "react";
import style from "./ScrollToTop.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"
import { BiArrowToTop } from "react-icons/bi";
import { IconContext } from "react-icons";
const ScrollToTop = () => {
  const sx = classNames.bind(style);
  return (<motion.a
    whileHover={{
      backgroundColor: "#4D4D4D",
    }}
    href="#top"
    className={sx("scrollTop")}
  >
    <IconContext.Provider
      value={{
        color: "#CBC3C3",
        size: "2rem",
      }}
    >
      <BiArrowToTop />
    </IconContext.Provider>
  </motion.a>)
}

export default ScrollToTop