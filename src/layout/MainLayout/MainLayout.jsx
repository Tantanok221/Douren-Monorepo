import React, { useEffect } from "react";
import { supabase } from "../../helper/supabase.js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useIntersection } from "@mantine/hooks";
import ArtistCard from "../../components/ArtistCard/ArtistCard.jsx";
function MainLayout() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["FF42"],
    queryFn: async ({ pageParam }) => {
      
      const { data, error } = await supabase
        .from("FF42")
        .select("")
        .range(pageParam  , pageParam);
      if (error) throw error;
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
  

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
  console.log(posts)
  if (!data) {
    return <div>Loading...</div>; // or some loading spinner
  }
  if (status === "error") {
    return <div>error</div>;
  }
  return (
    <>
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
      
    </>
  );
}
export default MainLayout;
