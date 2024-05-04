import React from "react";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
import { useMediaQuery } from "@uidotdev/usehooks";
type Props = {};

const NavbarMargin = (props: Props) => {
  const sx = classNames.bind(style);
  const smallPhoneSize = useMediaQuery("(max-width: 800px)");
  return (
    <>{smallPhoneSize ? <div className={sx("bottomPadding")}></div> : null}</>
  );
};

export default NavbarMargin;
