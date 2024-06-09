import classNames from "classnames/bind";
import styles from "../EventPage.module.css";
import ArtistCard from "../../../components/ArtistCard/ArtistCard";
import ImageContainer from "../../../components/ArtistCard/subcomponent/ImageContainer";
import RightContainer from "../../../components/ArtistCard/subcomponent/RightContainer";
import HeaderContainer from "../../../components/ArtistCard/subcomponent/HeaderContainer";
import TagContainer from "../../../components/TagContainer/TagContainer";
import DayContainer from "../../../components/ArtistCard/subcomponent/DayContainer";
import ArtistLinkContainer from "../../../components/ArtistCard/subcomponent/ArtistLinkContainer";
import DMButton from "../../../components/DMButton/component/DMButton";
import ArtistTagContainer from "../../../components/ArtistCard/subcomponent/ArtistTagContainer";
import ArtistDMButton from "../../../components/ArtistCard/subcomponent/ArtistDMButton";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSearch } from "../../../stores/useSearch";
import { useNextPageAvailable } from "../../../stores/useNextPageAvailable";
import { useLoaderData } from "react-router";
import { useTagFilter } from "../../../stores/useTagFilter";
import { useSort } from "../../../stores/useSort";
import { useEventIDQuery } from "../../../hooks/useEventIDQuery";
import { useSortSelectContextProvider } from "../context/SortSelectContext/useSortSelectContextProvider";
import { useSearchColumnContext } from "../context/SearchColumnContext/useSearchColumnContext";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface Props {}

const ArtistContainer = (props: Props) => {
  const FETCH_COUNT = 40;
  const [page, setPage] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(FETCH_COUNT);
  const sx = classNames.bind(styles);
  const search = useSearch((state) => state.search);
  const nextPageAvailable = useNextPageAvailable(
    (state) => state.nextPageAvailable,
  );
  const table = useSort((state) => state.table);
  const ascending = useSort((state) => state.ascending);
  const [sortSelect] = useSortSelectContextProvider();
  const [searchColumn] = useSearchColumnContext();
  const id = useLoaderData();

  const { data, status } = useEventIDQuery(
    id,
    start,
    end,
    sortSelect,
    searchColumn,
  );
  if (status === "error") {
    return <div>error</div>;
  }
  return (
    <div className={sx("ArtistContainer")}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 200: 1 ,700: 2 }}>
        <Masonry gutter="32px">
          {(data ?? []).map((item, index) => {
            return (
              <ArtistCard key={`${item.Booth_name}`} eventData={item}>
                <ImageContainer />
                <RightContainer>
                  <HeaderContainer keys={location.pathname} />
                  <ArtistTagContainer activeButton />
                  <DayContainer />
                  <ArtistLinkContainer>
                    <ArtistDMButton />
                  </ArtistLinkContainer>
                </RightContainer>
              </ArtistCard>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
      {data ? (
        <div className={sx("fetchContainer")}>
          {page !== 0 && search.length === 0 ? (
            <motion.button
              className={sx("fetchButton")}
              onClick={() => {
                setPage(page - 1);
                setStart(start - FETCH_COUNT);
                setEnd(end - FETCH_COUNT);
              }}
              whileHover={{
                backgroundColor: "#4D4D4D",
              }}
            >
              上一頁
            </motion.button>
          ) : null}
          {nextPageAvailable && search.length === 0 ? (
            <motion.button
              className={sx("fetchButton")}
              onClick={() => {
                setStart(start + FETCH_COUNT);
                setEnd(end + FETCH_COUNT);
                setPage(page + 1);
              }}
              whileHover={{
                backgroundColor: "#4D4D4D",
              }}
            >
              下一頁
            </motion.button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default ArtistContainer;
