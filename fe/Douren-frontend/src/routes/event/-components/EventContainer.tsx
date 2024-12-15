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

const EventContainer = () => {
  const sx = classNames.bind(styles);
  const [sortSelect] = useSortSelectContext();
  const [searchColumn] = useSearchColumnContext();
  const [search] = useSearchContext();
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const allTag = tagFilter.map((val) => val.tag).join(",");
  const [page, setPage] = usePaginationContext();
  const id = trpc.eventArtist.getEventId.useQuery({
    eventName: Route.useParams().eventName,
  });
  const res = trpc.eventArtist.getEvent.useQuery({
    eventId: String(id?.data?.id),
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
                    <ArtistCard.HeaderContainer keys={Route.fullPath} />
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
