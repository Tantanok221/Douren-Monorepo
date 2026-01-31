import { IconContext } from "@phosphor-icons/react";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { cloneElement, isValidElement, type MouseEventHandler } from "react";

import style from "./style.module.css";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  asChild?: boolean;
};

export const Button = ({
  children,
  onClick,
  className,
  asChild = false,
}: ButtonProps): JSX.Element => {
  const sx = classNames.bind(style);
  const buttonClassName = sx("linkButton", className);

  if (asChild && isValidElement(children)) {
    const childClassName = sx(
      "linkButton",
      className,
      (children.props as { className?: string }).className,
    );

    return (
      <IconContext.Provider
        value={{
          color: "#CBC3C3",
          size: "1.5rem",
        }}
      >
        {cloneElement(children, {
          className: childClassName,
          onClick,
        })}
      </IconContext.Provider>
    );
  }

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
        className={buttonClassName}
      >
        {children}
      </motion.button>
    </IconContext.Provider>
  );
};
