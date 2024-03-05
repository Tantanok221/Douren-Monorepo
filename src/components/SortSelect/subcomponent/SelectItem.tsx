// @ts-nocheck
import * as Select from "@radix-ui/react-select";
import classNames from "classnames/bind";
import styles from "../style.module.css";

import React from "react";

interface Props { 
  text: string
  value: [string,boolean,string]
}

export const SelectItem = ({text,value}:Props) => {
  const sx = classNames.bind(styles);

  return (
    <Select.Item className={sx("selectItem")} value={value}>
      <Select.ItemText>{text}</Select.ItemText>
      <Select.ItemIndicator/>
    </Select.Item>
  );
};
