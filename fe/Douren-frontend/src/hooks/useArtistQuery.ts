import { ArtistTypes } from "../types/Artist";
import { useSearch } from "../stores/useSearch";
import { supabase } from "../helper/supabase";
import { useQuery } from "@tanstack/react-query";

export const useArtistQuery = (currentPage: number) => {
  const search = useSearch((state) => state.search);
  return useQuery({
    queryKey: ["artist", search, currentPage],
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
      query = query
        .neq("Author", "")
        .range((currentPage - 1) * 10, currentPage * 10 - 1);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};
