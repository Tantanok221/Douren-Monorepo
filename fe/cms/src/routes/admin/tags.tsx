import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PencilIcon, PlusIcon } from "lucide-react";

import { trpc } from "@/lib/trpc";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/tags")({
  component: AdminTagsPage,
});

function AdminTagsPage() {
  const authClient = useAuthContext();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const { data: roleData, isLoading: isRoleLoading } =
    trpc.admin.getMyRole.useQuery(undefined, {
      enabled: !!session,
    });

  const utils = trpc.useUtils();

  const { data: tags, isLoading: isTagsLoading } = trpc.tag.getTag.useQuery();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameTagName, setRenameTagName] = useState("");
  const [renameTarget, setRenameTarget] = useState<string | null>(null);

  const sortedTags = useMemo(() => {
    if (!tags) return [];
    return [...tags].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  }, [tags]);

  const createTagMutation = trpc.tag.createTag.useMutation({
    onSuccess: () => {
      toast.success("標籤已建立");
      utils.tag.getTag.invalidate();
      setCreateDialogOpen(false);
      setNewTagName("");
    },
    onError: (error) => {
      toast.error(`建立失敗: ${error.message}`);
    },
  });

  const renameTagMutation = trpc.tag.renameTag.useMutation({
    onSuccess: () => {
      toast.success("標籤已更新");
      utils.tag.getTag.invalidate();
      setRenameDialogOpen(false);
      setRenameTagName("");
      setRenameTarget(null);
    },
    onError: (error) => {
      toast.error(`更新失敗: ${error.message}`);
    },
  });

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 text-center">
        <p className="text-xl text-gray-600">你還沒登入</p>
      </div>
    );
  }

  if (isRoleLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 text-center">
        <p className="text-xl text-gray-600">載入中...</p>
      </div>
    );
  }

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

  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (!trimmed) {
      toast.error("請輸入標籤名稱");
      return;
    }
    createTagMutation.mutate({ tag: trimmed });
  };

  const openRenameDialog = (tag: string) => {
    setRenameTarget(tag);
    setRenameTagName(tag);
    setRenameDialogOpen(true);
  };

  const handleRenameTag = () => {
    if (!renameTarget) return;
    const trimmed = renameTagName.trim();
    if (!trimmed) {
      toast.error("請輸入標籤名稱");
      return;
    }
    if (trimmed === renameTarget) {
      toast.error("新標籤名稱需不同");
      return;
    }
    renameTagMutation.mutate({ currentTag: renameTarget, nextTag: trimmed });
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">標籤管理</CardTitle>
              <CardDescription>新增與更新標籤</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  新增標籤
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增標籤</DialogTitle>
                  <DialogDescription>
                    輸入新標籤的名稱以建立標籤
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tag-name">標籤名稱</Label>
                    <Input
                      id="tag-name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="例如: 原創"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateTag();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleCreateTag}
                    disabled={createTagMutation.isPending}
                  >
                    {createTagMutation.isPending ? "建立中..." : "建立"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isTagsLoading ? (
            <p className="text-center py-8 text-muted-foreground">載入中...</p>
          ) : sortedTags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>標籤</TableHead>
                  <TableHead>使用數量</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTags.map((tag) => (
                  <TableRow key={tag.tag ?? tag.index ?? "tag"}>
                    <TableCell className="font-medium">{tag.tag}</TableCell>
                    <TableCell>{tag.count ?? 0}</TableCell>
                    <TableCell>{tag.index ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRenameDialog(tag.tag ?? "")}
                        disabled={!tag.tag}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        重新命名
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              尚無標籤，點擊上方按鈕新增
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={renameDialogOpen}
        onOpenChange={(open) => {
          setRenameDialogOpen(open);
          if (!open) {
            setRenameTagName("");
            setRenameTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更新標籤</DialogTitle>
            <DialogDescription>修改標籤名稱</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename-tag">標籤名稱</Label>
              <Input
                id="rename-tag"
                value={renameTagName}
                onChange={(e) => setRenameTagName(e.target.value)}
                placeholder="例如: 插畫"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameTag();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleRenameTag}
              disabled={renameTagMutation.isPending}
            >
              {renameTagMutation.isPending ? "更新中..." : "更新"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
