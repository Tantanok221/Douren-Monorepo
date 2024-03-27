import React from "react";
import styles from "../style.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useArtistCardContext } from "../ArtistCardContext";
import { IconContext } from "react-icons";
import { IoLibraryOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

interface Props {
  size?: "s" | "l";
}

const ArtistButton = ({ size }: Props) => {
  const sx = classNames.bind(styles);
  const artistData = useArtistCardContext();
  size = size ?? "l";
  const fontSize = size === "s" ? "1rem" : "1.5rem";
  return (
    <IconContext.Provider
      value={{
        color: "#000",
        size: fontSize,
      }}
    >
      <Link to={"/"} className={sx("artistButton","smallText")}>
        <IoLibraryOutline />
        详细资讯

      </Link>
    </IconContext.Provider>
  );
};

export default ArtistButton;
