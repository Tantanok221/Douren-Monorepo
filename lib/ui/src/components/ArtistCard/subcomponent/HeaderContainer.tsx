import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import TitleContainer from "./TitleContainer.tsx";
import EventBookmarkContainer from "./EventBookmarkContainer.tsx";

interface Props {
  keys?: string;
  subtitleDisabled?: boolean;
}

const HeaderContainer = ({ keys, subtitleDisabled }: Props) => {
  const sx = classNames.bind(styles);
  console.log(keys?.split("/"))
  return (
    <div className={sx("headerContainer")}>
      <TitleContainer subtitleDisabled={subtitleDisabled} />
      {keys?.split('/')[1] === 'event' ? <EventBookmarkContainer keys={keys}/>: null}
    </div>
  );
};

export default HeaderContainer;
