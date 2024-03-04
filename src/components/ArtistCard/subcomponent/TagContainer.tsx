import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { TagObject, useTagFilter } from '../../../hooks/useTagFilter';
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';
const TagContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  const getTag = useTagFilter((state) => state.getTag);
  const allTag = (data.tag ?? "").split(",");
  const tagFilter = useTagFilter((state) => state.tagFilter);
  const addTagFilter = useTagFilter((state) => state.addTagFilter);
  const removeTagFilter = useTagFilter((state) => state.removeTagFilter);
  const checked = useTagFilter((state) => state.checked);
  const setChecked = useTagFilter((state) => state.setChecked);
  const location = useLocation();

  function handleClick(val:TagObject) {
    
    if (tagFilter.filter((item) => item === val).length === 0 && location.pathname != "/collection") {
      addTagFilter(val);
      setChecked(val.index ,true);
    } else {
      removeTagFilter(val);
      setChecked(val.index ,false);
    }
  }
  allTag.filter((item) => item !== "")
  let renderTag: TagObject[][]|TagObject[] = [];
  allTag.forEach((item, index) => {
    renderTag[index] = getTag(item);
  });
  console.log(renderTag)
  renderTag = renderTag.flatMap((value) => value);
  return (
    <div className={sx("tagContainer")}>
      {data.tag
        ? renderTag.map((val, index) => {
            let active = tagFilter.filter((item) => item === val).length !== 0;
            return (
              <motion.button
                key={index + val.tag}
                onClick={() => handleClick(val)}
                className={sx("tagItem")}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className={sx("tagDescription", { activeTagCount: active })}
                >
                  {val.tag}
                </div>
                <div
                  className={sx("tagCount", { activeTagDescription: active })}
                >
                  {val.count}
                </div>
              </motion.button>
            );
          })
        : null}
    </div>
  );
};

export default TagContainer;
