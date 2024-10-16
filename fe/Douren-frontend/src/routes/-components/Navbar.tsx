import { NavMenu } from "@lib/ui";

export const Navbar = () => {
  return (
    <NavMenu>
      <NavMenu.List>
        <NavMenu.Item>
          <NavMenu.Trigger activePath={["/", "/event/FF43"]}>
            場次
          </NavMenu.Trigger>
          <NavMenu.Content>
            <NavMenu.SubLink path="/event/FF43">FF43</NavMenu.SubLink>
          </NavMenu.Content>
        </NavMenu.Item>
        <NavMenu.ItemWithLink path="/collection">我的收藏</NavMenu.ItemWithLink>
        <NavMenu.ItemWithLink path="/artist">創作者</NavMenu.ItemWithLink>
        <NavMenu.ItemWithLink path="/about">關於我們</NavMenu.ItemWithLink>
      </NavMenu.List>
    </NavMenu>
  );
};

