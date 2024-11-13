import React, { forwardRef, useEffect } from "react";
import style from "./TagFilter.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import { IoChevronDownOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import { TagItem } from "./subcomponent";
import { TagObject, usePaginationContext, useTagFilterContext } from "@lib/ui";

export const TagFilter = () => {
  const allFilter = useTagFilterContext((state) => state.allFilter);
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const [, setPage] = usePaginationContext();
  useEffect(() => {
    setPage(1);
  }, [setPage, tagFilter]);
  return <PureTagFilter selectedTag={tagFilter} allTag={allFilter} />;
};

interface PureTagFilterProps {
  allTag: TagObject[];
  selectedTag: TagObject[];
}

export const PureTagFilter = forwardRef<HTMLDivElement,PureTagFilterProps>(({ allTag, selectedTag },ref) => {
  const sx = classNames.bind(style);
  if (!allTag) return <></>;
  return (
    <IconContext.Provider value={{ color: "AAAAAA", size: "1.25rem" }}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <motion.div
            ref={ref}
            whileHover={{
              backgroundColor: "#4D4D4D",
            }}
            className={sx("popoverTrigger")}
          >
            <div className={sx("buttonContainer") + " noSelect"}>
              <div className={sx("buttonText")}>
                標簽:
                {selectedTag.length === 0 ? " 全部" : null}
                {selectedTag.length <= 3 && selectedTag.length !== 0
                  ? " " +
                    selectedTag.map((item) => {
                      return item.tag;
                    })
                  : null}
                {selectedTag.length > 3
                  ? " " + selectedTag.length + " 個標簽"
                  : null}
              </div>
              <IoChevronDownOutline />
            </div>
          </motion.div>
        </Popover.Trigger>

        <Popover.Content align={"start"} className={sx("tagContainer")}>
          <IconContext.Provider value={{ color: "AAAAAA", size: "1.5rem" }}>
            {allTag.map((item) => {
              if (!item.index) return null;
              return <TagItem key={item.tag} data={item} index={item.index} />;
            })}
          </IconContext.Provider>
        </Popover.Content>
      </Popover.Root>
    </IconContext.Provider>
  );
})
PureTagFilter.displayName = "PureTagFilter"
