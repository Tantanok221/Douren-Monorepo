import { createFileRoute } from "@tanstack/react-router";
import { ArtistPage } from "@/components/artist/ArtistPage";

const ArtistPageRoute = () => {
  const { eventName, artistId } = Route.useParams();
  return <ArtistPage artistId={artistId} eventName={eventName} />;
};

export const Route = createFileRoute("/events/$eventName/artists/$artistId")({
  component: ArtistPageRoute,
});
