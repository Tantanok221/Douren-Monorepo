import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/form")({
  component: () => <Form />,
});

function Form() {
  return (
    <div
      className={
        "flex flex-col px-6 py-8 w-full gap-8 bg-panel rounded-2xl justify-center items-start"
      }
    >
      <Outlet />
    </div>
  );
}
