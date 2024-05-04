import React from "react";
import classNames from "classnames/bind";
import styles from "../style.module.css";
import { useFFContext } from "../FFContext";
import { TagObject, useTagFilter } from "../../../hooks/useTagFilter";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useArtistCardContext } from "../ArtistCardContext";
import { processTagData } from "../../../helper/processTagData";
import TagContainer from "../../TagContainer/TagContainer";

interface Props {
  size?: "s" | "l";
  activeButton?: boolean;
}

const ArtistTagContainer = ({ size, activeButton }: Props) => {
  const sx = classNames.bind(styles);
  const data = useFFContext();
  const artistData = useArtistCardContext();

  const allTag = data
    ? (data.Tag ?? "").split(",")
    : artistData?.Author_Tag?.[0]?.Tag?.split(",");
  const renderTag = processTagData(allTag ?? []);
  return (
    <div className={sx("tagContainer")}>
      <TagContainer
        renderTag={renderTag}
        size={size}
        activeButton={activeButton}
      ></TagContainer>
    </div>
  );
};

export default ArtistTagContainer;
