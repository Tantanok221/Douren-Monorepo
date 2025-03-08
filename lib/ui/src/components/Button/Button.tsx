import { motion } from "framer-motion";
import classNames from "classnames/bind";
import style from "./style.module.css";
import { IconContext } from "@phosphor-icons/react";
import { MouseEventHandler } from "react";
interface props {
  children: React.ReactNode;
  onClick?: MouseEventHandler;
}

export const Button = ({ children, onClick }: props) => {
  const sx = classNames.bind(style);
  return (
    <IconContext.Provider
      value={{
        color: "#CBC3C3",
        size: "1.5rem",
      }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{
          backgroundColor: "#4D4D4D",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className={sx("linkButton")}
      >
        {children}
      </motion.button>
    </IconContext.Provider>
  );
};
