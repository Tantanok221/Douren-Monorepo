import style from "./collection.module.css";
import classNames from "classnames/bind";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import Animate from "../../animate/Animate.tsx";
import CollectionLayout from "../../layouts/CollectionLayout/CollectionLayout.tsx";
import {createFileRoute} from "@tanstack/react-router";

export const Collection = () => {
  const sx = classNames.bind(style);
  const keyCollection = ["/event/ff43"];

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
        <CollectionLayout title="FF43 收藏" keys="/event/FF43" />
      </motion.div>
      <ScrollToTop />
    </motion.div>
  );
};

const AnimateCollection = Animate(Collection);
export const Route = createFileRoute("/collection/")({
  component: AnimateCollection,
})
