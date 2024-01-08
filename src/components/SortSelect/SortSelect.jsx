import * as Select from "@radix-ui/react-select";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import classNames from "classnames/bind";
import React from "react";
import styles from "./style.module.css";
import { SelectItem } from "./subcomponent/SelectItem";
import { SelectSeperator } from "./subcomponent/SelectSeperator.jsx";
const SortSelect = ({ filter, setFilter }) => {
  const sx = classNames.bind(styles);
  return (
    <IconContext.Provider value={{ color: "AAAAAA", size: "1rem" }}>
      <Select.Root onValueChange={setFilter}>
        <Select.Trigger className={sx("selectTrigger")}>
          <Select.Value
            className={sx("selectText")}
            placeholder={"排序: A-Z"}
          />
          <Select.Icon>
            <IoChevronDownOutline />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content position="popper" className={sx("selectContent")}>
            <Select.ScrollUpButton>
              <IoChevronUpOutline />
            </Select.ScrollUpButton>

            <Select.Viewport className={sx("selectViewport")}>
              <Select.Group className={sx("selectGroup")}>
                <Select.Label className={sx("selectLabel")}>
                  排序方式(攤位名字)
                </Select.Label>
                <SelectItem text={"A-Z"} value={"A-Z"} />
                <SelectItem text={"Z-A"} value={"Z-A"} />

                <SelectSeperator />

                <Select.Label className={sx("selectLabel")}>
                  排序方式(攤位位置Day 1)
                </Select.Label>
                <SelectItem text={"A-Z"} value={"A-Z"} />
                <SelectItem text={"Z-A"} value={"Z-A"} />

                <SelectSeperator />

                <Select.Label className={sx("selectLabel")}>
                  排序方式(攤位位置Day 2)
                </Select.Label>
                <SelectItem text={"A-Z"} value={"A-Z"} />
                <SelectItem text={"Z-A"} value={"Z-A"} />

                <SelectSeperator />

                <Select.Label className={sx("selectLabel")}>
                  排序方式(攤位位置Day 3)
                </Select.Label>
                <SelectItem text={"A-Z"} value={"A-Z"} />
                <SelectItem text={"Z-A"} value={"Z-A"} />
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton>
              <IoChevronDownOutline />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </IconContext.Provider>
  );
};

export default SortSelect;
