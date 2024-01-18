import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
export function infiniteQuery(table, ascending) {
  return useInfiniteQuery({
    queryKey: ["FF42", {table,ascending}],
    queryFn: async ({ pageParam }) => {
      const {start,limit} = pageParam
      const { data, error } = await supabase
        .from("FF42")
        .select("")
        .range(start, start + limit - 1)
        .order(table, { ascending });

      if (error) throw error;
      return data;
    },
    initialPageParam: {start:1, limit: 20},
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return {start: lastPageParam.start + lastPageParam.limit, limit: 50 };
    },
  });
}
