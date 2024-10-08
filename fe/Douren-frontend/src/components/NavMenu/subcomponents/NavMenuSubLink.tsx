import React, {ReactNode} from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
import {Link} from "@tanstack/react-router"

type Props = {
  children: ReactNode;
  path: string;
};
const NavMenuSubLink = ({children, path}: Props) => {
  const sx = classNames.bind(style);
  return (
    <NavigationMenu.Link asChild>
      <Link
        to={path}
        className={sx("subLinkButton", {
          activeButton: location.pathname === path,
        })}
      >
        {children}
      </Link>
    </NavigationMenu.Link>
  );
};

export default NavMenuSubLink;
