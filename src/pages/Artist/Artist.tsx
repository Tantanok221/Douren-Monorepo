import React from "react";
import style from "./Artist.module.css";
import classNames from "classnames/bind";
import { useLocation } from "react-router";

type Props = {};

const Artist = (props: Props) => {
  const sx = classNames.bind(style);
  const location = useLocation();

  return <div className={sx("mainContainer")}>
    Artist
    </div>;
};

export default Artist;
