import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
type Props = {
  children: React.ReactNode;
};

const RightContainer = ({ children }: Props) => {
  const sx = classNames.bind(styles);
  return <div className={sx("rightContainer")}>{children}</div>;
};

export default RightContainer;
