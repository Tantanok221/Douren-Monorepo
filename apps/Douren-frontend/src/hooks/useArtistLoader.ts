import { useQuery } from "@tanstack/react-query";
import { ArtistPageTypes, ArtistTypes } from "../types/Artist";
import { supabase } from "../helper/supabase";

const fetchArtistPageData = async (
  id: number | undefined,
): Promise<ArtistPageTypes[] | null> => {
  const query = supabase
    .from("Author_Main")
    .select(
      `
  *,
  Author_Product(
    Title,Thumbnail,Preview
  ),
  Event_DM (
    DM,Booth_name,Location_Day01,Location_Day02,Location_Day03,Event(name
    )
  )
    `,
    )
    .eq("uuid", id);
  const { data } = await query;
  return data;
};
const useArtistLoader = (id?: number) => {
  return useQuery({
    queryKey: ["artist", id],
    queryFn: () => fetchArtistPageData(id),
  });
};

export default useArtistLoader