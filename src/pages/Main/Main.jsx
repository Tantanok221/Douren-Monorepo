import React, { useEffect } from "react";
import { supabase } from "../../helper/supabase.js";
import { infiniteQuery } from "../../helper/infiniteQuery.js";
import { useIntersection } from "@mantine/hooks";
import ArtistCard from "../../components/ArtistCard/ArtistCard.jsx";
import classNames from "classnames/bind";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";
import SortSelect from "../../components/SortSelect/SortSelect.jsx";
import styles from "./style.module.css";
import { useSort } from "../../hooks/useSort.js";
import { TagFilter } from "../../components/TagFilter/TagFilter.jsx";
import { useTagFilter } from "../../hooks/useTagFilter.js";
import { useSearch } from "../../hooks/useSearch.js";
import { useCollection } from "../../hooks/useCollection.js";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.jsx";
import { usePosition } from "../../hooks/usePosition.js";

function Main() {
  const [posts, setPosts] = React.useState(false);
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
  window.scrollTo(0, position);
  console.log("Component Rerender");
  useEffect(() => {
    setAllFilter();
    initCollection();
  }, []);
  // Infinite Scroll

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = infiniteQuery(table, ascending, tagFilter);
  const lastPostRef = React.useRef(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  useEffect(() => {
    if (entry?.isIntersecting) {
      let pos = document.documentElement.scrollTop;
      console.log(position);
      setPosition(pos);
      fetchNextPage();
    }
  }, [entry]);

  useEffect(() => {
    setPosts(data?.pages.flatMap((page) => page));
  }, [data]);
  // Search Function Implementation
  useEffect(() => {
    if (search.length > 0) {
      setTimeout(async () => {
        let query = supabase.from("FF42").select("");

        if (!tagFilter.length === 0) {
          const conditions = tagFilter
            .map((tag) => `(tag.ilike.%${tag}%)`)
            .join(",");
          query = query.or(conditions);
        }
        query = query.filter("author_name", "ilike", `%${search}%`);

        query = query.order(table, { ascending });
        let { data, error } = await query;
        console.log(tagFilter);
        if (tagFilter.length !== 0) {
          // console.log(data)
          data = data.filter((item) => {
            // console.log(item)
            if (!item.tag) return false;
            const tag = item.tag.split(",");
            tag.pop();
            // console.log(tag);
            return tagFilter.every((filter) => tag.includes(filter));
          });
        }
        console.log(data);
        setPosts(data);
      }, 0);
    }
  }, [search, tagFilterList, table]);
  console.log(posts);
  if (isFetching) {
    return <div>Fetching...</div>;
  }

  if (search.length > 0 ? false : !posts || !allFilter) {
    console.log(posts);
    console.log(status);
    return <div>Loading...</div>; // or some loading spinner
  }
  if (status === "error") {
    return <div>error</div>;
  }
  if (!hasNextPage) {
    console.log("No more data");
  }
  const sx = classNames.bind(styles);
  return (
    <div className={sx("MainContainer")}>
      {/* <button onClick={fetchNextPage}>Fetch Next Page</button> */}
      <form id="top" className={sx("searchContainer")}>
        <SearchBox />
      </form>
      <div className={sx("filterContainer")}>
        <SortSelect />
        <TagFilter />
      </div>
      <motion.div className={sx("ArtistContainer")}>
        {(posts ?? []).map((item, index) => {
          if (
            index === posts.length - (tagFilterList.length === 0 ? 5 : 1) &&
            search === ""
          ) {
            return (
              <ArtistCard
                key={item.id + index + item + table + ascending}
                data={item}
                passRef={ref}
                ref={lastPostRef}
              />
            );
          }
          return <ArtistCard key={item.id} data={item} />;
        })}
        {}
      </motion.div>
      <ScrollToTop />
    </div>
  );
}
export default Main;
