import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
export function infiniteQuery(table, ascending, tagFilter) {
  return useInfiniteQuery({
    queryKey: ["FF42", { table, ascending, tagFilter }],
    queryFn: async ({ pageParam }) => {
      let filterEmpty = tagFilter.length === 0;
      const { start, limit } = pageParam;
      let query = supabase.from("FF42").select("");

      if (!filterEmpty) {
        const conditions = tagFilter.map(tag => `tag.ilike.%${tag}%`).join(',');
        query = query.or(conditions);
      }

      query = query.range(start, start + limit - 1).order(table, { ascending });
      const { data, error } = await query;
      console.log(data);
      if (error) throw error;
      return data;
    },
    initialPageParam: { start: 1, limit: 20 },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return { start: lastPageParam.start + lastPageParam.limit, limit: 50 };
    },
  });
}
