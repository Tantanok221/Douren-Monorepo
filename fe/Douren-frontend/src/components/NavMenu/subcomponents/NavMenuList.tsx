import React, { ReactNode } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
type Props = {
  children: ReactNode;
};
const NavMenuList = ({ children }: Props) => {
  const sx = classNames.bind(style);
  return (
    <NavigationMenu.List className={sx("linkContainer")}>
      {children}
    </NavigationMenu.List>
  );
};

export default NavMenuList;
