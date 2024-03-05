import * as Select from "@radix-ui/react-select";
import classNames from "classnames/bind";
import styles from "../style.module.css";

import React from "react";


export const SelectSeperator = () => {
  const sx = classNames.bind(styles);
  return <Select.Separator asChild >
    <div className={sx("seperator")}></div>
  </Select.Separator>;
};
