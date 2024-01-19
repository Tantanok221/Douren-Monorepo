import React, { useEffect } from "react";
import { supabase } from "../../helper/supabase.js";
import { useQuery } from "@tanstack/react-query";
import { infiniteQuery } from "../../helper/infiniteQuery.js";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useIntersection } from "@mantine/hooks";
import ArtistCard from "../../components/ArtistCard/ArtistCard.jsx";
import classNames from "classnames/bind";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";
import SortSelect from "../../components/SortSelect/SortSelect.jsx";
import styles from "./style.module.css";
import { useFilter } from "../../hooks/useFilter.js";
import { useDebounce } from "@uidotdev/usehooks";
import { TagFilter } from "../../components/TagFilter/TagFilter.jsx";
import { useTagFilter } from "../../hooks/useTagFilter.js";

function MainLayout() {
  const [posts, setPosts] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const debounceSearch = useDebounce(search, 500);
  const table = useFilter((state) => state.table);
  const ascending = useFilter((state) => state.ascending);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
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
    console.log(debounceSearch);
    if (debounceSearch !== "") {
      let _data = async () => {
        let _data = await supabase
          .from("FF42")
          .select("*")
          .like("author_name", `%${debounceSearch}%`);

        return _data;
      };
      _data().then((result) => {
        setPosts(result?.data.flatMap((page) => page));
      });
    }
    if (debounceSearch === "") {
      console.log(data);
      setPosts(data?.pages.flatMap((page) => page));
    }
  }, [debounceSearch]);

  if (!posts) {
    return <div>Loading...</div>; // or some loading spinner
  }
  if (status === "error") {
    return <div>error</div>;
  }
  const sx = classNames.bind(styles);
  return (
    <div className={sx("MainContainer")}>
      <form className={sx("searchContainer")}>
        <SearchBox setSearch={setSearch} />
      </form>
      <div className={sx("filterContainer")}>
        <SortSelect />
        <TagFilter />
      </div>
      <div className={sx("ArtistContainer")}>
        {posts.map((item, index) => {
          if (index === posts.length - 1 && search === "") {
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
