import {createFileRoute, useNavigate} from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => {
    const navigate = Route.useNavigate()
    navigate({
      to: "/event/$eventName",
      // mask: "/",
      params: {
        eventName: "FF43"
      }
    })
    return <div/>
  },
})