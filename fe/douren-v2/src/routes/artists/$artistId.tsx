import { createFileRoute } from "@tanstack/react-router";
import { ArtistPage } from "@/components/artist/ArtistPage";

const ArtistPageRoute = () => {
  const { artistId } = Route.useParams();
  const { eventName } = Route.useSearch();

  return <ArtistPage artistId={artistId} eventName={eventName} />;
};

export const Route = createFileRoute("/artists/$artistId")({
  validateSearch: (search) => ({
    eventName:
      typeof search.eventName === "string" ? search.eventName : undefined,
  }),
  component: ArtistPageRoute,
});
