import { ReactNode } from "react";


type props = {
  children: ReactNode
}
export const DisplayTitle = ({ children }: props) => {
  return <div className={"text-white font-bold "}>{children}</div>;
};

export const DisplayText = ({ children }: props) => {
  return <div className={"text-white "}>{children}</div>;
};
