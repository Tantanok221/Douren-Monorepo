import React, { ReactNode } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
import { CaretDown } from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
type Props = {
  children: ReactNode;
  activePath: string[];
};
const NavMenuTrigger = ({ children,activePath }: Props) => {
  const sx = classNames.bind(style);
  const location = useLocation()
  const activeMenuBoolean = activePath.includes(location.pathname)
  return (
    <NavigationMenu.Trigger
      className={sx("linkButton", "navigationMenuTrigger", {
        activeMenuButton: activeMenuBoolean
      })}
    >
      {children}
      <CaretDown color="var(--Link)" size={16} weight="bold" />
    </NavigationMenu.Trigger>
  );
};

export default NavMenuTrigger;
