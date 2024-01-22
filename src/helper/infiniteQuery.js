import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useSearch } from "../hooks/useSearch";

export function infiniteQuery(table, ascending, tagFilter) {
  const search = useSearch((state) => state.search);
  return useInfiniteQuery({
    queryKey: ["FF42",search.length === 0 ,{ table, ascending  }, {tagFilter}],
    queryFn: async ({ pageParam }) => {
      let filterEmpty = tagFilter.length === 0;
      const { start, limit } = pageParam;
      let query = supabase.from("FF42").select("");
      if (!filterEmpty) {
        let conditions = tagFilter.map(tag => `tag.ilike.%${tag}%`)
        conditions =  conditions.join(',')
        query = query.or(conditions);
      }
      
      query = query.range(start, start + limit - 1).order(table, { ascending });
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: search.length === 0,
    initialPageParam: { start: 1, limit: 20 },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return { start: lastPageParam.start + lastPageParam.limit, limit: 50 };
    },
  });
}
