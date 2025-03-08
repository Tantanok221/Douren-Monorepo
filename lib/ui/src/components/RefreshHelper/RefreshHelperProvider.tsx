import { createContext, ReactNode, useContext, useState } from "react";
import { ArtistPageContext } from "doujinbooth/src/routes/artist/$artistId/-context/ArtistPageContext/ArtistPageContext.tsx";

interface Props {
  children: ReactNode;
  uniqueKey: string;
}
type RefreshFunc = () => void;

const RefreshHelperContext = createContext<RefreshFunc | null>(null);

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

export const useRefreshHelperContext = () => {
  const data = useContext(RefreshHelperContext);
  if (!data) {
    throw new Error(
      "useRefreshHelperContext must be used within RefreshHelperContext",
    );
  }
  return data;
};
