import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowRight } from "@phosphor-icons/react";
import { ZodTagObject } from "@lib/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputTextField,
  TagFilterField,
  Forms,
  LinkFormSchema,
  AllAvailableLinkType,
  GetLinkLabelFromKey,
  ImageField
} from "@/components";
import { trpc } from "@/helper";
import { useRef } from "react";
import { FormImageUploadRef } from "../../components";

export const Route = createFileRoute("/form/artist")({
  component: Artist
});

export const artistFormSchema = z
  .object({
    introduction: z.string().optional(),
    author: z.string().min(1, { message: "請輸入名字" }),
    tags: z.array(ZodTagObject).min(1, { message: "請選擇標簽" }),
  })
  .merge(LinkFormSchema);

export type ArtistFormSchema = z.infer<typeof artistFormSchema>;

function Artist() {
  const formHook = useForm<ArtistFormSchema>({
    resolver: zodResolver(artistFormSchema)
  });
  const createArtistMutation = trpc.artist.createArtist.useMutation();
  const uploadImageRef = useRef<FormImageUploadRef>(null!)
  // const {getValues} = formHook
  // console.log(getValues())
  const onSubmit: SubmitHandler<ArtistFormSchema> = async (data) => {
    if(!uploadImageRef.current) return
    console.log("inside onsubmit");
    console.log(data);
    const allTag = data.tags.map((i) => i.tag).join(",");
    const imgLink = await uploadImageRef.current.uploadImage();
    console.log(imgLink);
    createArtistMutation.mutate({ ...data, photo: imgLink, tags: allTag });
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
        <ImageField formField={"photo"} title={"頭像"} label={"頭像"} ref={uploadImageRef}/>
        <Forms.Submit>
          下一步 <ArrowRight />
        </Forms.Submit>
      </Forms.Root>
    </>
  );
}
