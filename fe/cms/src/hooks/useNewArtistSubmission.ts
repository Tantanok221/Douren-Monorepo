import { ArrayTagHelper } from "@lib/ui";
import { trpc } from "@/lib/trpc";
import {
  ArtistFormSchema,
  ENTITY_FORM_KEY,
  EventArtistSchema,
  ProductFormSchema,
  useFormDataStore,
} from "../components";

export const useNewArtistSubmission = () => {
  const createArtist = trpc.artist.createArtist.useMutation();
  const createEventArtist = trpc.eventArtist.createEventArtist.useMutation();
  // Use raw store access to ensure we read fresh state at execution time
  const store = useFormDataStore();

  return async () => {
    // Get fresh getData from store at execution time (not from stale closure)
    const getFormData = store.getState().getData;
    const { artistStep, eventArtistStep } = getEntityFormData(getFormData);
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
