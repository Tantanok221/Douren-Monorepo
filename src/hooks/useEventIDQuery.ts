import { useQuery } from "@tanstack/react-query";
import { supabase } from "../helper/supabase";
import { useNextPageAvailable } from "./useNextPageAvailable";
import { useSearch } from "./useSearch";
import { ArtistEventType } from "../types/Artist";

export function useEventIDQuery(
  eventId: unknown,
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
  return useQuery({
    queryKey: [eventId],
    queryFn: async ():Promise<ArtistEventType[] | null> => {
      const filterEmpty = tagFilter.length === 0;

      let query = supabase.from('Event_DM').select(`
      Location,
      Booth_name,
      DM,
      Author_Main(
        *
      )
      `).eq('Event_id',eventId)
      if (!filterEmpty) {
        tagFilter.forEach((tag) => {
          query = query.filter("Tag", "ilike", `%${tag}%`);
        });
      }
      if (search.length > 0) {
        query = query.filter("Booth_name", "ilike", `%${search}%`);
      }
      query = query.order(table, { ascending }).range(start, end + 1);
      const { data,error} = await query 
      if ((data?.length ?? 0) < end - start + 1) {
        setNextPageAvailable(false);
      }
      console.log(data)
      if(error){
        throw error
      }
      return data as ArtistEventType[] | null;

    },
    enabled: true,
    refetchOnWindowFocus: false,
  });
}
