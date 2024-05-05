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
      let query = supabase.from('Event_DM').select(`
      Location,
      Booth_name,
      DM,
      Author_Main(
        *
      )
      `).eq('Event_id',eventId)
      const { data,error} = await query
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
