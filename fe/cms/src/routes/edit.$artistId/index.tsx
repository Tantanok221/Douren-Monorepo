import { createFileRoute } from '@tanstack/react-router'
import {
  useMultiStepFormContext,
  MultiStepFormProvider,
  ArtistForm,
  EventArtistForm,
  CompleteStep,
  FormStep,
  ENTITY_FORM_KEY,
} from '../../components/index.ts'
// import { AllProductForm } from "./-components/form/product";
import { RefreshHelperProvider } from '@lib/ui'
import { FormDataProvider } from '../../components/FormDataContext/FormDataContext.tsx'
import { useNewArtistSubmission } from '../../hooks/useNewArtistSubmission.ts'
import { trpc } from '../../helper/index.ts'
import { transformArtistToFormData, transformEventArtistToFormData } from '../../utils/transformData.ts'
export const Route = createFileRoute('/edit/$artistId/')({
  component: () => <Form />,
})

function Form() {
  return (
    <FormDataProvider>
      <RefreshHelperProvider uniqueKey={'formResetKey'}>
        <FormWithProviders />
      </RefreshHelperProvider>
    </FormDataProvider>
  )
}

function FormWithProviders() {
  const submitNewArtist = useNewArtistSubmission()
  const { artistId: id } = Route.useParams()
  const artistData = trpc.artist.getArtistById.useQuery({ id })
  const eventArtistData = trpc.eventArtist.getEventArtistById.useQuery({ id })

  const transformedArtistData = transformArtistToFormData(artistData.data)
  const transformedEventArtistData = transformEventArtistToFormData(eventArtistData.data)

  return (
    <MultiStepFormProvider submitStep={3} onSubmit={submitNewArtist}>
      <FormStep activeStep={1} stepId={ENTITY_FORM_KEY.artist}>
        <ArtistForm defaultValues={transformedArtistData} />
      </FormStep>
      <FormStep activeStep={2} stepId={ENTITY_FORM_KEY.eventArtist}>
        <EventArtistForm defaultValues={transformedEventArtistData} />
      </FormStep>
      <FormStep activeStep={3} stepId={'completeStep'}>
        <CompleteStep />
      </FormStep>
      {/*<FormWrapper validStep={3}>*/}
      {/*  <AllProductForm />*/}
      {/*</FormWrapper>*/}
    </MultiStepFormProvider>
  )
}
