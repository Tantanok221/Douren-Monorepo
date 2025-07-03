import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: () => <Navigate />,
});

const Navigate = () => {
  const navigate = Route.useNavigate();
  useEffect(
    () => {
      navigate({
        to: "/event/$eventName",
        // mask: "/",
        params: {
          eventName: "FF45",
        },
      });
    }, [])
  return <div />;
};
