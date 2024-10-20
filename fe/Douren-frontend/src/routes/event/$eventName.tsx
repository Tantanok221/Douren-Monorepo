import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/event/$eventName')({
  component: () => <div>Hello /event/$eventName!</div>,
})
