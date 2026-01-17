import { trpc } from "../helper";
import { ArrayTagHelper } from "@lib/ui";
import {
  ArtistFormSchema,
  ENTITY_FORM_KEY,
  EventArtistSchema,
  ProductFormSchema,
  useFormDataContext,
} from "../components";
import { Route } from "../routes/edit.$artistId";

export const useUpdateArtistSubmission = () => {
  console.log("useUpdateArtistSubmission");
  const { artistId: id } = Route.useParams();
  const updateArtist = trpc.artist.updateArtist.useMutation();
  const updateEventArtist = trpc.eventArtist.updateEventArtist.useMutation();
  const getFormData = useFormDataContext((state) => state.getData);

  return async () => {
    console.log("trigger update submit");
    const { artistStep, eventArtistStep } = getEntityFormData(getFormData);
    if (!artistStep || !eventArtistStep) return;

    const TagHelper = new ArrayTagHelper(artistStep.tags);
    const artistDataWithTags = {
      ...artistStep,
      tags: TagHelper.toString(),
    };

    // Update artist with correct mutation format
    const [artistData] = await updateArtist.mutateAsync({
      id,
      data: artistDataWithTags,
    });

    // Update event artist with correct mutation format
    await updateEventArtist.mutateAsync({
      id,
      data: {
        ...eventArtistStep,
        artistId: artistData.uuid,
      },
    });
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
