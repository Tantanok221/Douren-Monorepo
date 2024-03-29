import { useQuery } from "@tanstack/react-query";
import { ArtistTypes } from "../types/Artist";
import { supabase } from "./supabase";

const fetchArtistData = async (id:number | undefined): Promise<ArtistTypes[] | null> => {
  const query = supabase.from("Author_Main").select(`
    *,
    Author_Tag (
      Tag
    ),
    Event_DM (
      Event,Booth_name,DM
    )
    `).eq("uuid",id)
  const { data } = await query;
  return data;
};

export const artistLoader = (id?:number) => {
  return useQuery({
    queryKey: ["artist",id],
    queryFn: () => fetchArtistData(id),
  });
};
