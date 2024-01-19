import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import style from "../TagFilter.module.css";
import classNames from "classnames/bind";
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";

export const TagItem = ({ tag,count }) => {
  const sx = classNames.bind(style);
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox.Root
      className={sx("tagItem")}
      defaultChecked={false}
      checked={checked}
      onCheckedChange={(check) => {
        setChecked(check);

      }}
    >
      {checked ? <MdOutlineCheckBox /> : <MdCheckBoxOutlineBlank />}
      <div className={sx("tagLabel")}>{tag}</div>
    </Checkbox.Root>
  );
};
