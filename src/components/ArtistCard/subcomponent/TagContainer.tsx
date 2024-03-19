import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { TagObject, useTagFilter } from "../../../hooks/useTagFilter";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useArtistCardContext } from "../ArtistCardContext";
const TagContainer = () => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const artistData = useArtistCardContext();
  const getTag = useTagFilter((state) => state.getTag);
  const tagFilter = useTagFilter((state) => state.tagFilter);
  const addTagFilter = useTagFilter((state) => state.addTagFilter);
  const removeTagFilter = useTagFilter((state) => state.removeTagFilter);
  const checked = useTagFilter((state) => state.checked);
  const setChecked = useTagFilter((state) => state.setChecked);
  const location = useLocation();
  

  function handleClick(val: TagObject) {
    if (
      tagFilter.filter((item) => item === val).length === 0 &&
      location.pathname != "/collection"
    ) {
      addTagFilter(val);
      setChecked(val.index, true);
    } else {
      removeTagFilter(val);
      setChecked(val.index, false);
    }
  }
  let allTag = data ? (data.Tag ?? "").split(",") : artistData?.Author_Tag?.[0]?.Tag?.split(",")
  allTag?.filter((item) => item !== "");
  allTag = allTag?.map((item, index) => {return item.trim();});
  let renderTag: TagObject[][] | TagObject[] = [];
  allTag?.forEach((item, index) => {renderTag[index] = getTag(item);});

  renderTag = renderTag.flatMap((value) => value);
  return (
    <div className={sx("tagContainer")}>
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
        }
    </div>
  );
};

export default TagContainer;
