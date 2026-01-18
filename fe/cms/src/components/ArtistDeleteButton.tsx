import { Trash } from "@phosphor-icons/react";
import { useEventDataContext } from "@lib/ui";
import { useCanDeleteArtist } from "@/hooks/usePermissions";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export const ArtistDeleteButton = () => {
  const eventData = useEventDataContext();
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();
  const canDelete = useCanDeleteArtist(eventData.uuid);
  const [confirmation, setConfirmation] = useState(false);

  const utils = trpc.useUtils();
  const deleteArtist = trpc.artist.deleteArtist.useMutation({
    onSuccess: () => {
      toast.success("Artist deleted successfully");
      utils.artist.getArtist.invalidate();
      utils.admin.getMyArtistsPaginated.invalidate();
      setConfirmation(false);
    },
    onError: (error) => {
      if (error?.data?.code === "FORBIDDEN") {
        toast.error("You don't have permission to delete this artist");
      } else {
        toast.error("Failed to delete artist");
      }
      setConfirmation(false);
    },
  });

  if (!session || !canDelete) return null;

  const handleDelete = () => {
    if (!confirmation) {
      setConfirmation(true);
      return;
    }
    deleteArtist.mutate({ id: String(eventData.uuid) });
  };

  const handleCancel = () => {
    setConfirmation(false);
  };

  if (confirmation) {
    return (
      <div className="flex flex-row gap-2">
        <button
          onClick={handleDelete}
          disabled={deleteArtist.isPending}
          className="rounded px-4 py-2 text-white bg-red-600 hover:bg-red-700 flex flex-row gap-2 font-bold disabled:opacity-50"
        >
          {deleteArtist.isPending ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={handleCancel}
          disabled={deleteArtist.isPending}
          className="rounded px-4 py-2 text-tag-text bg-tag-background flex flex-row gap-2 font-bold disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded px-6 py-2 text-tag-text bg-tag-background flex flex-row gap-4 font-bold hover:bg-on-hover"
    >
      <Trash /> Delete
    </button>
  );
};
