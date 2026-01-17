import React from "react";
import style from "./TagContainer.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { TagObject } from "../../stores";
import { useTagFilterContext } from "../../context";

interface Props {
  renderTag: TagObject[];
  activeButton?: boolean;
  size?: "s" | "l";
}

export const TagContainer = ({ renderTag, activeButton, size }: Props) => {
  const addTagFilter = useTagFilterContext((state) => state.addTagFilter);
  const removeTagFilter = useTagFilterContext((state) => state.removeTagFilter);
  const checked = useTagFilterContext((state) => state.checked);
  const setChecked = useTagFilterContext((state) => state.setChecked);
  size = size ?? "l";

  function handleClick(val: TagObject) {
    if (!val.index) return null;
    if (!checked[val.index] && activeButton) {
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
      {renderTag.map((val) => {
        if (!val.tag) return null;
        if (!val.index) return null;
        const active = checked[val.index];
        return (
          <motion.button
            key={`${val.tag}-${val.index}`}
            onClick={() => handleClick(val)}
            className={sx("tagItem")}
            whileHover={{ scale: 1.1 }}
          >
            <div
              className={sx(
                "tagDescription",
                { activeTagCount: active },
                { smallText: size === "s" },
              )}
            >
              {val.tag}
            </div>
            <div
              className={sx(
                "tagCount",
                { activeTagDescription: active },
                { smallText: size === "s" },
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
