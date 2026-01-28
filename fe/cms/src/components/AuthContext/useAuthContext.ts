import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuthContext = () => {
  const data = useContext(AuthContext);
  if (!data) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return data;
};
