import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
export function infiniteQuery(table, ascending) {
  return useInfiniteQuery({
    queryKey: ["FF42", {table,ascending}],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .from("FF42")
        .select("")
        .range(pageParam, pageParam)
        .order(table, { ascending });

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
}
