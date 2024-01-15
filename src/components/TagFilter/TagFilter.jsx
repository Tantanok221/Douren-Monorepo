import React from "react";
import style from "./TagFilter.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"

export const TagFilter = () => {
  const sx = classNames.bind(style);
  return (<motion.div className={sx("TagFilter")}>TagFilter </motion.div>)
}
