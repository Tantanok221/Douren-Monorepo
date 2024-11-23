import { LinkFormSchemaType } from "../LinkForm.tsx";
import { ZodLinkObjectType } from "../type";

export function ConvertLinkSchemaToObject(formSchema: LinkFormSchemaType): ZodLinkObjectType{
  for(const obj in formSchema){
    console.log(obj)
  }
  return {
    LinkType: "twitterLink",
    LinkUrl: ""
  }
}