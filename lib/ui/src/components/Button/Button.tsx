import { motion } from "framer-motion";
import classNames from "classnames/bind";
import style from "./style.module.css";
import { IconContext } from "@phosphor-icons/react";
import type {
  ComponentProps,
  ComponentType,
  MouseEventHandler,
  ReactNode,
} from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

type IconProviderProps = ComponentProps<typeof IconContext.Provider>;
const IconProvider = IconContext.Provider as ComponentType<IconProviderProps>;

export const Button = ({ children, onClick }: ButtonProps) => {
  const sx = classNames.bind(style);
  return (
    <IconProvider
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
    </IconProvider>
  );
};
