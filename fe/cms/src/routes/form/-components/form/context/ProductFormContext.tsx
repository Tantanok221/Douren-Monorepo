import {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ProductFormSchema } from "../schema";
import {
  SubmitHandler,
  UseFormGetValues,
  UseFormHandleSubmit,
} from "react-hook-form";
import { FormImageUploadRef } from "@/components";

export interface ProductFormType {
  submitHook: UseFormHandleSubmit<ProductFormSchema>;
  onSubmit: SubmitHandler<ProductFormSchema>;
  thumbnailPromise: MutableRefObject<FormImageUploadRef>;
  previewPromise: MutableRefObject<FormImageUploadRef>;
  getValues: UseFormGetValues<ProductFormSchema>;
}

type ProductFormSubmitHandler = ProductFormType[];

export const ProductFormContext = createContext<
  | [
      ProductFormSubmitHandler,
      Dispatch<SetStateAction<ProductFormSubmitHandler>>,
    ]
  | null
>(null);

interface Props {
  children: ReactNode;
}

export const ProductFormContextProvider = ({ children }: Props) => {
  const [state, set] = useState<ProductFormSubmitHandler>([]);
  return (
    <ProductFormContext.Provider value={[state, set]}>
      {children}
    </ProductFormContext.Provider>
  );
};

export const useProductFormContext = () => {
  const data = useContext(ProductFormContext);
  if (!data)
    throw new Error(
      "useProductFormContext cannot be use within ProductFormContextProvider",
    );
  return data;
};
