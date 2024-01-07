import {useInfiniteQuery} from "@tanstack/react-query"
import {supabase} from "./supabase"
export function infiniteQuery(){return useInfiniteQuery({
  queryKey: ["FF42"],
  queryFn: async ({ pageParam }) => {
    const { data, error } = await supabase
      .from("FF42")
      .select("")
      .range(pageParam, pageParam);
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
});}