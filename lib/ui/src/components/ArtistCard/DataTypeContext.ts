import { createContext, useContext } from "react";

type ArtistDataType = "FF" | "Artist" | "Event";
export const DataTypeContext = createContext<null | ArtistDataType>(null);

export const useDataTypeContext = () => {
  const context = useContext(DataTypeContext);
  if (!context)
    throw new Error("useDataTypeContext must be used within DataTypeContext");
  return context;
};
