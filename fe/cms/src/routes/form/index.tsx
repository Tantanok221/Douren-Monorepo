import { createFileRoute } from "@tanstack/react-router";
import { useMultiStepFormContext, MultiStepFormProvider } from "@/components";
import { ArtistForm } from "./-components/form/artist";
import { EventArtistForm } from "./-components/form/eventartist";
import { AllProductForm } from "./-components/form/product";

export const Route = createFileRoute("/form/")({
  component: () => <Form />,
});

function Form() {
  return (
    <div
      className={
        "flex flex-col px-6 py-8 w-full gap-8 bg-panel rounded-2xl justify-center items-start"
      }
    >
      <MultiStepFormProvider>
        <FormBase />
      </MultiStepFormProvider>
    </div>
  );
}

function FormBase() {
  const step = useMultiStepFormContext((state) => state.step);
  return <>{renderStep(step)}</>;
}

function renderStep(step: number) {
  switch (step) {
    case 1:
      return <AllProductForm />;
    // return <ArtistForm>
    case 2:
      return <EventArtistForm />;
    case 3:
      return <AllProductForm />;
    default:
      return <></>;
  }
}
