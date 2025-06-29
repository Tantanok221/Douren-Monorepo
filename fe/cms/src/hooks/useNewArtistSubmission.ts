import { trpc } from "../helper";
import { ArrayTagHelper } from "@lib/ui";
import {
  ArtistFormSchema,
  ENTITY_FORM_KEY,
  EventArtistSchema,
  ProductFormSchema,
  useFormDataContext,
} from "../components";

export const useNewArtistSubmission = () => {
  const createArtist = trpc.artist.createArtist.useMutation();
  const createEventArtist = trpc.eventArtist.createEventArtist.useMutation();
  const { artistStep, eventArtistStep } = useGetEntityFormData();

  return async () => {
    console.log("trigger submit");
    if (!artistStep || !eventArtistStep) return;
    const TagHelper = new ArrayTagHelper(artistStep.tags);
    const artistDataWithTags = {
      ...artistStep,
      tags: TagHelper.toString(),
    };
    const [artistData] = await createArtist.mutateAsync(artistDataWithTags);
    eventArtistStep.artistId = artistData.uuid;
    createEventArtist.mutate(eventArtistStep);
  };
};

interface EntityFormData {
  artistStep: ArtistFormSchema | null;
  eventArtistStep: EventArtistSchema | null;
  productStep: ProductFormSchema[] | null;
}

const useGetEntityFormData = (): EntityFormData => {
  const getFormData = useFormDataContext((state) => state.getData);
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
