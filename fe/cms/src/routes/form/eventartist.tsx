import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EventField,
  FormImageUploadRef,
  Forms,
  ImageField,
  InputTextField,
} from "../../components";
import { ArrowRight } from "@phosphor-icons/react";
import { useRef } from "react";
import { useMultiStepFormContext } from "../../components/MultiStepForm/context/useMultiStepFormContext.ts";

export const Route = createFileRoute("/form/eventartist")({
  component: () => <EventArtist />,
});

export const eventArtistSchema = z.object({
  event_id: z.string().min(1, "請選擇一個活動"),
  artist_id: z.string().optional(),
  booth_name: z.string().min(1, "請輸入攤位名字"),
  DM: z.string().optional(),
  location_day01: z.string().optional(),
  location_day02: z.string().optional(),
  location_day03: z.string().optional(),
  photo: z.string().optional(),
});

export type eventArtistSchema = z.infer<typeof eventArtistSchema>;

function EventArtist() {
  const formHook = useForm<eventArtistSchema>({
    resolver: zodResolver(eventArtistSchema),
    defaultValues: {
      event_id: "3",
    },
  });
  const uploadImageRef = useRef<FormImageUploadRef>(null!);
  const setEventArtistStep = useMultiStepFormContext(
    (state) => state.setEventArtistStep,
  );
  const onSubmit: SubmitHandler<eventArtistSchema> = async (data) => {
    if (!uploadImageRef.current) return;
    const link = await uploadImageRef.current.uploadImage();
    setEventArtistStep({ ...data, photo: link });
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
        <Forms.Submit>
          下一步 <ArrowRight />
        </Forms.Submit>
      </Forms.Root>
    </>
  );
}
