import {
  FormButton,
  FormControl,
  FormField,
  HorizontalLayout,
  FormMessage,
  FormsLabel,
  FormSubmit,
} from "./subcomponent/FormSubcomponent";
import { FormTagFilter } from "./subcomponent/FormTagFilter";
import { FormImageUpload } from "./subcomponent/FormImageUpload.tsx";
import { FormsRoot } from "./FormsRoot";

interface CompoundForm {
  Root: typeof FormsRoot;
  Label: typeof FormsLabel;
  Message: typeof FormMessage;
  Field: typeof FormField;
  Button: typeof FormButton;
  HorizontalLayout: typeof HorizontalLayout;
  Control: typeof FormControl;
  Submit: typeof FormSubmit;
  TagFilter: typeof FormTagFilter;
  ImageUpload: typeof FormImageUpload;
}

export const Forms: CompoundForm = {
  Root: FormsRoot,
  Label: FormsLabel,
  Message: FormMessage,
  Field: FormField,
  Button: FormButton,
  HorizontalLayout: HorizontalLayout,
  Control: FormControl,
  Submit: FormSubmit,
  TagFilter: FormTagFilter,
  ImageUpload: FormImageUpload,
};
