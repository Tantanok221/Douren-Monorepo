import { Pen } from "@phosphor-icons/react";
import { useEventDataContext } from "@lib/ui";
import { Link } from "@tanstack/react-router";

export const ArtistEditButton = () => {
  const eventData = useEventDataContext();
  return (
    <Link
      to={"edit/" + eventData.uuid}
      className="rounded px-6 py-2 text-tag-text bg-tag-background flex flex-row gap-4 font-bold"
    >
      <Pen /> Edit
    </Link>
  );
};
