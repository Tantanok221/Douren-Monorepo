import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

type UserRole = "admin" | "user";

function AdminUsersPage() {
  const authClient = useAuthContext();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const { data: roleData, isLoading: isRoleLoading } =
    trpc.admin.getMyRole.useQuery(undefined, {
      enabled: !!session,
    });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = trpc.admin.getUsers.useQuery(
    { search: search || undefined },
    { enabled: !!session },
  );

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onMutate: ({ userId }) => {
      setPendingUserId(userId);
    },
    onSuccess: () => {
      toast.success("已更新角色");
      utils.admin.getUsers.invalidate();
    },
    onError: (error) => {
      toast.error(`更新失敗: ${error.message}`);
    },
    onSettled: () => {
      setPendingUserId(null);
    },
  });

  const handleSearch = () => {
    setSearch(searchInput.trim());
  };

  const handleUpdateRole = (userId: string, role: UserRole) => {
    updateRoleMutation.mutate({ userId, role });
  };

  // Check authentication
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 text-center">
        <p className="text-xl text-gray-600">你還沒登入</p>
      </div>
    );
  }

  // Check loading state for role
  if (isRoleLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 text-center">
        <p className="text-xl text-gray-600">載入中...</p>
      </div>
    );
  }

  // Check admin permission
  if (!roleData?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 text-center gap-4">
        <p className="text-xl text-gray-600">你沒有權限訪問此頁面</p>
        <Button variant="outline" onClick={() => navigate({ to: "/" })}>
          返回首頁
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">使用者管理</CardTitle>
              <CardDescription>搜尋使用者並調整管理員權限</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                placeholder="搜尋姓名或 Email"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full sm:w-72"
              />
              <Button variant="outline" onClick={handleSearch}>
                搜尋
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isUsersLoading ? (
            <p className="text-center py-8 text-muted-foreground">載入中...</p>
          ) : isUsersError ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-muted-foreground">載入失敗，請稍後再試。</p>
              <p className="text-xs text-muted-foreground">
                {usersError.message}
              </p>
              <Button
                variant="outline"
                onClick={() => utils.admin.getUsers.invalidate()}
              >
                重新載入
              </Button>
            </div>
          ) : users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = session.user?.id === user.id;
                  const isPending =
                    updateRoleMutation.isPending && pendingUserId === user.id;
                  const nextRole: UserRole =
                    user.role === "admin" ? "user" : "admin";
                  const actionLabel =
                    user.role === "admin" ? "降級為一般使用者" : "提升為管理員";
                  const confirmLabel =
                    user.role === "admin" ? "一般使用者" : "管理員";

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "未命名"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" ? "管理員" : "一般使用者"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {isSelf ? (
                          <Button variant="outline" size="sm" disabled>
                            不可變更自己
                          </Button>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isPending}
                              >
                                {isPending ? "更新中..." : actionLabel}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  確認變更角色
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  你確定要將「{user.name || user.email}」變更為
                                  {confirmLabel}嗎？
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleUpdateRole(user.id, nextRole)
                                  }
                                  className="bg-stone-900 hover:bg-stone-800"
                                >
                                  確認
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              目前沒有符合條件的使用者
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
