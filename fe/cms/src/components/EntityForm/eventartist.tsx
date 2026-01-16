import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useUploadImageRef } from "@/hooks";
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
}

export function EventArtistForm({ defaultValues }: EventArtistFormProps = {}) {
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
  const uploadImageRef = useUploadImageRef();
  const setData = useFormDataContext((state) => state.setData);
  const bumpStep = useFormStep().onNext;
  const goBack = useMultiStepFormContext((state) => state.goBackStep);
  const onSubmit: SubmitHandler<EventArtistSchema> = async (data) => {
    if (!uploadImageRef.current) return;
    const link = await uploadImageRef.current.uploadImage();
    setData(ENTITY_FORM_KEY.eventArtist, { ...data, dm: link });
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
          formField={"DM"}
          label={"DM"}
          title={"DM"}
          multiple
          ref={uploadImageRef}
        />
      </Forms.Root>
    </>
  );
}
