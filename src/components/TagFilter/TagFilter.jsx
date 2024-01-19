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
      <Popover.Root className={sx("TagFilter")}>
        <Popover.Trigger className={sx("popoverTrigger")}>
          <motion.div className={sx("buttonContainer")}>
            <div className={sx("buttonText")}>標簽: 全部</div>
            <IoChevronDownOutline />
          </motion.div>
        </Popover.Trigger>

        <Popover.Content className={sx("tagContainer")}>
          <IconContext.Provider value={{ color: "AAAAAA", size: "1.5rem" }}>
            {allFilter.map((item, index) => (
              <TagItem key={[item, index]} data={item} index={index}/>
            ))}
          </IconContext.Provider>
        </Popover.Content>
      </Popover.Root>
    </IconContext.Provider>
  );
};
