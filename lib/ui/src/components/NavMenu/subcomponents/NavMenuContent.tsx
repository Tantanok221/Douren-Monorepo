import React, { ReactNode } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
type Props = {
  children: ReactNode;
};
const NavMenuContent = ({ children }: Props) => {
  const sx = classNames.bind(style);
  return (
    <NavigationMenu.Content
      className={sx("navigationMenuContent", "navigationSubMenu")}
    >
      {children}
    </NavigationMenu.Content>
  );
};

export default NavMenuContent;
