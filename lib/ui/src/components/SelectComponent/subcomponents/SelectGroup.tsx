import React from "react";
import * as Select from "@radix-ui/react-select";

type Props = {
  children: React.ReactNode;
};

const SelectGroup = ({ children }: Props) => {
  return <Select.Group>{children}</Select.Group>;
};

export default SelectGroup;
