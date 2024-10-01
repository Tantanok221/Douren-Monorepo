import React from "react";
import style from "../style.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import {useEventDataContext} from "@components/ArtistCard/EventDataContext.ts";


const IntroductionContainer = () => {
  const sx = classNames.bind(style);
  const artistData = useEventDataContext();

  return (
    <motion.div className={sx("introductionContainer")}>
      {artistData?.introduction}
    </motion.div>
  );
};

export default IntroductionContainer;
