import React from "react";
import style from "./ArtistPage.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import { artistLoader } from "../../helper/artistLoader";
import { useGetImageSize } from "../../hooks/useGetImageSize";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { processArtistData } from "../../helper/processArtistData";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { useTagFilter } from "../../hooks/useTagFilter";
import LazyImage from "../../components/LazyImage/LazyImage";
import LinkContainer from "../../components/LinkContainer/LinkContainer";
import { processTagData } from "../../helper/processTagData";
import { ArtistTypes } from "../../types/Artist";
import TagContainer from "../../components/TagContainer/TagContainer";
import ArtistStyle from "../../components/ArtistCard/style.module.css";
interface Props {}

const ArtistPage = ({}: Props) => {
  let { id = "" } = useParams<{ id: string }>();
  let uuid = parseInt(id, 10);
  let { data } = artistLoader(uuid);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  setAllFilter();
  const width = useGetImageSize();
  const sx = classNames.bind(style);
  const ax = classNames.bind(ArtistStyle);

  let artistData:ArtistTypes|null = data ? data[0] : null;
  const artistTagData = processTagData(artistData?.Author_Tag?.[0]?.Tag?.split(",") ?? [])
  if (!artistData) return null;
  console.log(artistData);
  const artistLinkData = processArtistData(artistData);
  return (
    <motion.div className={sx("mainContainer")}>
      <div className={sx("topContainer")}>
        <div className={sx("leftContainer")}>
            <LazyImage
              alt={artistData.Author}
              photo={artistData.Photo}
            />
          
          <div className={sx("linkContainer")}>
            <LinkContainer link={artistLinkData} ></LinkContainer>
          </div>
        </div>
        <div className={sx("rightContainer")}>
          <div className={sx("headerContainer")}>
            <div className={ax('header')}>{artistData.Author}</div>
          </div>
          <div className={ax("tagContainer")}>
            <TagContainer renderTag={artistTagData}></TagContainer>
          </div>
          <div className={sx("introductionContainer")}>{artistData.Introduction}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtistPage;
