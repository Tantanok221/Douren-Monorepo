import { useQuery } from "@tanstack/react-query";
import { ArtistTypes } from "../types/Artist";
import { useSearch } from "../stores/useSearch";
import { supabase } from "../helper/supabase";

export const useArtistQuery = () => {
  const search = useSearch((state) => state.search);
  return useQuery({
    queryKey: ["artist", search],
    queryFn: async (): Promise<ArtistTypes[] | null> => {
      let query = supabase.from("Author_Main").select(`
        *,
        Event_DM (
          Booth_name
        )
        `);
      if (search.length > 0) {
        query = query.filter("Author", "ilike", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};
