import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../../components/ui/dialog.tsx";
import { Form} from "../../components/ui/form.tsx";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextFormField } from "../../components/TextFormField/TextFormField.tsx";

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
    <Dialog>
      <DialogTrigger className={"w-full"}>
        <motion.button
          className={"font-sans rounded-lg px-3 py-4 text-center text-tagText font-semibold flex w-full flex-row cursor-pointer bg-panel gap-4 "}
          whileHover={{
            backgroundColor: "#4D4D4D"
          }}>
          添加新人
        </motion.button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>添加新人</DialogHeader>
        <Form {...form}>
          <TextFormField form={form} formName="author" label="姓名" placeholder="作家姓名" />
          <TextFormField form={form} formName="introduction" label="簡介" placeholder="自我介紹" />

        </Form>
      </DialogContent>
    </Dialog>
  </div>
}