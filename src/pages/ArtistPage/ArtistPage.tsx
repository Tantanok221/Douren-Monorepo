import React from "react";
import style from "./ArtistPage.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { processArtistData } from "../../helper/processArtistData";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { useTagFilter } from "../../hooks/useTagFilter";
import LazyImage from "../../components/LazyImage/LazyImage";
import LinkContainer from "../../components/LinkContainer/LinkContainer";
import { processTagData } from "../../helper/processTagData";
import { ArtistPageTypes, ArtistTypes } from "../../types/Artist";
import TagContainer from "../../components/TagContainer/TagContainer";
import ArtistStyle from "../../components/ArtistCard/style.module.css";
import { useMediaQuery } from "@uidotdev/usehooks";
import NavbarMargin from "../../components/Navbar/subcomponents/NavbarMargin";
import DMButton from "../../components/DMButton/component/DMButton";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import  useArtistLoader  from "../../hooks/useArtistLoader";
import Animate from "../../animate/Animate";

interface Props {}

const ArtistPage = ({}: Props) => {
  const { id = "" } = useParams<{ id: string }>();
  const uuid = parseInt(id, 10);
  const { data } = useArtistLoader(uuid);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  setAllFilter();
  
  const sx = classNames.bind(style);
  const ax = classNames.bind(ArtistStyle);

  const artistData: ArtistPageTypes | null = data ? data[0] : null;
  const artistTagData = processTagData(
    artistData?.Tags?.split(",") ?? [],
  );
  if (!artistData) return null;

  console.log(artistData);
  const artistLinkData = processArtistData(artistData);
  return (
    <motion.div className={sx("artistPage")}>
      <motion.div className={sx("mainContainer")}>
        <div className={sx("topContainer")}>
          <div className={sx("leftContainer")}>
            <div className={sx("imageContainer")}>
              <LazyImage
                alt={artistData.Author}
                photo={artistData.Photo}
              />
            </div>

            <div className={sx("linkContainer")}>
              <LinkContainer link={artistLinkData}></LinkContainer>
            </div>
          </div>
          <div className={sx("rightContainer")}>
            <div className={sx("headerContainer")}>
              <div className={ax("header")}>{artistData.Author}</div>
            </div>
            <div className={ax("tagContainer")}>
              <TagContainer renderTag={artistTagData}></TagContainer>
            </div>
            <div className={sx("introductionContainer")}>
              {artistData.Introduction
                ? artistData.Introduction
                : "大大没有留下任何自我介绍"}
            </div>
          </div>
        </div>
      </motion.div>
      <div className={sx("bottomContainer")}>
        {artistData?.Event_DM && artistData.Event_DM[0]?.DM ? (
          <div className={sx("dmText")}>過往DM</div>
        ) : null}
        <div className={sx("dmContainer")}>
          {artistData.Event_DM?.map((item, index) => {
            const link = (item?.DM ?? "").split("\n");

            return link[0] != "" ? (
              <div className={sx("dmCard")} key={index + "ArtistID"}>
                <div className={sx("dmEvent")}>{item.Event.name}</div>
                <DMButton link={link}></DMButton>
              </div>
            ) : null;
          })}
        </div>
      </div>
      <div className={sx("mediumContainer")}>
        <div className={sx("dmText")}>作品試閱</div>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="15px">
            {artistData.Author_Product?.map((item, index) => {
              const link = (item?.Preview ?? "").split("\n");
              return (
                <div className={sx("productCard")} key={artistData.Author}>
                  <LazyImage
                    width={"100%"}
                    photo={item.Thumbnail}
                    alt={item.Thumbnail}
                  ></LazyImage>
                  <div className={sx("productText")}>{item.Title}</div>
                  <DMButton link={link} text="查看產品試閱"></DMButton>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      <NavbarMargin></NavbarMargin>
    </motion.div>
  );
};
const AnimateArtistPage = Animate(ArtistPage);
export default AnimateArtistPage;
