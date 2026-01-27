import { ArrayTagHelper } from "@lib/ui";
import { trpc } from "@/lib/trpc";
import {
  ArtistFormSchema,
  ENTITY_FORM_KEY,
  EventArtistSchema,
  ProductFormSchema,
  useFormDataStore,
} from "../components";
import { Route } from "../routes/edit.$artistId";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { uploadImages } from "./useUploadImage";

export const useUpdateArtistSubmission = () => {
  const { artistId: id } = Route.useParams();
  const updateArtist = trpc.artist.updateArtist.useMutation();
  const upsertEventArtist = trpc.eventArtist.upsertEventArtist.useMutation();
  // Use raw store access to ensure we read fresh state at execution time
  const store = useFormDataStore();
  const navigate = useNavigate();

  return async () => {
    const setStatus = store.getState().setSubmissionStatus;
    try {
      // Get fresh state from store at execution time
      const { getData, setData } = store.getState();
      const { artistStep, eventArtistStep } = getEntityFormData(getData);
      if (!artistStep || !eventArtistStep) return;

      // Upload artist photo from step 1
      setStatus({ stage: "uploading", message: "上傳頭像中..." });
      try {
        const artistFiles = getData<File[]>(
          `${ENTITY_FORM_KEY.artist}_files`,
        );
        if (artistFiles && artistFiles.length > 0) {
          const photoLink = await uploadImages(artistFiles);
          artistStep.photo = photoLink;
          setData(ENTITY_FORM_KEY.artist, artistStep);
        }
      } catch {
        // No artist files, use existing photo value
      }

      // Upload event DM from step 2
      setStatus({ stage: "uploading", message: "上傳 DM 中..." });
      try {
        const dmFiles = getData<File[]>(
          `${ENTITY_FORM_KEY.eventArtist}_files`,
        );
        if (dmFiles && dmFiles.length > 0) {
          const dmLink = await uploadImages(dmFiles);
          eventArtistStep.dm = dmLink;
          setData(ENTITY_FORM_KEY.eventArtist, eventArtistStep);
        }
      } catch {
        // No DM files, use existing dm value
      }

      // Submit to backend
      setStatus({ stage: "submitting", message: "提交資料中..." });
      const TagHelper = new ArrayTagHelper(artistStep.tags);
      const artistDataWithTags = {
        ...artistStep,
        tags: TagHelper.toString(),
      };

      const [artistData] = await updateArtist.mutateAsync({
        id,
        data: artistDataWithTags,
      });

      // Use upsert to create or update event_dm record
      await upsertEventArtist.mutateAsync({
        ...eventArtistStep,
        artistId: artistData.uuid,
      });

      setStatus({ stage: "complete", message: "完成！" });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error as { data?: { code?: string } };
        if (errorData?.data?.code === "FORBIDDEN") {
          setStatus({ stage: "error", message: "沒有編輯權限" });
          toast.error("You don't have permission to edit this artist");
          navigate({ to: "/" });
          return;
        }
      }
      setStatus({
        stage: "error",
        message: error instanceof Error ? error.message : "發生錯誤",
      });
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
