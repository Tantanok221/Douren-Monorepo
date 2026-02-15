import { createFileRoute, redirect } from "@tanstack/react-router";
import { MultiStepFormProvider } from "../../components/MultiStepForm/context/MultiStepFormContext";
import { ArtistForm } from "../../components/EntityForm/artist";
import { EventArtistForm } from "../../components/EntityForm/eventartist";
import { CompleteStep } from "../../components/EntityForm/CompleteStep";
import { FormStep } from "../../components/FormStep/FormStep";
import { ENTITY_FORM_KEY } from "../../components/EntityForm/constant";
// import { AllProductForm } from "./-components/form/product";
import { RefreshHelperProvider } from "@lib/ui/src/components/RefreshHelper/RefreshHelperProvider";
import { FormDataProvider } from "../../components/FormDataContext/FormDataContext.tsx";
import { useNewArtistSubmission } from "../../hooks/useNewArtistSubmission.ts";

export const Route = createFileRoute("/new/")({
  beforeLoad: async ({ context }) => {
    const session = await context.authClient.getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
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
