import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PlusIcon, TrashIcon, StarIcon } from "lucide-react";

import { trpc } from "@/lib/trpc";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export const Route = createFileRoute("/admin/events")({
  component: AdminEventsPage,
});

function AdminEventsPage() {
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();
  const { data: roleData, isLoading: isRoleLoading } =
    trpc.admin.getMyRole.useQuery(undefined, {
      enabled: !!session,
    });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEventName, setNewEventName] = useState("");

  const utils = trpc.useUtils();

  const { data: events, isLoading: isEventsLoading } =
    trpc.eventArtist.getAllEvent.useQuery();

  const createEventMutation = trpc.event.createEvent.useMutation({
    onSuccess: () => {
      toast.success("活動已建立");
      utils.eventArtist.getAllEvent.invalidate();
      setCreateDialogOpen(false);
      setNewEventName("");
    },
    onError: (error) => {
      toast.error(`建立失敗: ${error.message}`);
    },
  });

  const deleteEventMutation = trpc.event.deleteEvent.useMutation({
    onSuccess: () => {
      toast.success("活動已刪除");
      utils.eventArtist.getAllEvent.invalidate();
    },
    onError: (error) => {
      toast.error(`刪除失敗: ${error.message}`);
    },
  });

  const setDefaultMutation = trpc.event.setDefaultEvent.useMutation({
    onSuccess: () => {
      toast.success("已設定為預設活動");
      utils.eventArtist.getAllEvent.invalidate();
    },
    onError: (error) => {
      toast.error(`設定失敗: ${error.message}`);
    },
  });

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
        <Button variant="outline" asChild>
          <Link to="/">返回首頁</Link>
        </Button>
      </div>
    );
  }

  const handleCreateEvent = () => {
    if (!newEventName.trim()) {
      toast.error("請輸入活動名稱");
      return;
    }
    createEventMutation.mutate({ name: newEventName.trim() });
  };

  const handleDeleteEvent = (id: number) => {
    deleteEventMutation.mutate({ id });
  };

  const handleSetDefault = (id: number) => {
    setDefaultMutation.mutate({ id });
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">活動管理</CardTitle>
              <CardDescription>管理所有活動，設定預設活動</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  新增活動
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增活動</DialogTitle>
                  <DialogDescription>
                    輸入新活動的名稱以建立活動
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">活動名稱</Label>
                    <Input
                      id="name"
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      placeholder="例如: FF42"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateEvent();
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
                    onClick={handleCreateEvent}
                    disabled={createEventMutation.isPending}
                  >
                    {createEventMutation.isPending ? "建立中..." : "建立"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isEventsLoading ? (
            <p className="text-center py-8 text-muted-foreground">載入中...</p>
          ) : events && events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>名稱</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.id}</TableCell>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>
                      {event.isDefault && (
                        <Badge variant="default">
                          <StarIcon className="h-3 w-3 mr-1" />
                          預設
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!event.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(event.id)}
                            disabled={setDefaultMutation.isPending}
                          >
                            <StarIcon className="h-4 w-4 mr-1" />
                            設為預設
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <TrashIcon className="h-4 w-4 mr-1" />
                              刪除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>確認刪除</AlertDialogTitle>
                              <AlertDialogDescription>
                                你確定要刪除活動 "{event.name}"
                                嗎？此操作無法復原。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEvent(event.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              尚無活動，點擊上方按鈕新增
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
