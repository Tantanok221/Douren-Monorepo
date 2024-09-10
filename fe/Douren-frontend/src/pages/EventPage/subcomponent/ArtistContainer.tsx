import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import ArtistCard from "../../../components/ArtistCard/ArtistCard";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSearch } from "../../../stores/useSearch";
import { useNextPageAvailable } from "../../../stores/useNextPageAvailable";
import { useLoaderData } from "react-router-dom";
import { useTagFilter } from "../../../stores/useTagFilter";
import { useSort } from "../../../stores/useSort";
import { useEventIDQuery } from "../../../hooks/useEventIDQuery";
import { useSortSelectContextProvider } from "../context/SortSelectContext/useSortSelectContextProvider";
import { useSearchColumnContext } from "../context/SearchColumnContext/useSearchColumnContext";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { usePagination } from "@mantine/hooks";
import { useGetTotalPage } from "../../../hooks/useGetTotalPage";
import Pagination from "../../../components/Pagination/Pagination";
import NavbarMargin from "../../../components/NavMenu/subcomponents/NavbarMargin";

interface Props {}

const ArtistContainer = (props: Props) => {
  const FETCH_COUNT = 40;
  const sx = classNames.bind(styles);
  const table = useSort((state) => state.table);
  const ascending = useSort((state) => state.ascending);
  const [sortSelect] = useSortSelectContextProvider();
  const [searchColumn] = useSearchColumnContext();
  const id = useLoaderData();
  const [page, setPage] = useState(1);
  const totalCount = useGetTotalPage("Event_DM", "event_id=eq." + id);
  const totalPage = Math.ceil((totalCount as number) / FETCH_COUNT);
  const pagination = usePagination({
    total: totalPage,
    page,
    siblings: 2,
    onChange: setPage,
  });
  const { data, status } = useEventIDQuery(
    id,
    sortSelect,
    searchColumn,
    page,
    FETCH_COUNT
  );
  if (status === "error") {
    return <div>error</div>;
  }
  return (
    <div className={sx("ArtistContainer")}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 200: 1, 700: 2 }}>
        <Masonry gutter="32px">
          {(data ?? []).map((item, index) => {
            return (
              <ArtistCard key={`${item.Booth_name}`} eventData={item}>
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
