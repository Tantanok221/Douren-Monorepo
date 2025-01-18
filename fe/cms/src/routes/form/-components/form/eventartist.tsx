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

export function EventArtistForm() {
  const formHook = useForm<EventArtistSchema>({
    resolver: zodResolver(eventArtistSchema),
    defaultValues: {
      event_id: "3",
    },
  });
  const uploadImageRef = useUploadImageRef();
  const setEventArtistStep = useMultiStepFormContext(
    (state) => state.setEventArtistStep,
  );

  const bumpStep = useMultiStepFormContext((state) => state.bumpStep);
  const goBack = useMultiStepFormContext((state) => state.goBackStep);
  const onSubmit: SubmitHandler<EventArtistSchema> = async (data) => {
    if (!uploadImageRef.current) return;
    const link = await uploadImageRef.current.uploadImage();
    setEventArtistStep({ ...data, photo: link });
    bumpStep();
    console.log(link);
    console.log(data);
  };

  return (
    <>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"場次資訊"}
      </div>
      <Forms.Root OnSubmit={onSubmit} formHook={formHook}>
        <InputTextField formField={"booth_name"} label={"攤位名字"} />
        <InputTextField formField={"location_day01"} label={"第一天攤位位置"} />
        <InputTextField formField={"location_day02"} label={"第二天攤位位置"} />
        <InputTextField formField={"location_day03"} label={"第三天攤位位置"} />
        <EventField formField={"event_id"} label={"選擇活動"} />
        <ImageField
          formField={"DM"}
          label={"DM"}
          title={"DM"}
          multiple
          ref={uploadImageRef}
        />
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
      </Forms.Root>
    </>
  );
}
