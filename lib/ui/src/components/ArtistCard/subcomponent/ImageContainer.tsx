import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { LazyImage } from "../../LazyImage/LazyImage";
import { useEventDataContext } from "../EventDataContext";

const ImageContainer = () => {
  const sx = classNames.bind(styles);
  const eventData = useEventDataContext();
  return (
    <div className={sx("imageContainer")}>
      {eventData?.photo ? (
        <LazyImage alt={eventData?.author as string} photo={eventData?.photo} />
      ) : null}
    </div>
  );
};

export default ImageContainer;
