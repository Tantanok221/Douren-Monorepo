import React, { useEffect } from "react";
import style from "./Collection.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useCollection } from "../../hooks/useCollection.ts";
import ArtistCard from "../../components/ArtistCard/ArtistCard.tsx";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import Animate from "../../animate/Animate.tsx";
import ImageContainer from "../../components/ArtistCard/subcomponent/ImageContainer.tsx";
import DayContainer from "../../components/ArtistCard/subcomponent/DayContainer";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer.tsx";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer.tsx";
import DMButton from "../../components/ArtistCard/subcomponent/ArtistDMButton.tsx";
import ArtistTagContainer from "../../components/ArtistCard/subcomponent/ArtistTagContainer.tsx";

export const Collection = () => {
  const [posts, setPosts] = React.useState(false);
  const sx = classNames.bind(style);
  const initCollection = useCollection((state) => state.initCollection);
  const collection = useCollection((state) => state.collection);
  useEffect(() => {
    initCollection();
    setPosts(true);
  }, []);
  if (!posts) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.15 }}
      className={sx("mainContainer")}
    >
      <motion.div className={sx("collectionLayout")}>
        <div className={sx("headerContainer")}>
          <div id="top" className={sx("title")}>
            我的收藏
          </div>
          <div className={sx("subtitle")}>透過標簽功能來加入我的收藏</div>
        </div>
        <div className={sx("artistContainer")}>
          {collection.length !== 0 ? (
            collection.map((item, index) => {
              return (
                <ArtistCard key={`${item.uuid}`} data={item}>
                  <ImageContainer />
                  <RightContainer>
                    <HeaderContainer bookmarkEnabled />
                    <ArtistTagContainer />
                    <DayContainer />
                    <ArtistLinkContainer>
                      <DMButton />
                    </ArtistLinkContainer>
                  </RightContainer>
                </ArtistCard>
              );
            })
          ) : (
            <div className={sx("emptyText")}>
              你目前還沒有把任何攤位加入我的收藏！
            </div>
          )}
        </div>
      </motion.div>
      <ScrollToTop />
    </motion.div>
  );
};

const AnimateCollection = Animate(Collection);
export default AnimateCollection;
