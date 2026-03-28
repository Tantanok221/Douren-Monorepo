import { createFileRoute } from "@tanstack/react-router";
import { ArtistPage } from "@/components/artist/ArtistPage";

const ArtistPageRoute = () => {
  const { eventName } = Route.useParams();
  return <ArtistPage eventName={eventName} />;
};

export const Route = createFileRoute("/events/$eventName/artists/$artistId")({
  component: ArtistPageRoute,
});
