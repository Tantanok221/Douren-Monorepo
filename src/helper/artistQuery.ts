import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { ArtistTypes } from "../types/Artist";

const fetchArtistData = async (): Promise<ArtistTypes[] | null> => {
  const query = supabase.from("Author_Main").select(`
    *,
    Author_Tag (
      Tag
    ),
    Event_DM (
      DM,Booth_name,Location,Event(
        name
      )
    )
    `);
  const { data } = await query;
  return data;
};

export const artistQuery = () => {
  return useQuery({
    queryKey: ["artist"],
    queryFn: fetchArtistData,
  });
};
