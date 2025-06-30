import { Button } from "@lib/ui/src/components/Button/Button.tsx";
import { Pen } from "@phosphor-icons/react";
import { useEventDataContext } from "@lib/ui";
import { Link } from "@tanstack/react-router";

export const ArtistEditButton = () => {
  const eventData = useEventDataContext();
  return (
    <Link to={"edit/" + eventData.uuid}>
      <Pen /> Edit
    </Link>
  );
};
