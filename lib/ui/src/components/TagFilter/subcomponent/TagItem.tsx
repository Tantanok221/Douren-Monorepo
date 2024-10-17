import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import style from "../TagFilter.module.css";
import classNames from "classnames/bind";
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import { TagObject, useTagFilter } from "@lib/ui/src/stores/useTagFilter";

interface Props {
  data: TagObject;
  index: number;
}

export const TagItem = ({ data, index }: Props) => {
  const sx = classNames.bind(style);
  const { tag } = data;
  const addTagFilter = useTagFilter((state) => state.addTagFilter);
  const removeTagFilter = useTagFilter((state) => state.removeTagFilter);
  const checked = useTagFilter((state) => state.checked); // any to avoid type error cause by third party
  const setChecked = useTagFilter((state) => state.setChecked);
  return (
    <Checkbox.Root
      className={sx("tagItem")}
      checked={checked[index]}
      onCheckedChange={(check: boolean) => {
        setChecked(index, check);
        if (check) {
          addTagFilter(data);
        } else {
          removeTagFilter(data);
        }
      }}
    >
      {checked[index] ? <MdOutlineCheckBox /> : <MdCheckBoxOutlineBlank />}
      <div className={sx("tagLabel")}>{tag}</div>
    </Checkbox.Root>
  );
};
