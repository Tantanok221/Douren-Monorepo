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
import { useUpdateArtistSubmission } from '../../hooks/useUpdateArtistSubmission.ts'
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
  const submitUpdateArtist = useUpdateArtistSubmission()
  const { artistId: id } = Route.useParams()
  const artistData = trpc.artist.getArtistById.useQuery({ id })
  const eventArtistData = trpc.eventArtist.getEventArtistById.useQuery({ id })

  const transformedArtistData = transformArtistToFormData(artistData.data)
  const transformedEventArtistData = transformEventArtistToFormData(eventArtistData.data)

  return (
    <MultiStepFormProvider submitStep={3} onSubmit={submitUpdateArtist}>
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
