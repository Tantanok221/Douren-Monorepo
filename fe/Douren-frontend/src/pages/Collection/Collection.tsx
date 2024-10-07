import { useEffect, useState } from "react";
import style from "./Collection.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useLegacyCollection } from "../../stores/useLegacyCollection.ts";
import ArtistCard from "../../components/ArtistCard/ArtistCard.tsx";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import Animate from "../../animate/Animate.tsx";
import { eventArtistBaseSchemaType } from "../../types/Artist.ts";
import { FF } from "../../types/FF.ts";
import CollectionLayout from "../../layouts/CollectionLayout/CollectionLayout.tsx";

export const Collection = () => {
  const [posts, setPosts] = useState(false);
  const sx = classNames.bind(style);
  const keyCollection = ["/event/ff43"];
  const collection = useLegacyCollection((state) => state.collection);
  const initCollection = useLegacyCollection((state) => state.initCollection);

  useEffect(() => {
    initCollection("FF42 Collection");
  }, []);
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
        <CollectionLayout title="FF43 收藏" keys="/event/ff43" />
        <CollectionLayout
          title="FF42 收藏"
          legacyData={collection}
          keys="FF42 Collection"
        />
      </motion.div>
      <ScrollToTop />
    </motion.div>
  );
};

const AnimateCollection = Animate(Collection);
export default AnimateCollection;
