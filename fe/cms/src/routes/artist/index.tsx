import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowRight } from "@phosphor-icons/react";
import { ZodTagObject } from "@lib/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Forms } from "../../components";

export const Route = createFileRoute("/artist/")({
  component: Artist
});

const ZodLinkObject = z.object({
  LinkType: z.string(),
  LinkUrl: z.string()
});

const formSchema = z.object({
  introduction: z.string(),
  artistName: z.string().min(1, { message: "請輸入名字" }),
  tag: z.array(ZodTagObject).min(1, { message: "請選擇標簽" }),
  // links: z.array(ZodLinkObject)
});

type FormSchema = z.infer<typeof formSchema>

const onSubmit: SubmitHandler<FormSchema> = (data) => console.log(data);

function Artist() {
  const formHook = useForm<FormSchema>({ resolver: zodResolver(formSchema) });
   const {
      formState: { errors },
    setValue,
  } = formHook
  console.log(errors)
  return (
    <div className={"flex flex-col px-6 py-8 w-full gap-8 bg-panel rounded-2xl justify-center items-start "}>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"基本資訊"}
      </div>
      <Forms.Root
        OnSubmit={onSubmit}
        formHook={formHook}>
        <Forms.HorizontalLayout>
          <Forms.Field name={"artistName"}>
            <Forms.HorizontalLayout>
              <Forms.Label>
                {"名字"}
              </Forms.Label>
              <Forms.Message />
            </Forms.HorizontalLayout>
            <Forms.Control/>
          </Forms.Field>
          <Forms.Field name={"introduction"}>
            <Forms.Label>
              {"自我介紹"}
            </Forms.Label>
            <Forms.Control  />
          </Forms.Field>
        </Forms.HorizontalLayout>
        <Forms.Field name={"tag"}>
          <Forms.HorizontalLayout>
            <Forms.Label>
              {"標簽"}
            </Forms.Label>
            <Forms.Message />
          </Forms.HorizontalLayout>
          <Forms.TagFilter control={setValue} />
        </Forms.Field>
        <Forms.Field name={"link"}>
          <Forms.HorizontalLayout>
            <Forms.Label>
              {"鏈接"}
            </Forms.Label>
            <Forms.Button extendClass={"border-formBorder border"} type={"button"}>{"添加鏈接"}</Forms.Button>
          </Forms.HorizontalLayout>
        </Forms.Field>

        <Forms.Submit>
          下一步 <ArrowRight />
        </Forms.Submit>
      </Forms.Root>
    </div>
  );
}