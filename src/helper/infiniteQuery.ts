import { useInfiniteQuery,useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useSearch } from "../hooks/useSearch";
import { useNextPageAvailable } from "../hooks/useNextPageAvailable";
import { FF } from "../types/FF";


export function infiniteQuery(start: number ,end: number,table: string, ascending: boolean, tagFilter: string[]) {
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
      

      let query = supabase.from("FF42").select("*");
      if (!filterEmpty) {
        let conditions:string[] | string  = tagFilter.map((tag) => `Tag.ilike.%${tag}%`);
        conditions = conditions.join(",");
        query = query.or(conditions);
      }
      query = query.order(table, { ascending }).range(start, end +1);
      let { data, error } = await query;
      if((data?.length ?? 0 )< end - start + 1) {
        setNextPageAvailable(false)
      }
      if (tagFilter.length !== 0 && data) {
      data = data.filter((item) => {
        if (!item.Tag) return false;
          const tag = item.Tag.split(",");
          tag.pop();
          // console.log(tag);
          return tagFilter.every((filter) => tag.includes(filter));
        });
      }
      if (error) throw error;
      if(filterEmpty && data) {
        data.pop()
      }
      return data;
    },
    enabled: search.length === 0,
    refetchOnWindowFocus: false,
  });
}
