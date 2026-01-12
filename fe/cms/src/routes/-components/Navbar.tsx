import { NavMenu } from "@lib/ui";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { useNavigate } from "@tanstack/react-router";

export const Navbar = () => {
  const authClient = useAuthContext();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/login" });
        },
      },
    });
  };

  return (
    <NavMenu>
      <NavMenu.List>
        <NavMenu.ItemWithLink path={"/"}>首頁</NavMenu.ItemWithLink>
        <NavMenu.ItemWithLink path={"/new"}>新增</NavMenu.ItemWithLink>
        {session ? (
          <NavMenu.Item>
            <button
              onClick={handleSignOut}
              className="text-tag-text font-sans text-[1.125rem] font-semibold p-4 flex gap-4 rounded-lg hover:bg-sidebar-active cursor-pointer bg-transparent border-none"
            >
              登出
            </button>
          </NavMenu.Item>
        ) : (
          <NavMenu.ItemWithLink path={"/login"}>登入</NavMenu.ItemWithLink>
        )}
      </NavMenu.List>
    </NavMenu>
  );
};
