import React from "react";
import style from "./ArtistPage.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import { artistLoader } from "../../helper/artistLoader";
import { useGetImageSize } from "../../hooks/useGetImageSize";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { LinkResult, processLink } from "../../helper/processLink";
import { processArtistData } from "../../helper/processArtistData";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import ImageContainer from "../../components/ArtistCard/subcomponent/ImageContainer";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer";
import TagContainer from "../../components/ArtistCard/subcomponent/TagContainer";
import { useTagFilter } from "../../hooks/useTagFilter";
import IntroductionContainer from "../../components/ArtistCard/subcomponent/IntroductionContainer";

interface Props {}

const ArtistPage = ({}: Props) => {
  let { id = "" } = useParams<{ id: string }>();
  let uuid = parseInt(id, 10);
  let { data } = artistLoader(uuid);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  setAllFilter();
  const width = useGetImageSize();
  const sx = classNames.bind(style);

  if (!data) return null;
  let ArtistData = data[0];
  console.log(ArtistData);
  return (
    <motion.div className={sx("mainContainer")}>
      <ArtistCard artistData={ArtistData}>
        <div className={sx("leftContainer")}>
          <ImageContainer followContainerSize></ImageContainer>
          <ArtistLinkContainer></ArtistLinkContainer>0
        </div>
        <div className={sx("rightContainer")}>
          <HeaderContainer subtitleDisabled></HeaderContainer>
          <TagContainer></TagContainer>
          <IntroductionContainer></IntroductionContainer>
        </div>
      </ArtistCard>
    </motion.div>
  );
};

export default ArtistPage;
