import classNames from "classnames/bind";
import styles from "./EventPage.module.css";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import Animate from "../../animate/Animate.tsx";
import { useLocation } from "react-router";
import { usePageInit } from "@/hooks/usePageInit.ts";
import SearchContainer from "@/routes/event/-subcomponent/SearchContainer.tsx";
import FilterContainer from "@/routes/event/-subcomponent/FilterContainer.tsx";
import ArtistContainer from "@/routes/event/-subcomponent/ArtistContainer.tsx";
import { SortSelectContextProvider } from "./-context/SortSelectContext/SortSelectContext.tsx";
import { SearchColumnContextProvider } from "./-context/SearchColumnContext/SearchColumnContext.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/helper/trpc.ts";
import {CollectionContextProvider} from "@lib/ui/src/context/CollectionContext/index.tsx";

export const Route = createFileRoute("/event/$eventName")({
  component: EventName,
});

function EventName() {
  // usePageInit();


  const sx = classNames.bind(styles);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={sx("MainContainer")}
    >
      <CollectionContextProvider keys={Route.fullPath}>
        <SortSelectContextProvider defaultValue="Author_Main(Author) asc">
          <SearchColumnContextProvider defaultValue="Booth_name">
            <SearchContainer />
            <FilterContainer />
            <ArtistContainer />
            <ScrollToTop />
          </SearchColumnContextProvider>
        </SortSelectContextProvider>
      </CollectionContextProvider>
    </motion.div>
  );
}

const EventPageAnimate = Animate(EventName);
