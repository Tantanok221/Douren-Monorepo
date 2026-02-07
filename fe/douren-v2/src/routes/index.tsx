import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { trpc } from "@/helper/trpc";

const IndexRedirect = () => {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  const defaultEvent = trpc.event.getDefaultEvent.useQuery();
  const allEvents = trpc.eventArtist.getAllEvent.useQuery();

  useEffect(() => {
    if (hasRedirected.current) return;
    if (defaultEvent.data) {
      hasRedirected.current = true;
      navigate({
        to: "/events/$eventName",
        params: { eventName: defaultEvent.data.name },
        replace: true,
      });
      return;
    }
    if (!defaultEvent.data && allEvents.data?.length) {
      hasRedirected.current = true;
      navigate({
        to: "/events/$eventName",
        params: { eventName: allEvents.data[0].name },
        replace: true,
      });
    }
  }, [defaultEvent.data, allEvents.data, navigate]);

  if (defaultEvent.isError && allEvents.isError) {
    return (
      <div className="py-20 text-center text-archive-text/60 font-mono">
        Unable to load events. Please refresh and try again.
      </div>
    );
  }

  if (
    !defaultEvent.isPending &&
    !allEvents.isPending &&
    !allEvents.data?.length
  ) {
    return (
      <div className="py-20 text-center text-archive-text/60 font-mono">
        No events available.
      </div>
    );
  }

  return (
    <div className="py-20 text-center text-archive-text/60 font-mono">
      Loading events...
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});
