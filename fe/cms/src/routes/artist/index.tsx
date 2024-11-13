import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowRight } from "@phosphor-icons/react";
import { Forms } from "../../components";
import { TagObject } from "@lib/ui";

export const Route = createFileRoute("/artist/")({
  component: Artist
});

interface ArtistInput {
  artistName: string;
  tag: TagObject[];
  introduction: string;
}

const onSubmit: SubmitHandler<ArtistInput> = (data) => console.log(data);

function Artist() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ArtistInput>();
  return (
    <div className={"flex flex-col px-6 py-8 w-full gap-8 bg-panel rounded-2xl justify-center items-start "}>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"基本資訊"}
      </div>
      <Forms onSubmit={handleSubmit(onSubmit)}>
        <Forms.FormLabelMessageStyle>
          <Forms.Field name={"artistName"}>
            <Forms.FormLabelMessageStyle>
              <Forms.Label>
                {"藝人名字"}
              </Forms.Label>
              <Forms.Message condition={errors.artistName?.type === "required"}>
                {"請輸入藝人名字"}
              </Forms.Message>
            </Forms.FormLabelMessageStyle>
            <Forms.Control
              {...register("artistName", { required: true })} />
          </Forms.Field>
          {/*<Forms.Field name={"tag"}>*/}
          {/*  <Forms.FormLabelMessageStyle>*/}
          {/*    <Forms.Label>*/}
          {/*      {"藝人名字"}*/}
          {/*    </Forms.Label>*/}
          {/*    <Forms.Message condition={errors.artistName?.type === "required"}>*/}
          {/*      {"請輸入藝人名字"}*/}
          {/*    </Forms.Message>*/}
          {/*  </Forms.FormLabelMessageStyle>*/}
          {/*  <Forms.TagFilter control={setValue}/>*/}
          {/*</Forms.Field>*/}
        </Forms.FormLabelMessageStyle>
        <Forms.Submit>
          下一步 <ArrowRight />
        </Forms.Submit>
      </Forms>
    </div>
  );
}