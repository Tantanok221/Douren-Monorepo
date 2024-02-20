import { useInfiniteQuery,useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useSearch } from "../hooks/useSearch";
import { useNextPageAvailable } from "../hooks/useNextPageAvailable";


export function infiniteQuery(start,end,table, ascending, tagFilter) {
  const search = useSearch((state) => state.search);
  const nextPageAvailable = useNextPageAvailable((state) => state.nextPageAvailable);
  const setNextPageAvailable = useNextPageAvailable((state) => state.setNextPageAvailable);

  return useQuery({
    queryKey: [
      "FF42",
      search.length === 0,
      { table, ascending },
      { tagFilter },
      {start,end}
    ],
    queryFn: async () => {
      let filterEmpty = tagFilter.length === 0;
      

      let query = supabase.from("FF42").select("");
      if (!filterEmpty) {
        let conditions = tagFilter.map((tag) => `tag.ilike.%${tag}%`);
        conditions = conditions.join(",");
        query = query.or(conditions);
      }
      query = query.order(table, { ascending }).range(start, end +1);
      console.log(start,end)
      const { data, error } = await query;
      console.log(data.length)
      console.log(end - start + 1)
      if(data.length < end - start + 1) {
        setNextPageAvailable(false)
      }
      console.log(data)
      if (error) throw error;
      if(filterEmpty) {
        data.pop()
      }
      return data;
    },
    keepPreviousData: true,
    enabled: search.length === 0,
    refetchOnWindowFocus: false,
  });
}
