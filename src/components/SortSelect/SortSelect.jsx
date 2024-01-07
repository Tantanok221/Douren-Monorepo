import * as Select from "@radix-ui/react-select";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import classNames from "classnames/bind";
import React from "react";
import styles from "./style.module.css";
const SortSelect = () => {
  const sx = classNames.bind(styles);
  return (
    <IconContext.Provider value={{ color: "AAAAAA", size: "1rem" }}>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="排序:" />
          <Select.Icon >
            <IoChevronDownOutline />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content>
            <Select.ScrollUpButton >
              <IoChevronUpOutline />
            </Select.ScrollUpButton>
            <Select.Viewport>
              <Select.Group>
                <Select.Label>排序方式(攤位名字)</Select.Label>
                <Select.Item value="A-Z">A-Z</Select.Item>
                <Select.Item value="Z-A">Z-A</Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>排序方式(攤位位置Day 1)</Select.Label>
                <Select.Item value="A-Z">A-Z</Select.Item>
                <Select.Item value="Z-A">Z-A</Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>排序方式(攤位位置Day 2)</Select.Label>
                <Select.Item value="A-Z">A-Z</Select.Item>
                <Select.Item value="Z-A">Z-A</Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>排序方式(攤位位置Day 3)</Select.Label>
                <Select.Item value="A-Z">A-Z</Select.Item>
                <Select.Item value="Z-A">Z-A</Select.Item>
              </Select.Group>
              <Select.Separator />
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </IconContext.Provider>
  );
};

export default SortSelect;
