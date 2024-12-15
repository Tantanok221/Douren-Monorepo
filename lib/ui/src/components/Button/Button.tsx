import { motion } from "framer-motion";
import classNames from "classnames/bind";
import style from "./style.module.css";
import { IconContext } from "@phosphor-icons/react";
interface props {
  children: React.ReactNode;
}

export const Button = ({ children }: props) => {
  const sx = classNames.bind(style);
  return (
    <IconContext.Provider
      value={{
        color: "#CBC3C3",
        size: "1.5rem",
      }}
    >
      <motion.button
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
