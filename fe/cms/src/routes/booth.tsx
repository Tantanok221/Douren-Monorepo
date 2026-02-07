import { useEffect, useMemo, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";
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

export const Route = createFileRoute("/booth")({
  beforeLoad: async ({ context }) => {
    const session = await context.authClient.getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: BoothViewPage,
});

function BoothViewPage() {
  const eventsQuery = trpc.eventArtist.getAllEvent.useQuery();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedEventId) return;
    if (!eventsQuery.data || eventsQuery.data.length === 0) return;
    setSelectedEventId(eventsQuery.data[0].id);
  }, [eventsQuery.data, selectedEventId]);

  const selectedEvent = useMemo(
    () =>
      eventsQuery.data?.find((event) => event.id === selectedEventId) ?? null,
    [eventsQuery.data, selectedEventId],
  );

  const boothViewQuery = trpc.eventArtist.getBoothViewByEventId.useQuery(
    { eventId: selectedEventId ?? 0 },
    { enabled: !!selectedEventId },
  );

  return (
    <div className="flex flex-col w-full gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">攤位檢視</CardTitle>
          <CardDescription>
            查看指定活動的攤位資訊與所屬繪師清單
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <label
              htmlFor="event-selector"
              className="text-sm font-medium text-stone-300"
            >
              選擇活動
            </label>
            <select
              id="event-selector"
              className="h-9 rounded-md border border-stone-700 bg-stone-900 px-3 text-sm text-stone-100"
              value={selectedEventId ?? ""}
              onChange={(event) => setSelectedEventId(Number(event.target.value))}
            >
              {eventsQuery.data?.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          {boothViewQuery.isLoading ? (
            <p className="text-muted-foreground">載入攤位資料中...</p>
          ) : boothViewQuery.data && boothViewQuery.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>攤位名稱</TableHead>
                  <TableHead>第一天位置</TableHead>
                  <TableHead>第二天位置</TableHead>
                  <TableHead>第三天位置</TableHead>
                  <TableHead>繪師</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boothViewQuery.data.map((booth) => (
                  <TableRow key={booth.id}>
                    <TableCell className="font-medium">{booth.name}</TableCell>
                    <TableCell>{booth.locationDay01 || "-"}</TableCell>
                    <TableCell>{booth.locationDay02 || "-"}</TableCell>
                    <TableCell>{booth.locationDay03 || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {booth.artists.length > 0 ? (
                          booth.artists.map((artist) => (
                            <button
                              key={`${booth.id}-${artist.artistId}`}
                              type="button"
                              className="rounded border border-stone-700 px-2 py-1 text-xs text-stone-100 hover:bg-stone-800"
                              onClick={() => {
                                toast.info(
                                  `繪師 ${artist.artistName} 的活動編輯導向功能開發中`,
                                );
                              }}
                            >
                              {artist.artistName}
                            </button>
                          ))
                        ) : (
                          <span className="text-stone-400 text-xs">無繪師</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">此活動尚無攤位資料</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
