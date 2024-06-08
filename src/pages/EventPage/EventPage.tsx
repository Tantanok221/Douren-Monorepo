import classNames from "classnames/bind";
import styles from "./EventPage.module.css";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import Animate from "../../animate/Animate.tsx";
import {  useLocation } from "react-router";
import { usePageInit } from "../../hooks/usePageInit.ts";
import { CollectionContextProvider } from "../../context/CollectionContext/CollectionContext.tsx";
import SearchContainer from "./subcomponent/SearchContainer.tsx";
import FilterContainer from "./subcomponent/FilterContainer.tsx";
import ArtistContainer from "./subcomponent/ArtistContainer.tsx";

function EventPage() {
  
  
  
  usePageInit();

  const location = useLocation();
  console.log(location.pathname);
  

  
  const sx = classNames.bind(styles);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={sx("MainContainer")}
    >
      <CollectionContextProvider keys={location.pathname}>
        <SearchContainer/>
        <FilterContainer/>
        <ArtistContainer/>
        <ScrollToTop />
      </CollectionContextProvider>
    </motion.div>
  );
}

const EventPageAnimate = Animate(EventPage);
export default EventPageAnimate;
