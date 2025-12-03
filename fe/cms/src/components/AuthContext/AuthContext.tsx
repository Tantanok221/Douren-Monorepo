import { createContext, ReactNode } from "react";
import { AuthClient } from "@/lib/auth";

export const AuthContext = createContext<AuthClient | null>(null);

type Props = {
  children: ReactNode;
  data: AuthClient;
};

export const AuthProvider = ({ children, data }: Props) => {
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
