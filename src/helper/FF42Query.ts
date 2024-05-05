import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useSearch } from "../hooks/useSearch";
import { useNextPageAvailable } from "../hooks/useNextPageAvailable";
import { FF } from '../types/FF';

export function FF42Query(
  start: number,
  end: number,
  table: string,
  ascending: boolean,
  tagFilter: string[],
) {
  const search = useSearch((state) => state.search);
  const nextPageAvailable = useNextPageAvailable(
    (state) => state.nextPageAvailable,
  );
  const setNextPageAvailable = useNextPageAvailable(
    (state) => state.setNextPageAvailable,
  );
  // todo something broken related to data dissapering

  return useQuery({
    queryKey: [
      "FF42",
      search,
      { table, ascending },
      { tagFilter },
      { start, end },
    ],
    queryFn: async ():Promise<FF[] |null> => {
      const filterEmpty = tagFilter.length === 0;
      let query = supabase.from("FF42").select("*");
      if (!filterEmpty) {
        tagFilter.forEach((tag) => {
          query = query.filter("Tag", "ilike", `%${tag}%`);
        });
      }
      if (search.length > 0) {
        query = query.filter("Booth_name", "ilike", `%${search}%`);
      }
      query = query.order(table, { ascending }).range(start, end + 1);
      const { data, error } = await query;
      if ((data?.length ?? 0) < end - start + 1) {
        setNextPageAvailable(false);
      }

      if (error) throw error;

      return data;
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });
}
