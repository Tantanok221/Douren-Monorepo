import { createFileRoute } from "@tanstack/react-router";
import { useMultiStepFormContext, MultiStepFormProvider } from "@/components";
import { ArtistForm } from "./-components/form/artist";
import { EventArtistForm } from "./-components/form/eventartist";
// import { AllProductForm } from "./-components/form/product";
import { ReactNode } from "react";

interface props {
  children: ReactNode;
  validStep: number;
}

export const Route = createFileRoute("/form/")({
  component: () => <Form />,
});

function Form() {
  return (
    <>
      <MultiStepFormProvider triggerStep={3}>
        <FormWrapper validStep={1}>
          <ArtistForm />
        </FormWrapper>
        <FormWrapper validStep={2}>
          <EventArtistForm />
        </FormWrapper>
        <FormWrapper validStep={3}>
          <div className={"text-2xl font-sans font-semibold text-white"}>
            上傳中
          </div>
        </FormWrapper>
        <FormWrapper validStep={4}>
          <div className={"text-2xl font-sans font-semibold text-white"}>
            完成
          </div>
        </FormWrapper>
        {/*<FormWrapper validStep={3}>*/}
        {/*  <AllProductForm />*/}
        {/*</FormWrapper>*/}
      </MultiStepFormProvider>
    </>
  );
}

function FormWrapper({ children, validStep }: props) {
  const step = useMultiStepFormContext((state) => state.step);
  if (step == validStep)
    return (
      <div
        className={
          "flex flex-col px-6 py-8 w-full gap-8 bg-panel rounded-2xl justify-center items-start"
        }
      >
        {children}
      </div>
    );
  return <div className={"hidden"}>{children}</div>;
}
