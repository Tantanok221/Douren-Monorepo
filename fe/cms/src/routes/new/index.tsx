import { createFileRoute } from "@tanstack/react-router";
import {
  MultiStepFormProvider,
  ArtistForm,
  EventArtistForm,
  CompleteStep,
  FormStep,
  ENTITY_FORM_KEY,
} from "../../components";
// import { AllProductForm } from "./-components/form/product";
import { RefreshHelperProvider } from "@lib/ui";
import { FormDataProvider } from "../../components/FormDataContext/FormDataContext.tsx";
import { useNewArtistSubmission } from "../../hooks/useNewArtistSubmission.ts";

export const Route = createFileRoute("/new/")({
  component: () => <Form />,
});

function Form() {
  return (
    <FormDataProvider>
      <RefreshHelperProvider uniqueKey={"formResetKey"}>
        <FormWithProviders />
      </RefreshHelperProvider>
    </FormDataProvider>
  );
}

function FormWithProviders() {
  const submitNewArtist = useNewArtistSubmission();

  return (
    <MultiStepFormProvider submitStep={3} onSubmit={submitNewArtist}>
      <FormStep activeStep={1} stepId={ENTITY_FORM_KEY.artist}>
        <ArtistForm />
      </FormStep>
      <FormStep activeStep={2} stepId={ENTITY_FORM_KEY.eventArtist}>
        <EventArtistForm />
      </FormStep>
      <FormStep activeStep={3} stepId={"completeStep"}>
        <CompleteStep />
      </FormStep>
      {/*<FormWrapper validStep={3}>*/}
      {/*  <AllProductForm />*/}
      {/*</FormWrapper>*/}
    </MultiStepFormProvider>
  );
}
