import { NavMenu } from "@lib/ui";

export const Navbar = () => {
  return (
    <NavMenu>
      <NavMenu.List>
        <NavMenu.ItemWithLink path={""}>首頁</NavMenu.ItemWithLink>
      </NavMenu.List>
    </NavMenu>
  )
}