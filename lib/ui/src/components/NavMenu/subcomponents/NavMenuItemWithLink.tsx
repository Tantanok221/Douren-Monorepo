import React, { ReactNode } from "react";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
import {NavMenu }from "../NavMenu";
type Props = {
  children: ReactNode;
  path: string;
};
const NavMenuItemWithLink = ({ path, children }: Props) => {
  const sx = classNames.bind(style);
  return (
    <NavMenu.Item>
      <NavMenu.Link path={path}>{children}</NavMenu.Link>
    </NavMenu.Item>
  );
};

export default NavMenuItemWithLink;
