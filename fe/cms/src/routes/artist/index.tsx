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
  ImageField,
} from "../../components";

export const Route = createFileRoute("/artist/")({
  component: Artist,
});

const formSchema = z
  .object({
    introduction: z.string(),
    artistName: z.string().min(1, { message: "請輸入名字" }),
    tag: z.array(ZodTagObject).min(1, { message: "請選擇標簽" }),
    image: z.string(),
  })
  .merge(LinkFormSchema);

type FormSchema = z.infer<typeof formSchema>;

const onSubmit: SubmitHandler<FormSchema> = (data) => console.log(data);

function Artist() {
  const formHook = useForm<FormSchema>({ resolver: zodResolver(formSchema) });
  const val = formHook.getValues();
  console.log(val.image);
  return (
    <div
      className={
        "flex flex-col px-6 py-8 w-full gap-8 bg-panel rounded-2xl justify-center items-start "
      }
    >
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"基本資訊"}
      </div>
      <Forms.Root OnSubmit={onSubmit} formHook={formHook}>
        <Forms.HorizontalLayout>
          <InputTextField formField={"artistName"} label={"作者"} />
          <InputTextField formField={"introduction"} label={"自我介紹"} />
        </Forms.HorizontalLayout>
        <TagFilterField formField={"tag"} label={"標簽"} />
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
        <ImageField formField={"image"} title={"头像"} label={"头像"} />

        <Forms.Submit>
          下一步 <ArrowRight />
        </Forms.Submit>
      </Forms.Root>
    </div>
  );
}
