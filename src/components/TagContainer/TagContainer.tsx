import React from "react";
import style from "./TagContainer.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { TagObject, useTagFilter } from "../../hooks/useTagFilter";

interface Props {
  renderTag: TagObject[];
  activeButton?: boolean;
  size?: "s" | "l";
}

const TagContainer = ({ renderTag, activeButton, size }: Props) => {
  const tagFilter = useTagFilter((state) => state.tagFilter);
  const addTagFilter = useTagFilter((state) => state.addTagFilter);
  const removeTagFilter = useTagFilter((state) => state.removeTagFilter);
  const checked = useTagFilter((state) => state.checked);
  const setChecked = useTagFilter((state) => state.setChecked);
  size = size ?? "l";
  function handleClick(val: TagObject) {
    if (tagFilter.filter((item) => item === val).length === 0 && activeButton) {
      addTagFilter(val);
      setChecked(val.index, true);
    } else {
      removeTagFilter(val);
      setChecked(val.index, false);
    }
  }

  const sx = classNames.bind(style);
  return (
    <>
      {renderTag.map((val, index) => {
        let active = tagFilter.filter((item) => item === val).length !== 0;
        return (
          <motion.button
            key={index + val.tag}
            onClick={() => handleClick(val)}
            className={sx("tagItem")}
            whileHover={{ scale: 1.1 }}
          >
            <div
              className={sx(
                "tagDescription",
                { activeTagCount: active },
                { smallText: size === "s" }
              )}
            >
              {val.tag}
            </div>
            <div
              className={sx(
                "tagCount",
                { activeTagDescription: active },
                { smallText: size === "s" }
              )}
            >
              {val.count}
            </div>
          </motion.button>
        );
      })}
    </>
  );
};

export default TagContainer;
