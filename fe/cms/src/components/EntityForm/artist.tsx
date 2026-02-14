import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowRight } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputTextField, TagFilterField, ImageField } from "@/components/RichForm/RichForm";
import { Forms } from "@/components/Forms/Forms";
import {
  AllAvailableLinkType,
  GetLinkLabelFromKey,
} from "@/components/RichForm/type/LinkFormSchema";
import { useUploadImageRef } from "@/hooks";
import { artistFormSchema, ArtistFormSchema } from "./schema";
import { useFormDataContext } from "../FormDataContext/useFormDataContext.ts";
import { useFormStep } from "../FormStep";

interface artistFormProps {
  defaultValues?: ArtistFormSchema;
}

export function ArtistForm({ defaultValues }: artistFormProps) {
  const formHook = useForm<ArtistFormSchema>({
    resolver: zodResolver(artistFormSchema),
    defaultValues,
  });
  const uploadImageRef = useUploadImageRef();
  const setData = useFormDataContext((state) => state.setData);
  const bumpStep = useFormStep().onNext;
  const stepId = useFormStep().stepId;
  const onSubmit: SubmitHandler<ArtistFormSchema> = async (data) => {
    // Don't upload yet, just save form data and files
    // Store actual File objects instead of ref (ref becomes stale when component unmounts)
    const files = uploadImageRef.current?.getFiles() ?? [];
    setData(stepId, data);
    setData(`${stepId}_files`, files);
    bumpStep();
  };
  return (
    <>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"基本資訊"}
      </div>
      <Forms.Root OnSubmit={onSubmit} formHook={formHook}>
        <Forms.Submit>
          下一步 <ArrowRight />
        </Forms.Submit>
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
      </Forms.Root>
    </>
  );
}
