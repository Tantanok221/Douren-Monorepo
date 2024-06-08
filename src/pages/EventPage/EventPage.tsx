import React, { useEffect, useState } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard.tsx";
import classNames from "classnames/bind";
import SearchBox from "../../components/SearchBox/SearchBox.tsx";
import SortSelect from "../../components/SortSelect/SortSelect.tsx";
import styles from "./EventPage.module.css";
import { useSort } from "../../stores/useSort.ts";
import { TagFilter } from "../../components/TagFilter/TagFilter.tsx";
import { useTagFilter } from "../../stores/useTagFilter.ts";
import { useSearch } from "../../stores/useSearch.ts";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import { usePosition } from "../../stores/usePosition.ts";
import Animate from "../../animate/Animate.tsx";
import { useNextPageAvailable } from "../../stores/useNextPageAvailable.ts";
import ImageContainer from "../../components/ArtistCard/subcomponent/ImageContainer.tsx";
import TagContainer from "../../components/ArtistCard/subcomponent/ArtistTagContainer.tsx";
import DayContainer from "../../components/ArtistCard/subcomponent/DayContainer.tsx";
import ArtistLinkContainer from "../../components/ArtistCard/subcomponent/ArtistLinkContainer.tsx";
import HeaderContainer from "../../components/ArtistCard/subcomponent/HeaderContainer.tsx";
import RightContainer from "../../components/ArtistCard/subcomponent/RightContainer.tsx";
import DMButton from "../../components/ArtistCard/subcomponent/ArtistDMButton.tsx";
import { useEventIDQuery } from "../../hooks/useEventIDQuery.ts";
import { useLoaderData, useLocation } from "react-router";
import { usePageInit } from "../../hooks/usePageInit.ts";
import { CollectionContextProvider } from "../../context/CollectionContext/CollectionContext.tsx";
import SelectComponent from "../../components/SelectComponent/SelectComponent.tsx";
import SearchContainer from "./subcomponent/SearchContainer.tsx";
import FilterContainer from "./subcomponent/FilterContainer.tsx";
import ArtistContainer from "./subcomponent/ArtistContainer.tsx";

function EventPage() {
  
  
  
  usePageInit();

  const location = useLocation();
  console.log(location.pathname);
  

  if (status === "error") {
    return <div>error</div>;
  }
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
