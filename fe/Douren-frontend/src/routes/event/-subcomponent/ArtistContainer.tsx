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
import {Route, useFetchEventId} from "@/routes/event/$eventName.tsx";

const ArtistContainer = () => {
  const FETCH_COUNT = 40;
  const sx = classNames.bind(styles);
  const table = useSort((state) => state.table);
  const ascending = useSort((state) => state.ascending);
  const [sortSelect] = useSortSelectContextProvider();
  const [searchColumn] = useSearchColumnContext();
  // const id = useLoaderData();
  const eventId = useFetchEventId(Route.useParams().eventName).data;
  console.log(eventId)
  const [page, setPage] = useState(1);
  const res = trpc.eventArtist.getEvent.useQuery({
    eventId,
    sort: sortSelect,
    page: String(page),
    tag: "",
    search: table + " " + ascending,
    searchTable: searchColumn,
  });
  console.log(res)
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
