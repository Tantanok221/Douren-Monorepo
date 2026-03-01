import { Link, useNavigate } from "@tanstack/react-router";
import {
  PlusIcon,
  CalendarIcon,
  LayoutListIcon,
  LogOutIcon,
  LogInIcon,
  UserIcon,
  UsersIcon,
  TagsIcon,
} from "lucide-react";

import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const authClient = useAuthContext();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const { data: roleData } = trpc.admin.getMyRole.useQuery(undefined, {
    enabled: !!session,
  });

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-stone-800 bg-stone-950/95 backdrop-blur supports-[backdrop-filter]:bg-stone-950/80">
      <div className="flex h-14 items-center px-6">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-stone-50">Douren CMS</span>
        </Link>

        {/* Navigation Links - Centered */}
        <NavigationMenu
          viewport={false}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className={cn(
                    navigationMenuTriggerStyle,
                    "gap-2 text-stone-300",
                  )}
                >
                  <UserIcon className="h-4 w-4" />
                  繪師
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {session && roleData?.isAdmin && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin/events"
                      className={cn(
                        navigationMenuTriggerStyle,
                        "gap-2 text-stone-300",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      活動管理
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin/tags"
                      className={cn(
                        navigationMenuTriggerStyle,
                        "gap-2 text-stone-300",
                      )}
                    >
                      <TagsIcon className="h-4 w-4" />
                      標籤管理
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin/users"
                      className={cn(
                        navigationMenuTriggerStyle,
                        "gap-2 text-stone-300",
                      )}
                    >
                      <UsersIcon className="h-4 w-4" />
                      使用者管理
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

            {session && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/booth"
                    className={cn(
                      navigationMenuTriggerStyle,
                      "gap-2 text-stone-300",
                    )}
                  >
                    <LayoutListIcon className="h-4 w-4" />
                    攤位檢視
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {session && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/new"
                    className={cn(
                      navigationMenuTriggerStyle,
                      "gap-2 text-stone-300",
                    )}
                  >
                    <PlusIcon className="h-4 w-4" />
                    新增繪師
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {session ? (
            <>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-stone-300 hover:text-stone-50"
              >
                <LogOutIcon className="h-4 w-4" />
                <span className="hidden sm:inline">登出</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/login" })}
              className="gap-2 text-stone-300 hover:text-stone-50"
            >
              <LogInIcon className="h-4 w-4" />
              登入
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
