import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext.ts";
import TitleContainer from "./TitleContainer.tsx";
import LegacyBookmarkContainer from "./LegacyBookmarkContainer.tsx";

interface Props {
  keys?: string;
  subtitleDisabled?: boolean;
}

const HeaderContainer = ({ keys, subtitleDisabled }: Props) => {
  const sx = classNames.bind(styles);
  return (
    <div className={sx("headerContainer")}>
      <TitleContainer subtitleDisabled={subtitleDisabled} />
      {keys === 'FF42 Collection' ? <LegacyBookmarkContainer keys={keys} /> : null}
    </div>
  );
};

export default HeaderContainer;
