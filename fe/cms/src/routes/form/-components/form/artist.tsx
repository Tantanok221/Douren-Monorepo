import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowRight } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputTextField,
  TagFilterField,
  Forms,
  AllAvailableLinkType,
  GetLinkLabelFromKey,
  ImageField,
  useMultiStepFormContext,
} from "@/components";
import { useUploadImageRef } from "@/hooks";
import { artistFormSchema, ArtistFormSchema } from "./schema";

export function ArtistForm() {
  const formHook = useForm<ArtistFormSchema>({
    resolver: zodResolver(artistFormSchema),
  });
  const uploadImageRef = useUploadImageRef();
  const setArtistStep = useMultiStepFormContext((state) => state.setArtistStep);

  const bumpStep = useMultiStepFormContext((state) => state.bumpStep);
  const onSubmit: SubmitHandler<ArtistFormSchema> = async (data) => {
    if (!uploadImageRef.current) return;
    console.log("inside onsubmit");
    console.log(data);
    const imgLink = await uploadImageRef.current.uploadImage();
    console.log(imgLink);
    setArtistStep({ ...data, photo: imgLink });
    bumpStep();
  };
  return (
    <>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"基本資訊"}
      </div>
      <Forms.Root OnSubmit={onSubmit} formHook={formHook}>
        <Forms.HorizontalLayout>
          <InputTextField formField={"author"} label={"作者"} />
          <InputTextField formField={"introduction"} label={"自我介紹"} />
        </Forms.HorizontalLayout>
        <TagFilterField formField={"tags"} label={"標簽"} />
        <div className={"gap-6 grid-cols-2 grid"}>
          {Object.keys(AllAvailableLinkType).map((key) => {
            return (
              <InputTextField
                formField={key}
                label={GetLinkLabelFromKey(key)}
                key={key}
              />
            );
          })}
        </div>
        <ImageField
          formField={"photo"}
          title={"頭像"}
          label={"頭像"}
          ref={uploadImageRef}
        />
        <Forms.Submit>
          下一步 <ArrowRight />
        </Forms.Submit>
      </Forms.Root>
    </>
  );
}
