import React from "react";
import style from "./TagFilter.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import { IoChevronDownOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import { TagItem } from "./subcomponent/TagItem";
import { useTagFilter } from "../../hooks/useTagFilter";
export const TagFilter = () => {
  const sx = classNames.bind(style);
  const allFilter = useTagFilter((state) => state.allFilter);
  const tagFilter = useTagFilter((state) => state.tagFilter);
  return (
    <IconContext.Provider value={{ color: "AAAAAA", size: "1.25rem" }}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <motion.div
            whileHover={{
              backgroundColor: "#4D4D4D",
            }}
            className={sx("popoverTrigger")}
          >
            <div className={sx("buttonContainer") + " noSelect"}>
              <div className={sx("buttonText")}>
                標簽:
                {tagFilter.length === 0 ? " 全部" : null}
                {tagFilter.length <= 3 && tagFilter.length !== 0
                  ? " "+ (tagFilter.map((item) => {
                      return item.tag;
                    }))
                  : null}
                {tagFilter.length > 3
                  ? " " + tagFilter.length + " 個標簽"
                  : null}
              </div>
              <IoChevronDownOutline />
            </div>
          </motion.div>
        </Popover.Trigger>

        <Popover.Content align={"start"} className={sx("tagContainer")}>
          <IconContext.Provider value={{ color: "AAAAAA", size: "1.5rem" }}>
            {allFilter.map((item, index) => (
              <TagItem key={item.tag} data={item} index={index} />
            ))}
          </IconContext.Provider>
        </Popover.Content>
      </Popover.Root>
    </IconContext.Provider>
  );
};
