import { useContext } from "react";
import { RefreshHelperContext } from "./RefreshHelperProvider.tsx";

export const useRefreshHelperContext = () => {
  const data = useContext(RefreshHelperContext);
  if (!data) {
    throw new Error(
      "useRefreshHelperContext must be used within RefreshHelperContext",
    );
  }
  return data;
};
