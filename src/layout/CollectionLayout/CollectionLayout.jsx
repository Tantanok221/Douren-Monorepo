import React from "react";
import style from "./CollectionLayout.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"

export const CollectionLayout = () => {
  const sx = classNames.bind(style);
  return (<motion.div className={sx("CollectionLayout")}>CollectionLayout </motion.div>)
}
