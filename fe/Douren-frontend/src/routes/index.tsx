import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { trpc } from "@/helper/trpc";

export const Route = createFileRoute("/")({
  component: () => <Navigate />,
});

const Navigate = () => {
  const navigate = Route.useNavigate();
  const { data: defaultEvent, isLoading } = trpc.event.getDefaultEvent.useQuery();

  useEffect(() => {
    if (isLoading) return;

    const eventName = defaultEvent?.name ?? "FF45";
    navigate({
      to: "/event/$eventName",
      params: { eventName },
    });
  }, [defaultEvent, isLoading, navigate]);

  return <div />;
};
