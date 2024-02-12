import React, { useEffect } from "react";
import { supabase } from "../../helper/supabase.js";
import { infiniteQuery } from "../../helper/infiniteQuery.js";
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
import Animate from "../../animate/Animate.jsx"
import { useInViewport } from '@mantine/hooks';

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
  const initPosition = usePosition((state) => state.initPosition); 
  const { ref, inViewport } = useInViewport();
  
  console.log("Component Rerender");
  useEffect(() => {
    initPosition()
  },[table, ascending, tagFilter])
  window.scrollTo(0, position);
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
  useEffect(() => {
    fetchNextPage()
  },[inViewport])
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
    <motion.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    transition={{duration: 1, ease: "easeInOut"}}
    className={sx("MainContainer")}>
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
            index === posts.length - 5 &&
            search === ""
          ) {
            return (
              <ArtistCard
                key={`${item.author_name}`}
                data={item}
                ref={ref}
              />
            );
          }
          return <ArtistCard key={`${item.author_name}`} data={item} />;
        })}
        {}
      </motion.div>
      <ScrollToTop />
    </motion.div>
  );
}
export default Animate(Main);
