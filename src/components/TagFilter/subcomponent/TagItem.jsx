import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import style from "../TagFilter.module.css";
import classNames from "classnames/bind";
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import { useTagFilter } from "../../../hooks/useTagFilter";

export const TagItem = ({ data }) => {
  const sx = classNames.bind(style);
  const [checked, setChecked] = React.useState(false);
  const { tag } = data;
  const addTagFilter = useTagFilter((state) => state.addTagFilter);
  const removeTagFilter = useTagFilter((state) => state.removeTagFilter);
  return (
    <Checkbox.Root
      className={sx("tagItem")}
      defaultChecked={false}
      checked={checked}
      onCheckedChange={(check) => {
        setChecked(check);
        if (check) {
          addTagFilter(data);
        } else {
          removeTagFilter(data);
        }
      }}
    >
      {checked ? <MdOutlineCheckBox /> : <MdCheckBoxOutlineBlank />}
      <div className={sx("tagLabel")}>{tag}</div>
    </Checkbox.Root>
  );
};
