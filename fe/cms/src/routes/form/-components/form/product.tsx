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
import { FormButton, useMultiStepFormContext } from "@/components";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

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

  const ProductSubmitHandler: SubmitHandler<ProductFormSchema> = async (
    data,
  ) => {
    console.log(data);
  };
  useEffect(() => {
    setProductHook((state) => [
      ...state,
      {
        submitHook: formHook.handleSubmit,
        onSubmit: ProductSubmitHandler,
        getValues: formHook.getValues,
        thumbnailPromise: thumbnailImageRef,
        previewPromise: previewImageRef,
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
  const setProductStep = useMultiStepFormContext(
    (state) => state.setProductStep,
  );
  const goBack = useMultiStepFormContext((state) => state.goBackStep);
  const bumpStep = useMultiStepFormContext((state) => state.bumpStep);

  const onClick = async () => {
    const validData: ProductFormSchema[] = [];
    const allPromises: Promise<string>[] = [];

    productFormData.forEach((item) => item.submitHook(item.onSubmit)());
    productFormData.forEach((i) => {
      const data = i.getValues();
      if (data.title.length == 0) return;
      validData.push(data);
      allPromises.push(
        i.thumbnailPromise.current.uploadImage(),
        i.previewPromise.current.uploadImage(),
      );
    });
    if (validData.length != productFormData.length) return;

    const resolvedPromises = await Promise.all(allPromises);
    validData.map((item, index) => {
      const thumbnailUrl = resolvedPromises[index * 2];
      const previewUrl = resolvedPromises[index * 2 + 1];

      // Update the item with resolved URLs
      item.thumbnail = thumbnailUrl;
      item.preview = previewUrl;
    });
    console.log("Resolved promises:", resolvedPromises);
    console.log(validData);
    setProductStep(validData);
    bumpStep()
  };

  return (
    <div className={"w-full"}>
    <Forms.HorizontalLayout>
      <Forms.Button
        onClick={() => goBack()}
        extendClass={"bg-white"}
        type={"button"}
      >
        <ArrowLeft /> 上一步
      </Forms.Button>
      <FormButton extendClass={"bg-white"} onClick={onClick}>
        下一步 <ArrowRight />
      </FormButton>
    </Forms.HorizontalLayout>
    </div>
  );
};
