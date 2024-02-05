import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { useTagFilter } from "../../../hooks/useTagFilter";
import { TagFilter } from "../../TagFilter/TagFilter";

const TagContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  const getTag = useTagFilter((state) => state.getTag);
  const allTag = (data.tag ?? "").split(",");
  const tagFilter = useTagFilter((state) => state.tagFilter);
  const addTagFilter = useTagFilter((state) => state.addTagFilter);
  function handleClick(val) {
    if(tagFilter.filter((item) => item === val).length === 0) {
      addTagFilter(val);
    }
  }

  allTag.splice(allTag.length - 1, 1);
  let renderTag = [];
  allTag.forEach((item, index) => {
    renderTag[index] = getTag(item);
  });
  renderTag = renderTag.flatMap((value) => value);

  return (
    <div className={sx("tagContainer")}>
      {data.tag
        ? renderTag.map((val, index) => {
          let active = tagFilter.filter((item) => item === val).length !== 0
            return (
              <button
                key={index + val.tag}
                onClick={() => handleClick(val)}
                className={sx("tagItem")}
              >
                <div className={sx("tagDescription",{activeTagCount: active} )}>{val.tag}</div>
                <div className={sx("tagCount",{activeTagDescription: active})}>{val.count}</div>
              </button>
            );
          })
        : null}
    </div>
  );
};

export default TagContainer;
