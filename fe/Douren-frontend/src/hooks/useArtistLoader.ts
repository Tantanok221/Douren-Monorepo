import { trpc } from "../helper/trpc";

const useArtistLoader = (id?: number) => {
  return trpc.artist.getArtistPageDetails.useQuery(
    { id: id?.toString() || "" },
    { 
      enabled: !!id // Only run query if id exists
    }
  );
};

export default useArtistLoader;
