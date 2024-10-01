import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useEventDataContext } from "../EventDataContext";

interface Props {
  subtitleDisabled?: boolean;
}

const TitleContainer = ({ subtitleDisabled }: Props) => {
  const sx = classNames.bind(styles);
  const eventData = useEventDataContext();
  let subtitle: string | undefined = "";
  let title: string | undefined = "";
  if(eventData?.boothName){
    title = eventData?.boothName;
    subtitle = eventData?.author;
  }else {
    title = eventData?.author
  }

  return (
    <div className={sx("titleContainer")}>
      <div className={sx("header")}>{title}</div>
      {subtitleDisabled ? null : (
        <div className={sx("subheader")}>{subtitle}</div>
      )}
    </div>
  );
};

export default TitleContainer;
