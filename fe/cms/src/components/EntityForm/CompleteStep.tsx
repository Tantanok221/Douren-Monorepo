import { Button, useRefreshHelperContext } from "@lib/ui";
import { useFormDataContext } from "../FormDataContext/useFormDataContext";
import { CircleNotch, CheckCircle, XCircle } from "@phosphor-icons/react";

export function CompleteStep() {
  const handleReset = useRefreshHelperContext();
  const status = useFormDataContext((state) => state.submissionStatus);

  const getStatusIcon = () => {
    switch (status.stage) {
      case "uploading":
      case "submitting":
        return (
          <CircleNotch
            size={48}
            className="animate-spin text-blue-400"
            weight="bold"
          />
        );
      case "complete":
        return <CheckCircle size={48} className="text-green-400" weight="fill" />;
      case "error":
        return <XCircle size={48} className="text-red-400" weight="fill" />;
      default:
        return (
          <CircleNotch
            size={48}
            className="animate-spin text-blue-400"
            weight="bold"
          />
        );
    }
  };

  const getMessage = () => {
    if (status.stage === "idle") return "處理中...";
    return status.message;
  };

  const isComplete = status.stage === "complete";
  const isError = status.stage === "error";

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {getStatusIcon()}
      <div className="text-2xl font-sans font-semibold text-white">
        {getMessage()}
      </div>
      {(isComplete || isError) && (
        <Button onClick={handleReset}>
          {isComplete ? "新增另一位作者" : "重試"}
        </Button>
      )}
    </div>
  );
}
