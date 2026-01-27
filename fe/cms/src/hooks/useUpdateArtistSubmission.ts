import { ArrayTagHelper } from "@lib/ui";
import { trpc } from "@/lib/trpc";
import {
  ArtistFormSchema,
  ENTITY_FORM_KEY,
  EventArtistSchema,
  ProductFormSchema,
  useFormDataContext,
} from "../components";
import { Route } from "../routes/edit.$artistId";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const useUpdateArtistSubmission = () => {
  const { artistId: id } = Route.useParams();
  const updateArtist = trpc.artist.updateArtist.useMutation();
  const upsertEventArtist = trpc.eventArtist.upsertEventArtist.useMutation();
  const getFormData = useFormDataContext((state) => state.getData);
  const navigate = useNavigate();

  return async () => {
    const { artistStep, eventArtistStep } = getEntityFormData(getFormData);
    if (!artistStep || !eventArtistStep) return;

    const TagHelper = new ArrayTagHelper(artistStep.tags);
    const artistDataWithTags = {
      ...artistStep,
      tags: TagHelper.toString(),
    };

    try {
      const [artistData] = await updateArtist.mutateAsync({
        id,
        data: artistDataWithTags,
      });

      // Use upsert to create or update event_dm record
      await upsertEventArtist.mutateAsync({
        ...eventArtistStep,
        artistId: artistData.uuid,
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error as { data?: { code?: string } };
        if (errorData?.data?.code === "FORBIDDEN") {
          toast.error("You don't have permission to edit this artist");
          navigate({ to: "/" });
          return;
        }
      }
      throw error;
    }
  };
};

interface EntityFormData {
  artistStep: ArtistFormSchema | null;
  eventArtistStep: EventArtistSchema | null;
  productStep: ProductFormSchema[] | null;
}

const getEntityFormData = (
  getFormData: <T>(key: string) => T,
): EntityFormData => {
  const artistStep = getFormData(
    ENTITY_FORM_KEY.artist,
  ) as ArtistFormSchema | null;
  const eventArtistStep = getFormData(
    ENTITY_FORM_KEY.eventArtist,
  ) as EventArtistSchema;
  return {
    artistStep,
    eventArtistStep,
    productStep: null,
  };
};
