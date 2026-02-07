import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookmarkIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { ArtistCard } from "@/components/artist/ArtistCard";
import { Directory } from "@/components/directory/Directory";
import { dedupeArtistsById, toArtistViewModel } from "@/data/adapters";
import { trpc } from "@/helper/trpc";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toSortedBookmarkIds } from "@/hooks/useDirectoryQueryParams";

const BOOKMARKS_QUERY = {
  page: "1",
  sort: "Author_Main(Author),asc",
  searchTable: "Author_Main.Author",
} as const;

const BookmarksContent = ({ eventName }: { eventName: string }) => {
  const { bookmarks, toggle } = useBookmarks();
  const bookmarkIds = useMemo(
    () => toSortedBookmarkIds(bookmarks),
    [bookmarks],
  );

  const bookmarksQuery = trpc.eventArtist.getEventByIds.useQuery(
    {
      eventName,
      artistIds: bookmarkIds,
      ...BOOKMARKS_QUERY,
    },
    {
      enabled: bookmarkIds.length > 0,
    },
  );

  const artists = useMemo(
    () =>
      dedupeArtistsById(bookmarksQuery.data?.data.map(toArtistViewModel) ?? []),
    [bookmarksQuery.data],
  );

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-sans font-medium text-archive-text mb-2">
          我的收藏
        </h2>
        <p className="text-sm font-mono text-archive-text/60">
          已收藏 {bookmarksQuery.data?.totalCount ?? bookmarkIds.length}{" "}
          位創作者
        </p>
      </div>

      <Directory.List>
        {bookmarkIds.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-archive-text/40 border border-dashed border-archive-border rounded-sm">
            <BookmarkIcon className="w-8 h-8 mb-4 opacity-50" />
            <span className="font-mono text-lg mb-2">目前尚無收藏</span>
            <span className="text-sm">
              可在創作者列表中加入收藏，之後會顯示在這裡
            </span>
          </div>
        ) : bookmarksQuery.isError ? (
          <Directory.EmptyState
            title="無法載入收藏"
            subtitle="請稍後重新整理頁面再試一次"
          />
        ) : bookmarksQuery.isPending || !bookmarksQuery.data ? (
          <div className="py-20 text-center text-archive-text/60 font-mono">
            載入收藏中...
          </div>
        ) : artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard.Root
              key={artist.id}
              artist={artist}
              bookmarks={bookmarks}
              onBookmarkToggle={toggle}
            >
              <ArtistCard.Summary />
              <ArtistCard.Details />
            </ArtistCard.Root>
          ))
        ) : (
          <Directory.EmptyState
            title="找不到收藏創作者"
            subtitle="請嘗試調整您的篩選條件或搜尋關鍵字"
          />
        )}
      </Directory.List>
    </>
  );
};

const BookmarksPage = () => {
  const { eventName } = Route.useParams();
  const navigate = useNavigate();
  const eventsQuery = trpc.eventArtist.getAllEvent.useQuery();
  const defaultEvent = trpc.event.getDefaultEvent.useQuery();

  useEffect(() => {
    if (!eventsQuery.data?.length || !defaultEvent.data) return;
    const isValid = eventsQuery.data.some((event) => event.name === eventName);
    if (!isValid) {
      navigate({
        to: "/events/$eventName/bookmarks",
        params: { eventName: defaultEvent.data.name },
        replace: true,
      });
    }
  }, [eventsQuery.data, defaultEvent.data, eventName, navigate]);

  if (eventsQuery.isError && defaultEvent.isError) {
    return (
      <Directory.EmptyState
        title="無法載入活動"
        subtitle="請稍後重新整理頁面再試一次"
      />
    );
  }

  return <BookmarksContent eventName={eventName} />;
};

export const Route = createFileRoute("/events/$eventName/bookmarks")({
  component: BookmarksPage,
});
