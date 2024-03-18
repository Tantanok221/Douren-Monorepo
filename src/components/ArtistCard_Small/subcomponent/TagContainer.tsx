import React from "react";
import { useArtistCardSmallContext } from "../ArtistCardSmallContext";
import style from "../style.module.css";
import classNames from "classnames/bind";
import { TagObject, useTagFilter } from "../../../hooks/useTagFilter";
import { motion } from "framer-motion";

type Props = {};

const TagContainer = (props: Props) => {
  const data = useArtistCardSmallContext();
  const sx = classNames.bind(style);
  let allTag = data.Author_Tag ? data.Author_Tag[0].Tag?.split(",") : [];
  allTag?.filter((item) => item !== "");
  allTag = allTag?.map((item, index) => {
    return item.trim();
  });

  const getTag = useTagFilter((state) => state.getTag);

  console.log(allTag);
  let renderTag: TagObject[][] | TagObject[] = [];
  allTag?.forEach((item, index) => {
    renderTag[index] = getTag(item);
  });
  renderTag = renderTag.flatMap((value) => value);
  console.log(renderTag);
  return (
    <div className={sx("tagContainer")}>
      {data.Author_Tag
        ? renderTag.map((val, index) => {
            return (
              <motion.button
                key={index + val.tag}
                className={sx("tagItem")}
              >
                <div className={sx("tagDescription")}>{val.tag}</div>
                <div className={sx("tagCount")}>{val.count}</div>
              </motion.button>
            );
          })
        : null}
    </div>
  );
};

export default TagContainer;
