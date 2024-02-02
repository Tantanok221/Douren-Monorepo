import React from "react";
import style from "./AboutCard.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"
import { BiArrowToTop } from "react-icons/bi";
import { IconContext } from "react-icons";
const AboutCard = () => {
  const sx = classNames.bind(style);
  return (<motion.div
    
    className={sx("AboutCard")}
  >
     </motion.div>)
}

export default AboutCard