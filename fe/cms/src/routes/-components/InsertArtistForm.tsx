import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  author: z.string().min(1, { message: "Username is required" }),
  introduction: z.string(),
  tag: z.string()
});

export type formSchemaType = z.infer<typeof formSchema>

export const InsertArtistForm = () => {
  const form = useForm<formSchemaType>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        author: "",
        introduction: "",
        tag: ""
      }
    }
  );
  return (
    <></>
  );
};