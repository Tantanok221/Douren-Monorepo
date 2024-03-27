import React from "react";
import style from "./ArtistPage.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"

interface Props {}

const ArtistPage = ({}:Props) => {
  const sx = classNames.bind(style);
  return (<motion.div className={sx("mainContainer")}>ArtistPage </motion.div>)
}

export default ArtistPage