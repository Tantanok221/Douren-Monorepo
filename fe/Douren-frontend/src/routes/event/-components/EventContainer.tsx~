import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { usePagination } from "@mantine/hooks";
import { trpc } from "@/helper/trpc.ts";
import { Route } from "@/routes/event/$eventName.tsx";
import {
  Pagination,
  usePaginationContext,
  useSearchColumnContext,
  useSearchContext,
  useSortSelectContext,
  ArtistCard, useTagFilterContext
} from "@lib/ui";
import { useLocation  } from "@tanstack/react-router";
import { useMemo } from "react";

const EventContainer = () => {
  const sx = classNames.bind(styles);
  const [sortSelect] = useSortSelectContext();
  const [searchColumn] = useSearchColumnContext();
  const [search] = useSearchContext();
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const allTag = useMemo(() => {
    if (!tagFilter.length) return ""; // Default to empty tags
    return tagFilter.map((val) => val.tag).join(",");
  }, [tagFilter]);

  const [page, setPage] = usePaginationContext();
  const location = useLocation();

  const res = trpc.eventArtist.getEvent.useQuery({
    eventName: Route.useParams().eventName,
    page: String(page),
    sort: sortSelect,
    search,
    tag: allTag,
    searchTable: searchColumn,
  });
  const pagination = usePagination({
    total: res?.data?.totalPage ?? 20,
    page,
    siblings: 2,
    onChange: setPage,
  });

  if (!res.data) return null;
  return (
    <>
      <div className={sx("ArtistContainer")}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 200: 1, 700: 2 }}>
          <Masonry gutter="32px">
            {res.data.data.map((item) => {
              return (
                <ArtistCard
                  key={`${item.boothName} ${item.author}`}
                  data={item}
                >
                  <ArtistCard.ImageContainer />
                  <ArtistCard.RightContainer>
                    <ArtistCard.HeaderContainer keys={location.pathname} />
                    <ArtistCard.TagContainer activeButton />
                    <ArtistCard.DayContainer />
                    <ArtistCard.LinkContainerWrapper>
                      <ArtistCard.DMButton />
                      <ArtistCard.LinkContainer />
                    </ArtistCard.LinkContainerWrapper>
                  </ArtistCard.RightContainer>
                </ArtistCard>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
        <div className={sx("paginationContainer")}>
          <Pagination pagination={pagination} />
        </div>
      </div>
    </>
  );
};

export default EventContainer;
