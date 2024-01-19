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
import { useDebounce } from "@uidotdev/usehooks";
import { TagFilter } from "../../components/TagFilter/TagFilter.jsx";
import { useTagFilter } from "../../hooks/useTagFilter.js";
import { useSearch } from "../../hooks/useSearch.js";

function MainLayout() {
  const [posts, setPosts] = React.useState([]);
  const [filterPosts, setFilterPosts] = React.useState({empty: true});
  const search = useSearch((state) => state.search);
  const debounceSearch = useDebounce(search, 500);
  const table = useSort((state) => state.table);
  const ascending = useSort((state) => state.ascending);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const allFilter = useTagFilter((state) => state.allFilter);
  const tagFilter = useTagFilter((state) => state.tagFilter).flatMap((item) => item.tag);
  const tagFilterList = useTagFilter((state) => state.tagFilter)
  const removeAllTagFilter = useTagFilter((state) => state.removeAllTagFilter);
  console.log(filterPosts)
  useEffect(() => {
    setAllFilter();
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
  } = infiniteQuery(table, ascending);
  const lastPostRef = React.useRef(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry]);

  useEffect(() => {
    setPosts(data?.pages.flatMap((page) => page));
  }, [data]);
  // Search Function Implementation
  useEffect(() => {
    removeAllTagFilter()
    if (debounceSearch !== "") {
      let _data = async () => {
        let _data = await supabase
          .from("FF42")
          .select("*")
          .ilike("author_name", `%${debounceSearch}%`);
  
        return _data;
      };
      _data().then((result) => {
        
        setPosts(result?.data.flatMap((page) => page));
      });
    }
    if (debounceSearch === "") {
      setPosts(data?.pages.flatMap((page) => page));
    }
  }, [debounceSearch]);
  useEffect(() => {
    if(tagFilter.length === 0) {
      setFilterPosts({empty: true})
      return
    }
    let filterPost = posts.filter((item) => {
      if(tagFilter.length === 0) return item
      
      let tagList = item.tag?.split(",")
      if(tagList) {
        tagList.pop()
      }
      if(tagList === undefined) return false
      // Check if tagList contains tagFilter
      return tagList.some(tag => tagFilter.includes(tag))
      
    })
    setFilterPosts(filterPost)
  },[tagFilterList])

  if (!posts || !allFilter) {
    return <div>Loading...</div>; // or some loading spinner
  }
  if (status === "error") {
    return <div>error</div>;
  }
  const sx = classNames.bind(styles);
  return (
    <div className={sx("MainContainer")}>
      <form className={sx("searchContainer")}>
        <SearchBox />
      </form>
      <div className={sx("filterContainer")}>
        <SortSelect />
        <TagFilter />
      </div>
      <div className={sx("ArtistContainer")}>
        {(!filterPosts.empty ? filterPosts :posts).map((item, index) => {
          
          if (index === posts.length - (tagFilterList.length === 0 ? 5 : 1 ) && search === "") {
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
      </div>
    </div>
  );
}
export default MainLayout;
