import { FormControl, FormField, FormItem, FormLabel } from "../ui/form.tsx";
import { Input } from "../ui/input.tsx";
import { FieldPath,  UseFormReturn } from "react-hook-form";

interface props<T extends UseFormReturn> {
  form: UseFormReturn<T>,
  formName: FieldPath<T>
  label: string
  placeholder: string
}

export const TextFormField = <T extends UseFormReturn>({ form, formName, label, placeholder }: props<T>) => {
  return <FormField control={form.control} name={formName} render={({ field }) => {
    return <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input placeholder={placeholder} {...field} />
      </FormControl>
    </FormItem>;
  }}>
  </FormField>;
};