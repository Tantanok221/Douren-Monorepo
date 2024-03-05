// @ts-nocheck
import * as Select from "@radix-ui/react-select";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import classNames from "classnames/bind";
import React from "react";
import styles from "./style.module.css";
import { SelectItem } from "./subcomponent/SelectItem.tsx";
import { SelectSeperator } from "./subcomponent/SelectSeperator.tsx";
import { useSort } from "../../hooks/useSort.ts";
import { motion } from "framer-motion";
const SortSelect = () => {
  const ascending = useSort((state) => state.ascending);
  const name = useSort((state) => state.name);
  const setFilter = useSort((state) => state.setFilter);
  const sx = classNames.bind(styles);
  return (
    <IconContext.Provider value={{ color: "AAAAAA", size: "1.25rem" }}>
      <Select.Root onValueChange={setFilter}> 
        <Select.Trigger asChild>
          <motion.div
            className={sx("selectTrigger") + " noSelect"}
            whileHover={{
              backgroundColor: "#4D4D4D",
            }}
          >
            <div className={sx("selectText")}>
              排序: {name + " "} {ascending ? "A-Z" : "Z-A"}
            </div>
            <Select.Icon className={sx("selectIcon")}>
              <IoChevronDownOutline />
            </Select.Icon>
          </motion.div>
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
                <SelectItem
                  text={"A-Z"}
                  value={["Booth_name", true, "攤位名字"]}
                />
                {/* <SelectItem
                  text={"Z-A"}
                  value={["author_name", false, "攤位名字"]}
                /> */}

                <SelectSeperator />

                <Select.Label className={sx("selectLabel")}>
                  排序方式(攤位位置Day 1)
                </Select.Label>
                <SelectItem
                  text={"A-Z"}
                  value={["DAY01_location", true, "攤位位置Day 1"]}
                />
                {/* <SelectItem
                  text={"Z-A"}
                  value={["DAY01_location", false, "攤位位置Day 1"]}
                /> */}

                <SelectSeperator />

                <Select.Label className={sx("selectLabel")}>
                  排序方式(攤位位置Day 2)
                </Select.Label>
                <SelectItem
                  text={"A-Z"}
                  value={["DAY02_location", true, "攤位位置Day 2"]}
                />
                {/* <SelectItem
                  text={"Z-A"}
                  value={["DAY02_location", false, "攤位位置Day 2"]}
                /> */}

                <SelectSeperator />

                <Select.Label className={sx("selectLabel")}>
                  排序方式(攤位位置Day 3)
                </Select.Label>
                <SelectItem
                  text={"A-Z"}
                  value={["DAY03_location", true, "攤位位置Day 3"]}
                />
                {/* <SelectItem
                  text={"Z-A"}
                  value={["DAY03_location", false, "攤位位置Day 3"]}
                /> */}
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
