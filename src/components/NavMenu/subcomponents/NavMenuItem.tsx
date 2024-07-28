import React, { ReactNode } from 'react'
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import style from "../Navbar.module.css";
import classNames from "classnames/bind";
type Props = {
  children: ReactNode
}
const NavMenuItem = ({children}: Props) => {
  const sx = classNames.bind(style);
  return (
    <NavigationMenu.Item className={sx("navigationMenuItem")}>{children}</NavigationMenu.Item>
  )
}

export default NavMenuItem