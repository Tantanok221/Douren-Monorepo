import { motion } from "framer-motion";
import classNames from "classnames/bind";
import style from "./style.module.css";
import { IconContext } from "@phosphor-icons/react";
import type { MouseEventHandler, ReactElement, ReactNode } from "react";
import type { IconProps } from "@phosphor-icons/react";

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

type IconProviderProps = {
  value: IconProps;
  children?: ReactNode;
};

const IconProvider = IconContext.Provider as unknown as (
  props: IconProviderProps,
) => ReactElement | null;

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
