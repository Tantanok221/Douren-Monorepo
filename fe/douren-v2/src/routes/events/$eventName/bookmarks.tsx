import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookmarkIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { ArtistCard } from "@/components/artist/ArtistCard";
import { Directory, useDirectoryStore } from "@/components/directory/Directory";
import { toArtistViewModel } from "@/data/adapters";
import { trpc } from "@/helper/trpc";
import { useBookmarks } from "@/hooks/useBookmarks";
import {
  toSortedBookmarkIds,
  useDirectoryQueryParams,
} from "@/hooks/useDirectoryQueryParams";

const BookmarksContent = ({ eventName }: { eventName: string }) => {
  const filters = useDirectoryStore((state) => state.filters);
  const setPage = useDirectoryStore((state) => state.setPage);
  const { bookmarks, toggle } = useBookmarks();
  const queryParams = useDirectoryQueryParams(filters);
  const bookmarkIds = useMemo(() => toSortedBookmarkIds(bookmarks), [bookmarks]);

  const bookmarksQuery = trpc.eventArtist.getEventByIds.useQuery(
    {
      eventName,
      artistIds: bookmarkIds,
      ...queryParams,
    },
    {
      enabled: bookmarkIds.length > 0,
    },
  );

  const artists = useMemo(
    () => bookmarksQuery.data?.data.map(toArtistViewModel) ?? [],
    [bookmarksQuery.data],
  );

  useEffect(() => {
    const totalPages = bookmarksQuery.data?.totalPage;
    if (totalPages && filters.page > totalPages) {
      setPage(totalPages);
    }
  }, [bookmarksQuery.data?.totalPage, filters.page, setPage]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-sans font-medium text-archive-text mb-2">
          Your Bookmarks
        </h2>
        <p className="text-sm font-mono text-archive-text/60">
          {bookmarksQuery.data?.totalCount ?? bookmarkIds.length}{" "}
          {(bookmarksQuery.data?.totalCount ?? bookmarkIds.length) === 1
            ? "artist"
            : "artists"}{" "}
          saved
        </p>
      </div>

      <Directory.DayTabs />
      <Directory.FilterBar />
      <Directory.List>
        {bookmarkIds.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-archive-text/40 border border-dashed border-archive-border rounded-sm">
            <BookmarkIcon className="w-8 h-8 mb-4 opacity-50" />
            <span className="font-mono text-lg mb-2">No bookmarks yet</span>
            <span className="text-sm">
              Bookmark artists from the directory to see them here
            </span>
          </div>
        ) : bookmarksQuery.isError ? (
          <Directory.EmptyState
            title="無法載入收藏"
            subtitle="請稍後重新整理頁面再試一次"
          />
        ) : bookmarksQuery.isPending || !bookmarksQuery.data ? (
          <div className="py-20 text-center text-archive-text/60 font-mono">
            Loading bookmarks...
          </div>
        ) : artists.length > 0 ? (
          artists.map((artist) => (
            <ArtistCard.Root
              key={artist.id}
              artist={artist}
              bookmarks={bookmarks}
              onBookmarkToggle={toggle}
              selectedTag={queryParams.selectedTag}
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
      {bookmarksQuery.data ? (
        <Directory.Pagination
          totalPages={bookmarksQuery.data.totalPage}
          totalItems={bookmarksQuery.data.totalCount}
          itemsPerPage={bookmarksQuery.data.pageSize}
        />
      ) : null}
    </>
  );
};

const BookmarksPage = () => {
  const { eventName } = Route.useParams();
  const navigate = useNavigate();
  const eventsQuery = trpc.eventArtist.getAllEvent.useQuery();
  const defaultEvent = trpc.event.getDefaultEvent.useQuery();
  const tagsQuery = trpc.tag.getTag.useQuery();

  const availableTags = useMemo(
    () => tagsQuery.data?.map((tag) => tag.tag) ?? [],
    [tagsQuery.data],
  );

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

  return (
    <Directory.Root availableTags={availableTags}>
      <BookmarksContent eventName={eventName} />
    </Directory.Root>
  );
};

export const Route = createFileRoute("/events/$eventName/bookmarks")({
  component: BookmarksPage,
});
