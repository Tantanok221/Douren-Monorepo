import { DMButton, LazyImage, LinkContainer, TagContainer, processArtistData } from "@lib/ui";
import React from "react";
import classNames from "classnames/bind";
import ArtistStyle from "@lib/ui/src/components/ArtistCard/style.module.css";
import { useProcessTagData } from "@/helper";
import { ArtistPageTypes } from "@/types";
import style from "@/routes/artist/$artistId/ArtistPage.module.css";
import useArtistLoader from "@/hooks/useArtistLoader.ts";
import { Route } from "@/routes/artist/$artistId";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";
import { useArtistPageContext } from "@/routes/artist/$artistId/-context/ArtistPageContext/useArtistPageContext.ts";

export const ShowcaseLayout = () => {
  const ax = classNames.bind(ArtistStyle);
  const sx = classNames.bind(style);
  const artistData = useArtistPageContext();
  const artistLinkData = processArtistData(artistData);
  const artistTagData = useProcessTagData(artistData?.tags?.split(",") ?? []);

  return (
    <motion.div className={sx("mainContainer")}>
      <div className={sx("topContainer")}>
        <div className={sx("leftContainer")}>
          <div className={sx("imageContainer")}>
            {artistData.photo ? (
              <LazyImage alt={artistData.author} photo={artistData.photo} />
            ) : null}
          </div>

          <div className={sx("linkContainer")}>
            <LinkContainer link={artistLinkData} />
          </div>
        </div>
        <div className={sx("rightContainer")}>
          <div className={sx("headerContainer")}>
            <div className={ax("header")}>{artistData.author}</div>
          </div>
          <div className={ax("tagContainer")}>
            <TagContainer renderTag={artistTagData} />
          </div>
          <div className={sx("introductionContainer")}>
            {artistData.introduction
              ? artistData.introduction
              : "大大没有留下任何自我介绍"}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
