import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { ArtistTypes } from "../types/Artist";
import { useSearch } from "../hooks/useSearch";

export const artistQuery = () => {
  let search = useSearch((state) => state.search)
  return useQuery({
    queryKey: ["artist",search],
    queryFn: async (): Promise<ArtistTypes[] | null> => {
      let query = supabase.from("Author_Main").select(`
        *,
        Author_Tag (
          Tag
        ),Event_DM (
          Booth_name
        )
        `);
      if(search.length > 0){
        query = query.filter("Author", "ilike", `%${search}%`);
      }

      const { data,error } = await query;
      if (error)throw error
      return data;
  }});
};
