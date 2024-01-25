import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useArtistCardContext } from "../ArtistCardContext";
import { useTagFilter } from "../../../hooks/useTagFilter";

const TagContainer = () => {
  const sx = classNames.bind(styles);
  const data = useArtistCardContext();
  const getTag = useTagFilter((state) => state.getTag);
  const allTag = (data.tag ?? "").split(",");
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
            return (
              <div key={index + val.tag} className={sx("tagItem")}>
                <div className={sx("tagDescription")}>{val.tag}</div>
                <div className={sx("tagCount")}>{val.count}</div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default TagContainer;
