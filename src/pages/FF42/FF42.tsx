import React, { useEffect, useState } from "react";
import { FF42Query } from "../../helper/FF42Query.ts";
import ArtistCard from "../../components/ArtistCard/ArtistCard.tsx";
import classNames from "classnames/bind";
import SearchBox from "../../components/SearchBox/SearchBox.tsx";
import SortSelect from "../../components/SortSelect/SortSelect.tsx";
import styles from "./style.module.css";
import { useSort } from "../../hooks/useSort.ts";
import { TagFilter } from "../../components/TagFilter/TagFilter.tsx";
import { useTagFilter } from "../../hooks/useTagFilter.ts";
import { useSearch } from "../../hooks/useSearch.ts";
import { useCollection } from "../../hooks/useCollection.ts";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import { usePosition } from "../../hooks/usePosition.ts";
import Animate from "../../animate/Animate.tsx";
import { useNextPageAvailable } from "../../hooks/useNextPageAvailable.ts";
import ImageContainer from "../../components/ArtistCard/subcomponent/ImageContainer.tsx";
import TagContainer from "../../components/ArtistCard/subcomponent/ArtistTagContainer.tsx";
import DayContainer from "../../components/ArtistCard/subcomponent/DayContainer.tsx";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer.tsx";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer.tsx";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer.tsx";
import DMButton from "../../components/ArtistCard/subcomponent/ArtistDMButton.tsx";
function FF42() {
  const FETCH_COUNT = 40;
  const [page, setPage] = useState(0);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(FETCH_COUNT);
  const nextPageAvailable = useNextPageAvailable(
    (state) => state.nextPageAvailable,
  );
  const table = useSort((state) => state.table);
  const ascending = useSort((state) => state.ascending);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const allFilter = useTagFilter((state) => state.allFilter);
  const tagFilter = useTagFilter((state) => state.tagFilter).flatMap(
    (item) => item.tag,
  );
  const search = useSearch((state) => state.search);
  const resetSearch = useSearch((state) => state.resetSearch);
  const tagFilterList = useTagFilter((state) => state.tagFilter);
  const initCollection = useCollection((state) => state.initCollection);
  const position = usePosition((state) => state.position);
  const setPosition = usePosition((state) => state.setPosition);
  const initPosition = usePosition((state) => state.initPosition);
  const initNextPageAvailable = useNextPageAvailable(
    (state) => state.initNextPageAvailable,
  );
  useEffect(() => {
    initPosition();
  }, [table, ascending, tagFilter]);
  window.scrollTo(0, position);
  useEffect(() => {
    setAllFilter();
    initNextPageAvailable();
    initCollection();
  }, []);
  // Infinite Scroll
  const { data, error, isFetching, status } = FF42Query(
    start,
    end,
    table,
    ascending,
    tagFilter,
  );

  if (status === "error") {
    return <div>error</div>;
  }
  const sx = classNames.bind(styles);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={sx("MainContainer")}
    >
      <form id="top" className={sx("searchContainer")}>
        <SearchBox />
      </form>
      <div className={sx("filterContainer")}>
        <SortSelect />
        <TagFilter />
      </div>
      <div className={sx("ArtistContainer")}>
        {(data ?? []).map((item, index) => {
          return (
            <ArtistCard key={`${item.uuid}`} data={item}>
              <ImageContainer />
              <RightContainer>
                <HeaderContainer bookmarkEnabled />
                <TagContainer activeButton />
                <DayContainer />
                <ArtistLinkContainer>
                  <DMButton />
                </ArtistLinkContainer>
              </RightContainer>
            </ArtistCard>
          );
        })}
        {data ? <div className={sx("fetchContainer")}>
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
        </div>: null}
      </div>
      <ScrollToTop />
    </motion.div>
  );
}

const FF42Animate = Animate(FF42);
export default FF42Animate;
