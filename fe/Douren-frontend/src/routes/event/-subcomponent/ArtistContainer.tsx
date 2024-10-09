import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import ArtistCard from "@lib/ui/src/components/ArtistCard";
import { useState } from "react";
import { useSort } from "@/stores/useSort.ts";
import { useSortSelectContextProvider } from "../-context/SortSelectContext/useSortSelectContextProvider";
import { useSearchColumnContext } from "../-context/SearchColumnContext/useSearchColumnContext";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { usePagination } from "@mantine/hooks";
import Pagination from "../../../components/Pagination/Pagination";
import { trpc } from "@/helper/trpc.ts";
import {Route } from "@/routes/event/$eventName.tsx";


const ArtistContainer = () => {
  const sx = classNames.bind(styles);
  const [sortSelect] = useSortSelectContextProvider();
  const [searchColumn] = useSearchColumnContext();
  const [page, setPage] = useState(1);
  const id = trpc.eventArtist.getEventId.useQuery({
    eventName: Route.useParams().eventName
  })
  const res = trpc.eventArtist.getEvent.useQuery({
    eventId: String(id?.data?.id),
    page: String(page),
    sort:  sortSelect,
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
              <ArtistCard key={`${item.boothName} ${item.author}`} data={item}>
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
