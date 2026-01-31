import { Button, useRefreshHelperContext } from "@lib/ui";
import { useFormDataContext } from "../FormDataContext/useFormDataContext";
import { CircleNotch, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "@tanstack/react-router";

export function CompleteStep() {
  const handleReset = useRefreshHelperContext();
  const status = useFormDataContext((state) => state.submissionStatus);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnEditPage = location.pathname.startsWith("/edit");
  const isOnNewPage = location.pathname.startsWith("/new");

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
        return (
          <CheckCircle size={48} className="text-green-400" weight="fill" />
        );
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

  const handleAddNewArtist = () => {
    // If already on /new, do full page reload to reset state
    // If on /edit, use router navigation (no reload needed)
    if (isOnNewPage) {
      window.location.href = "/new";
    } else {
      navigate({ to: "/new" });
    }
  };

  const handleEditArtist = () => {
    if (status.stage === "complete") {
      // If already on /edit, do full page reload to get fresh data
      // If on /new, use router navigation (no reload needed)
      if (isOnEditPage) {
        window.location.href = `/edit/${status.artistId}`;
      } else {
        navigate({
          to: "/edit/$artistId",
          params: { artistId: status.artistId },
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {getStatusIcon()}
      <div className="text-2xl font-sans font-semibold text-white">
        {getMessage()}
      </div>
      {isComplete && (
        <div className="flex gap-4">
          <Button onClick={handleAddNewArtist}>新增另一位作者</Button>
          <Button onClick={handleEditArtist}>編輯此作者</Button>
        </div>
      )}
      {isError && <Button onClick={handleReset}>重試</Button>}
    </div>
  );
}
