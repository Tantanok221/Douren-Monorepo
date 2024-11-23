import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Forms } from "../Forms";
import { ConvertLinkSchemaToObject } from "./helper";
import { LinkFormSchemaType } from "./type";

interface Props {
  label: React.ReactNode;
  formField: string;
}

export const LinkFormField = ({ label, formField }: Props) => {
  const formHook = useForm<LinkFormSchemaType>({ resolver: zodResolver(LinkFormSchema) });
  const { setValue } = useFormContext();
  const onSubmit = useCallback((data: LinkFormSchemaType) => {
      console.log(data);
      const linkSchemaObject = ConvertLinkSchemaToObject(data);
      setValue(formField, linkSchemaObject);
    }, [formField,setValue]);
  return <Forms.Field name={formField}>
    <Forms.HorizontalLayout>
      <Forms.Label>
        {label}
      </Forms.Label>
      <Forms.Button extendClass={"border-formBorder border"} type={"button"}>{"添加鏈接"}</Forms.Button>
    </Forms.HorizontalLayout>
    <Forms.Root asChild OnSubmit={onSubmit} formHook={formHook}>
      <div className={"gap-6 flex flex-col w-full"}>

      </div>
    </Forms.Root>
  </Forms.Field>;
};
