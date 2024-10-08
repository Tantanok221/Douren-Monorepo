import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import ArtistCard from "@lib/ui/src/components/ArtistCard";
import { useState } from "react";
import { useSort } from "@/stores/useSort.ts";
import { useSortSelectContextProvider } from "../-context/SortSelectContext/useSortSelectContextProvider";
import { useSearchColumnContext } from "../-context/SearchColumnContext/useSearchColumnContext";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { usePagination } from "@mantine/hooks";
import { useGetTotalPage } from "@/hooks/useGetTotalPage.ts";
import Pagination from "../../../components/Pagination/Pagination";
import { trpc } from "@/helper/trpc.ts";
import {Route } from "@/routes/event/$eventName.tsx";
import { useArtistQuery } from "@/hooks/useArtistQuery";

const useFetchEventId =  (eventName: string) => {
  return trpc.eventArtist.getEventId.useQuery({eventName})
}

const ArtistContainer = () => {
  const FETCH_COUNT = 40;
  const sx = classNames.bind(styles);
  const table = useSort((state) => state.table);
  const ascending = useSort((state) => state.ascending);
  const [sortSelect] = useSortSelectContextProvider();
  const [searchColumn] = useSearchColumnContext();
  const [page, setPage] = useState(1);
  const id = trpc.eventArtist.getEventId.useQuery({
    eventName: Route.useParams().eventName
  })
  const res = trpc.eventArtist.getEvent.useQuery({
    eventId: String(id?.data?.id),
    page: String(page),
    sort:  table + ","+ (ascending ? "asc" : "desc") ,
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
    <div className={sx("ArtistContainer")}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 200: 1, 700: 2 }}>
        <Masonry gutter="32px">
          {res.data.data.map((item, index) => {
            return (
              <ArtistCard key={`${item.boothName}`} data={item}>
                <ArtistCard.ImageContainer />
                <ArtistCard.RightContainer>
                  <ArtistCard.HeaderContainer keys={location.pathname} />
                  <ArtistCard.TagContainer activeButton />
                  <ArtistCard.DayContainer />
                  <ArtistCard.LinkContainer>
                    <ArtistCard.DMButton />
                  </ArtistCard.LinkContainer>
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
  );
};

export default ArtistContainer;
