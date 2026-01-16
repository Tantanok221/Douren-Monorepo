import { ReactNode, useState } from "react";
import { RefreshHelperContext } from "./RefreshHelperContext.tsx";

interface Props {
  children: ReactNode;
  uniqueKey: string;
}
type RefreshFunc = () => void;

export const RefreshHelperProvider = ({ uniqueKey, children }: Props) => {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <RefreshHelperContext.Provider
      key={`RefreshHelper ${resetKey} ${uniqueKey}`}
      value={handleReset}
    >
      {children}
    </RefreshHelperContext.Provider>
  );
};
