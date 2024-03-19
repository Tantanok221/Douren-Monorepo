import React, { useEffect, useState } from "react";
import { supabase } from "../../helper/supabase.ts";
import { infiniteQuery } from "../../helper/infiniteQuery.ts";
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
import TagContainer from "../../components/ArtistCard/subcomponent/TagContainer";
import DayContainer from "../../components/ArtistCard/subcomponent/DayContainer";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer.tsx";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer.tsx";
import DMButton from "../../components/ArtistCard/subcomponent/DMButton";

function FF42() {
  const FETCH_COUNT = 40;
  const [posts, setPosts] = useState(false);
  const [page, setPage] = useState(0);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(FETCH_COUNT);
  const nextPageAvailable = useNextPageAvailable(
    (state) => state.nextPageAvailable
  );
  const search = useSearch((state) => state.search);
  const table = useSort((state) => state.table);
  const ascending = useSort((state) => state.ascending);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const allFilter = useTagFilter((state) => state.allFilter);
  const tagFilter = useTagFilter((state) => state.tagFilter).flatMap(
    (item) => item.tag
  );
  const tagFilterList = useTagFilter((state) => state.tagFilter);
  const initCollection = useCollection((state) => state.initCollection);
  const position = usePosition((state) => state.position);
  const setPosition = usePosition((state) => state.setPosition);
  const initPosition = usePosition((state) => state.initPosition);
  const initNextPageAvailable = useNextPageAvailable(
    (state) => state.initNextPageAvailable
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
  const { data, error, isFetching, status } = infiniteQuery(
    start,
    end,
    table,
    ascending,
    tagFilter
  );

  useEffect(() => {
    if (data?.length != 0) setPosts(data);
  }, [data]);
  // Search Function Implementation
  useEffect(() => {
    if (search.length > 0) {
      setTimeout(async () => {
        let query = supabase.from("FF42").select("");

        if (tagFilter.length !== 0) {
          const conditions = tagFilter
            .map((tag) => `(Tag.ilike.%${tag}%)`)
            .join(",");
          query = query.or(conditions);
        }
        query = query.filter("Booth_name", "ilike", `%${search}%`);

        query = query.order(table, { ascending });
        let { data, error } = await query;
        if (tagFilter.length !== 0) {
          data = data.filter((item) => {
            if (!item.tag) return false;
            const tag = item.tag.split(",");
            tag.pop();
            // console.log(tag);
            return tagFilter.every((filter) => tag.includes(filter));
          });
        }
        setPosts(data);
      }, 0);
    }
  }, [search, tagFilterList, table]);
  if (isFetching) {
    return <div>Fetching...</div>;
  }
  if (search.length > 0 ? false : !posts || !allFilter) {
    return <div>Loading...</div>; // or some loading spinner
  }
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
        {(posts ?? []).map((item, index) => {
          
          return (
            <ArtistCard key={`${item.uuid}`} data={item}>
              <ImageContainer />
              <RightContainer>
                <HeaderContainer bookmarkEnabled={true}/>
                <TagContainer />
                <DayContainer />
                <ArtistLinkContainer>
                  <DMButton />
                </ArtistLinkContainer>
              </RightContainer>
            </ArtistCard>
          );
        })}
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
      </div>
      <ScrollToTop />
    </motion.div>
  );
}
export default Animate(FF42);
