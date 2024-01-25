import React from "react";
import style from "./TemplateName.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"

const TemplateName = () => {
  const sx = classNames.bind(style);
  return (<motion.div className={sx("TemplateName")}>TemplateName </motion.div>)
}

export default TemplateName