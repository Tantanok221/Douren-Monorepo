import { Button, useRefreshHelperContext } from "@lib/ui";

export function CompleteStep() {
  const handleReset = useRefreshHelperContext();
  return (
    <div>
      <div className={"text-2xl font-sans font-semibold text-white"}>完成</div>
      <Button onClick={handleReset}>刷新</Button>
    </div>
  );
}
