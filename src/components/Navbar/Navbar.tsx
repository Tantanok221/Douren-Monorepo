import style from "./Navbar.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { CaretDown } from "@phosphor-icons/react";

interface Props {}

const Navbar = ({}: Props) => {
  const sx = classNames.bind(style);
  const location = useLocation();
  return (
    <IconContext.Provider value={{ color: "#AAAAAA", size: "1.75rem" }}>
      <NavigationMenu.Root className={sx("Navbar")}>
        <NavigationMenu.List className={sx("linkContainer")}>
          <NavigationMenu.Item className={sx("navigationMenuItem")}>
            <NavigationMenu.Trigger
              className={sx("linkButton", "navigationMenuTrigger",{
                activeMenuButton: location.pathname === '/' || location.pathname === 'event/ff43'
              } )}
            >
              場次
              <CaretDown color="var(--Link)" size={16} weight="bold" />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className={sx("navigationMenuContent",'navigationSubMenu')}>
              <NavigationMenu.Link
                asChild
              >
                <Link
                  to={"/"}
                  className={sx( 'subLinkButton',{
                    activeButton: location.pathname === "/",
                  })}
                >
                  FF42
                </Link>
              </NavigationMenu.Link>
              <NavigationMenu.Link
                asChild
              >
                <Link
                  to={"/event/ff43"}
                  className={sx( 'subLinkButton',{
                    activeButton: location.pathname === "/event/ff43",
                  })}
                >
                  FF43
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item className={sx("navigationMenuItem")}>
            <NavigationMenu.Link
              asChild
              className={sx("navigationMenuTrigger")}
            >
              <Link
                to={"/collection"}
                className={sx("linkButton", {
                  activeButton: location.pathname === "/collection",
                })}
              >
               我的收藏
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className={sx("navigationMenuItem")}>
            <NavigationMenu.Link
              asChild
              className={sx("navigationMenuTrigger")}
            >
              <Link
                to={"/artist"}
                className={sx("linkButton", {
                  activeButton: location.pathname === "/artist",
                })}
              >
                創作者
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className={sx("navigationMenuItem")}>
            <NavigationMenu.Link
              asChild
              className={sx("navigationMenuTrigger")}
            >
              <Link
                to={"/about"}
                className={sx("linkButton", {
                  activeButton: location.pathname === "/about",
                })}
              >
                關於我們
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>

      </NavigationMenu.Root>
      <div className={sx("padding")}></div>
    </IconContext.Provider>
  );
};

export default Navbar;
