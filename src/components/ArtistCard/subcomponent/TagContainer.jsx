import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { useTagFilter } from "../../../hooks/useTagFilter";
import { motion } from "framer-motion";
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

  function handleClick(val) {
    console.log(val)
    
    if (tagFilter.filter((item) => item === val).length === 0) {
      addTagFilter(val);
      setChecked(val.index ,true);
    } else {
      removeTagFilter(val);
      setChecked(val.index ,false);
    }
  }

  allTag.splice(allTag.length - 1, 1);
  let renderTag = [];
  allTag.forEach((item, index) => {
    renderTag[index] = getTag(item);
  });
  renderTag = renderTag.flatMap((value) => value);
  // console.log(renderTag[0])
  console.log(tagFilter);
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
