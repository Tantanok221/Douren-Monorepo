import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useUploadImageRef } from "@/hooks";
import { useEffect } from "react";
import {
  EventField,
  Forms,
  ImageField,
  InputTextField,
  useMultiStepFormContext,
} from "@/components";
import { eventArtistSchema, EventArtistSchema } from "./schema";
import { useFormDataContext } from "../FormDataContext/useFormDataContext.ts";
import { ENTITY_FORM_KEY } from "./constant.ts";
import { useFormStep } from "../FormStep";

interface EventArtistFormProps {
  defaultValues?: EventArtistSchema;
  allEventData?: Array<{
    uuid?: number;
    eventId?: number | null;
    artistId?: number;
    boothName?: string | null;
    dm?: string | null;
    locationDay01?: string | null;
    locationDay02?: string | null;
    locationDay03?: string | null;
  }>;
}

export function EventArtistForm({
  defaultValues,
  allEventData = [],
}: EventArtistFormProps = {}) {
  const formHook = useForm<EventArtistSchema>({
    resolver: zodResolver(eventArtistSchema),
    defaultValues: defaultValues ?? {
      eventId: 0, // Will be auto-selected by EventField
      artistId: 0, // Placeholder, will be set during submission
      boothName: "",
      dm: "",
      locationDay01: "",
      locationDay02: "",
      locationDay03: "",
    },
  });

  const { watch, reset } = formHook;
  const selectedEventId = watch("eventId");

  // Update form when selected event changes
  useEffect(() => {
    if (!selectedEventId || allEventData.length === 0) return;

    // Find data for selected event
    const eventData = allEventData.find(
      (event) => event.eventId === selectedEventId,
    );

    if (eventData) {
      // Populate form with existing event data
      reset({
        eventId: eventData.eventId || selectedEventId,
        artistId: eventData.artistId || 0,
        boothName: eventData.boothName || "",
        dm: eventData.dm || "",
        locationDay01: eventData.locationDay01 || "",
        locationDay02: eventData.locationDay02 || "",
        locationDay03: eventData.locationDay03 || "",
      });
    } else {
      // Reset to empty form for new event
      reset({
        eventId: selectedEventId,
        artistId: defaultValues?.artistId || 0,
        boothName: "",
        dm: "",
        locationDay01: "",
        locationDay02: "",
        locationDay03: "",
      });
    }
  }, [selectedEventId, allEventData, reset, defaultValues?.artistId]);
  const uploadImageRef = useUploadImageRef();
  const setData = useFormDataContext((state) => state.setData);
  const getData = useFormDataContext((state) => state.getData);
  const bumpStep = useFormStep().onNext;
  const goBack = useMultiStepFormContext((state) => state.goBackStep);
  const onSubmit: SubmitHandler<EventArtistSchema> = async (data) => {
    // Upload ALL images before moving to completion step (step 3)
    
    // Upload artist photo from step 1
    try {
      const artistUploadRef = getData(`${ENTITY_FORM_KEY.artist}_uploadRef`);
      const artistData = getData(ENTITY_FORM_KEY.artist);
      
      if (artistUploadRef?.current) {
        const photoLink = await artistUploadRef.current.uploadImage();
        // Update artist data with uploaded photo URL
        setData(ENTITY_FORM_KEY.artist, { ...artistData, photo: photoLink });
      }
    } catch (error) {
      // No artist data or upload ref found, skip artist photo upload
      console.warn("No artist upload ref found, skipping artist photo upload");
    }

    // Upload event DM from step 2
    let dmLink = data.dm;
    if (uploadImageRef.current) {
      dmLink = await uploadImageRef.current.uploadImage();
    }

    setData(ENTITY_FORM_KEY.eventArtist, { ...data, dm: dmLink });
    bumpStep();
  };

  return (
    <>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"場次資訊"}
      </div>
      <Forms.Root OnSubmit={onSubmit} formHook={formHook}>
        <Forms.HorizontalLayout>
          <Forms.Button
            onClick={() => goBack()}
            extendClass={"bg-white"}
            type={"button"}
          >
            <ArrowLeft /> 上一步
          </Forms.Button>
          <Forms.Submit>
            下一步 <ArrowRight />
          </Forms.Submit>
        </Forms.HorizontalLayout>
        <InputTextField formField={"boothName"} label={"攤位名字"} />
        <InputTextField formField={"locationDay01"} label={"第一天攤位位置"} />
        <InputTextField formField={"locationDay02"} label={"第二天攤位位置"} />
        <InputTextField formField={"locationDay03"} label={"第三天攤位位置"} />
        <EventField formField={"eventId"} label={"選擇活動"} />
        <ImageField
          formField={"dm"}
          label={"DM"}
          title={"DM"}
          multiple
          ref={uploadImageRef}
        />
      </Forms.Root>
    </>
  );
}
