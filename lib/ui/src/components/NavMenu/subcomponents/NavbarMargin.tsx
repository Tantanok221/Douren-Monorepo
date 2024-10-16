import React from "react";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
import { useMediaQuery } from "@mantine/hooks";

export const NavbarMargin = () => {
  const sx = classNames.bind(style);
  const smallPhoneSize = useMediaQuery("(max-width: 800px)");
  return (
    <>{smallPhoneSize ? <div className={sx("bottomPadding")}/> : null}</>
  );
};

