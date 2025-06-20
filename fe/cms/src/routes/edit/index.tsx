import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit/')({
  component: () => <div>Hello /edit/!</div>,
})
