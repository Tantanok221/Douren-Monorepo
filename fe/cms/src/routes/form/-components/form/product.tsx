import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ImageField, InputTextField, Forms } from "@/components";
import { useUploadImageRef } from "@/hooks";
import { productFormSchema, ProductFormSchema } from "./schema";
import {
  ProductFormContextProvider,
  useProductFormContext,
} from "./context/ProductFormContext.tsx";
import { FormButton } from "../../../../components";

interface formProps {
  index: number;
}

export function AllProductForm() {
  const [count, setCount] = useState<number[]>([0]);
  return (
    <>
      <ProductFormContextProvider>
        <FormButton
          extendClass={"bg-white"}
          onClick={() => setCount((state) => [...state, state.length])}
        >
          增加作品
        </FormButton>
        {count.map((i) => (
          <ProductForm key={i + "product form"} index={i + 1} />
        ))}
        <ProductFormSubmit />
      </ProductFormContextProvider>
    </>
  );
}

const ProductForm = ({ index }: formProps) => {
  const formHook = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
  });
  const thumbnailImageRef = useUploadImageRef();
  const previewImageRef = useUploadImageRef();
  const [, setProductHook] = useProductFormContext();

  const ProductSubmitHandler: SubmitHandler<ProductFormSchema> = (data) => {
    console.log(data);
  };
  useEffect(() => {
    setProductHook((state) => [
      ...state,
      {
        submitHook: formHook.handleSubmit,
        onSubmit: ProductSubmitHandler,
      },
    ]);
    return () =>
      setProductHook((state) => state.filter((_, i) => i !== index - 1));
  }, [setProductHook, formHook, index]);

  return (
    <>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"作品資訊" + index}
      </div>
      <Forms.Root formHook={formHook} OnSubmit={ProductSubmitHandler}>
        <InputTextField formField={"title"} label={"作品名字"} />
        <ImageField
          formField={"thumbnail"}
          title={"縮圖"}
          label={"縮圖"}
          ref={thumbnailImageRef}
        />
        <ImageField
          formField={"preview"}
          multiple
          title={"預覽"}
          label={"預覽"}
          ref={previewImageRef}
        />
      </Forms.Root>
    </>
  );
};

const ProductFormSubmit = () => {
  const [productFormData] = useProductFormContext();

  const onClick = () => {
    productFormData.forEach((item) => {
      item.submitHook(item.onSubmit)();
    });
  };

  return (
    <FormButton extendClass={"bg-white"} onClick={onClick}>
      {" "}
      下一步{" "}
    </FormButton>
  );
};
