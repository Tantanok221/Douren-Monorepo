import { Forms, useMultiStepFormContext } from "../../../../components";
import { ReactNode } from "react";

export function ConfirmStep() {
  const { goBackStep, artistStep, eventArtistStep, productStep } =
    useMultiStepFormContext((state) => state);
  if (!artistStep || !eventArtistStep || !productStep) return <></>;
  return <>
    <div className={"text-2xl font-sans font-semibold text-white"}>
      {"確認資訊"}
    </div>

  </>;
}