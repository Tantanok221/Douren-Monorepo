import React, { useEffect, useState } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard.tsx";
import classNames from "classnames/bind";
import SearchBox from "../../components/SearchBox/SearchBox.tsx";
import SortSelect from "../../components/SortSelect/SortSelect.tsx";
import styles from "./style.module.css";
import { useSort } from "../../stores/useSort.ts";
import { TagFilter } from "../../components/TagFilter/TagFilter.tsx";
import { useTagFilter } from "../../stores/useTagFilter.ts";
import { useSearch } from "../../stores/useSearch.ts";
import { useLegacyCollection } from "../../stores/useLegacyCollection.ts";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import { usePosition } from "../../stores/usePosition.ts";
import Animate from "../../animate/Animate.tsx";
import { useNextPageAvailable } from "../../stores/useNextPageAvailable.ts";
import { useFF42Query } from "../../hooks/useFF42Query.ts";
function FF42() {
  const FETCH_COUNT = 40;
  const [page, setPage] = useState(0);
  const [start, setStart] = useState(0);
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
  const initCollection = useLegacyCollection((state) => state.initCollection);
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
    initCollection("FF42 Collection");
  }, []);
  // Infinite Scroll
  const { data, error, isFetching, status } = useFF42Query(
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
        <div className={sx("sortSelect")}>
          <SortSelect />
        </div>
        <div className={sx("tagFilter")}>
          <TagFilter />
        </div>
      </div>
      <div className={sx("ArtistContainer")}>
        {(data ?? []).map((item, index) => {
          return (
            <ArtistCard key={`${item.uuid}`} legacyData={item}>
              <ArtistCard.ImageContainer />
              <ArtistCard.RightContainer>
                <ArtistCard.HeaderContainer keys="FF42 Collection" />
                <ArtistCard.TagContainer activeButton />
                <ArtistCard.DayContainer />
                <ArtistCard.LinkContainer>
                  <ArtistCard.DMButton />
                </ArtistCard.LinkContainer>
              </ArtistCard.RightContainer>
            </ArtistCard>
          );
        })}
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
      <ScrollToTop />
    </motion.div>
  );
}

const FF42Animate = Animate(FF42);
export default FF42Animate;
