import React from "react";
import style from "./TagContainer.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
// import { TagObject, useTagFilter } from "@/stores/useTagFilter.ts";
import {tagSchemaType} from "@pkg/type";

interface Props {
  renderTag: tagSchemaType[];
  activeButton?: boolean;
  id: string | number;
  size?: "s" | "l";
}

const TagContainer = ({ id, renderTag, activeButton, size }: Props) => {
  size = size ?? "l";

  const sx = classNames.bind(style);
  return (
    <>
      {renderTag?.map((val) => {
        return (
          <motion.button
            key={id + val.tagName}
            className={sx("tagItem")}
            whileHover={{ scale: 1.1 }}
          >
            <div
              className={sx(
                "tagDescription",
                // { activeTagCount: active },
                { smallText: size === "s" },
              )}
            >
              {val.tagName}
            </div>
            <div
              className={sx(
                "tagCount",
                // { activeTagDescription: active },
                { smallText: size === "s" },
              )}
            >
              {val.tagCount}
            </div>
          </motion.button>
        );
      })}
    </>
  );
};

export default TagContainer;
