import { Pen } from "@phosphor-icons/react";
import { useEventDataContext } from "@lib/ui";
import { Link } from "@tanstack/react-router";
import { useCanEditArtist } from "@/hooks/usePermissions";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";

export const ArtistEditButton = () => {
  const eventData = useEventDataContext();
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();
  const canEdit = useCanEditArtist(eventData.uuid);

  if (!session || !canEdit) return null;

  return (
    <Link
      to={"edit/" + eventData.uuid}
      className="rounded px-6 py-2 text-tag-text bg-tag-background flex flex-row gap-4 font-bold"
    >
      <Pen /> Edit
    </Link>
  );
};
