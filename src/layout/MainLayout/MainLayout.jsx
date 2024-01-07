import React, { useEffect } from "react";
import { supabase } from "../../helper/supabase.js";
import {  useQuery } from "@tanstack/react-query";
import { infiniteQuery } from "../../helper/infiniteQuery.js";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useIntersection } from "@mantine/hooks";
import ArtistCard from "../../components/ArtistCard/ArtistCard.jsx";
import classNames from "classnames/bind";
import styles from "./style.module.css";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";

function MainLayout() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = infiniteQuery()
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
  const posts = data?.pages.flatMap((page) => page);
  // * Non Infinite Query Way
  // const {data,status} = useQuery({queryKey: "FF42All",queryFn: async () => {
  //   const  data  = await supabase.from("FF42").select("*");
  //   return data;
  // }})
  // const posts = data?.data.flatMap((page) => page);
  
  if (!data) {
    return <div>Loading...</div>; // or some loading spinner
  }
  if (status === "error") {
    return <div>error</div>;
  }
  const sx = classNames.bind(styles);
  return (
    <div className={sx("MainContainer")}>
      
      <div className={sx("ArtistContainer")}>
        {posts.map((item, index) => {
          if (index === posts.length - 1) {
            return (
              <ArtistCard
                key={item.id}
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
