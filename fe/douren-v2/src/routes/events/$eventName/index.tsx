import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Directory, useDirectoryStore } from "@/components/directory/Directory";
import { ArtistCard } from "@/components/artist/ArtistCard";
import { trpc } from "@/helper/trpc";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toArtistViewModel } from "@/data/adapters";
import { useDirectoryQueryParams } from "@/hooks/useDirectoryQueryParams";

const DirectoryContent = ({ eventName }: { eventName: string }) => {
  const filters = useDirectoryStore((state) => state.filters);
  const { bookmarks, toggle } = useBookmarks();
  const queryParams = useDirectoryQueryParams(filters);
  const artistsQuery = trpc.eventArtist.getEvent.useQuery({
    eventName,
    ...queryParams,
  });

  const artists = useMemo(() => {
    return artistsQuery.data?.data.map(toArtistViewModel) ?? [];
  }, [artistsQuery.data]);

  if (artistsQuery.isError) {
    return (
      <Directory.EmptyState
        title="無法載入創作者"
        subtitle="請稍後重新整理頁面再試一次"
      />
    );
  }

  if (!artistsQuery.data || artistsQuery.isPending) {
    return (
      <div className="py-20 text-center text-archive-text/60 font-mono">
        Loading artists...
      </div>
    );
  }

  return (
    <>
      <Directory.DayTabs />
      <Directory.FilterBar />
      <Directory.List>
        {artists.length > 0 ? (
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
            title="找不到創作者"
            subtitle="請嘗試調整您的篩選條件或搜尋關鍵字"
          />
        )}
      </Directory.List>
      <Directory.Pagination
        totalPages={artistsQuery.data.totalPage}
        totalItems={artistsQuery.data.totalCount}
        itemsPerPage={artistsQuery.data.pageSize}
      />
    </>
  );
};

const DirectoryPage = () => {
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
        to: "/events/$eventName",
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
      <DirectoryContent eventName={eventName} />
    </Directory.Root>
  );
};

export const Route = createFileRoute("/events/$eventName/")({
  component: DirectoryPage,
});
