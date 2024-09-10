import { useQuery } from "@tanstack/react-query";
import { supabase } from "../helper/supabase";
import { useNextPageAvailable } from "../stores/useNextPageAvailable";
import { useSearch } from "../stores/useSearch";
import { ArtistEventType } from "../types/Artist";
import { useTagFilter } from "../stores/useTagFilter";

export function useEventIDQuery(
  eventId: unknown,
  sortSelect: string,
  searchColumn: string,
  currentPage: number,
  fetchCount: number
) {
  const tagFilter = useTagFilter((state) => state.tagFilter).flatMap(
    (item) => item.tag,
  );
  const search = useSearch((state) => state.search);
  const setNextPageAvailable = useNextPageAvailable(
    (state) => state.setNextPageAvailable,
  );
  const table = sortSelect.split(' ')[0]  
  const ascending = sortSelect.split(' ')[1] === 'asc' ? true : false
  console.log(table,ascending)
  return useQuery({
    queryKey: [eventId, search, tagFilter, sortSelect, searchColumn,currentPage],
    queryFn: async (): Promise<ArtistEventType[] | null> => {
      const filterEmpty = tagFilter.length === 0;

      let query = supabase
        .from("Event_DM")
        .select(
          `
      Location_Day01,
      Location_Day02,
      Location_Day03,
      Booth_name,
      DM,
      Author_Main(
        *
      )
      `,
        )
        .eq("event_id", eventId);
      if (!filterEmpty) {
        tagFilter.forEach((tag) => {
          query = query.filter("Author_Main.Tags", "ilike", `%${tag}%`);
        });
      }
      if (search.length > 0) {
        query = query.filter(searchColumn, "ilike", `%${search}%`);
      }
      query = query.order(table,  {ascending} ).range(((currentPage - 1) * fetchCount), currentPage * fetchCount - 1);;
      let { data, error } = await query;
      data = data.filter((val: ArtistEventType) => val.Author_Main !== null);
      if (error) {
        throw error;
      }
      return data as ArtistEventType[] | null;
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });
}
