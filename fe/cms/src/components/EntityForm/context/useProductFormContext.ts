import { useContext } from "react";
import { ProductFormContext } from "./ProductFormContext";

export const useProductFormContext = () => {
  const data = useContext(ProductFormContext);
  if (!data)
    throw new Error(
      "useProductFormContext cannot be use within ProductFormContextProvider",
    );
  return data;
};
