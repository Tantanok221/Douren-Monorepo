import React from "react";
import style from "../style.module.css";
import classNames from "classnames/bind";
import {motion} from "framer-motion"
import { useArtistCardContext } from "../ArtistCardContext";

interface Props {}

const IntroductionContainer = ({}:Props) => {
  const sx = classNames.bind(style);
  const artistData = useArtistCardContext();

  return (<motion.div className={sx("introductionContainer")}>{artistData?.Introduction}</motion.div>)
}

export default IntroductionContainer