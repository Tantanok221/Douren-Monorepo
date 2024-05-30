import { useEffect, useState } from "react";
import style from "./Collection.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useLegacyCollection } from "../../stores/useLegacyCollection.ts";
import ArtistCard from "../../components/ArtistCard/ArtistCard.tsx";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import Animate from "../../animate/Animate.tsx";
import { ArtistEventType } from "../../types/Artist.ts";
import { FF } from "../../types/FF.ts";
import CollectionLayout from "../../layouts/CollectionLayout/CollectionLayout.tsx";

export const Collection = () => {
  const [posts, setPosts] = useState(false);
  const sx = classNames.bind(style);
  const keyCollection = ["event/ff43"];
  const [allCollection, setAllCollection] = useState<ArtistEventType[]>([]);
  const collection = useLegacyCollection((state) => state.collection);
  const initCollection = useLegacyCollection((state) => state.initCollection);

  useEffect(() => {
    initCollection("FF42 Collection");
    keyCollection.map((key) => {
      const collection = JSON.parse(localStorage.getItem(key) as string);
      console.log(collection);
      if (collection) {
        setAllCollection(collection);
      }
    });
    setPosts(true);
  }, []);
  console.log(allCollection);
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
          <CollectionLayout legacyData={collection} keys="FF42 Collection" />{" "}
        </div>
        {collection.length === 0 && allCollection.length === 0 ? (
          <div className={sx("emptyText")}>
            你目前還沒有把任何攤位加入我的收藏！
          </div>
        ) : null}
      </motion.div>
      <ScrollToTop />
    </motion.div>
  );
};

const AnimateCollection = Animate(Collection);
export default AnimateCollection;
