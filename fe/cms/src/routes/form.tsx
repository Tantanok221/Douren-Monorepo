import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/form")({
  component: () => <Form />,
});

function Form() {
  // const [step, setStep] = useState(0);
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
