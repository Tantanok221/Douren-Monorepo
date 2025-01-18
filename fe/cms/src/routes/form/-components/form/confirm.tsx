import { useMultiStepFormContext } from "../../../../components";

export function ConfirmStep() {
  const {  artistStep, eventArtistStep, productStep } =
    useMultiStepFormContext((state) => state);
  if (!artistStep || !eventArtistStep || !productStep) return <></>;
  return (
    <>
      <div className={"text-2xl font-sans font-semibold text-white"}>
        {"上傳資料中..."}
      </div>
    </>
  );
}
