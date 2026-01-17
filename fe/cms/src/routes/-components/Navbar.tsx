import { NavMenu } from "@lib/ui";

export const Navbar = () => {
  return (
    <NavMenu>
      <NavMenu.List>
        <NavMenu.ItemWithLink path={"/"}>首頁</NavMenu.ItemWithLink>
        <NavMenu.ItemWithLink path={"/new"}>新增</NavMenu.ItemWithLink>
      </NavMenu.List>
    </NavMenu>
  );
};
