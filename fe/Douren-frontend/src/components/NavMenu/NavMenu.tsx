import React, { ReactNode } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import style from "./Navbar.module.css";
import classNames from "classnames/bind";
import { IconContext } from "@phosphor-icons/react";
import NavMenuContent from "./subcomponents/NavMenuContent";
import NavMenuItem from "./subcomponents/NavMenuItem";
import NavMenuTrigger from "./subcomponents/NavMenuTrigger";
import NavMenuLink from "./subcomponents/NavMenuLink";
import NavMenuList from "./subcomponents/NavMenuList";
import NavMenuSubLink from "./subcomponents/NavMenuSubLink";
import NavMenuItemWithLink from "./subcomponents/NavMenuItemWithLink";
type Props = {
  children: ReactNode;
};
const NavMenu = ({ children }: Props) => {
  const sx = classNames.bind(style);
  return (
    <IconContext.Provider value={{ color: "#AAAAAA", size: "1.75rem" }}>
      <NavigationMenu.Root className={sx("Navbar")}>
        {children}
      </NavigationMenu.Root>
      <div className={sx("padding")}></div>
    </IconContext.Provider>
  );
};

NavMenu.Content = NavMenuContent;
NavMenu.Item = NavMenuItem;
NavMenu.Trigger = NavMenuTrigger;
NavMenu.Link = NavMenuLink;
NavMenu.List = NavMenuList;
NavMenu.SubLink = NavMenuSubLink;
NavMenu.ItemWithLink = NavMenuItemWithLink;
export default NavMenu;
