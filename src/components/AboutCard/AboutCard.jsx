import React from "react";
import style from "./AboutCard.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { IconContext } from "react-icons";
const AboutCard = ({ author_data }) => {
  const sx = classNames.bind(style);
  return (
    <motion.div className={sx("AboutCard")}>
      <div className={sx("header")}>
        <h1 className={sx("title")}>{author_data.title}</h1>
        <h2 className={sx("subtitle")}>{author_data.subtitle}</h2>
      </div>
      <p className={sx("description")}>{author_data.description}</p>
    </motion.div>
  );
};

export default AboutCard;
