import { motion } from "framer-motion";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  author: z.string().min(1, { message: "Username is required" }),
  introduction: z.string()
});
export type formSchemaType = z.infer<typeof formSchema>
const onSubmit = (values : formSchemaType) => {

}

export const InsertContainer = () => {
  const form = useForm<formSchemaType>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        author: "",
        introduction: "",
      }
    }
  );
  return <div className={"flex rounded-lg flex-row items-center w-full"}>

  </div>
}