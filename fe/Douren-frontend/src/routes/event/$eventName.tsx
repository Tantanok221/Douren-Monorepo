import classNames from "classnames/bind";
import styles from "./EventPage.module.css";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import Animate from "../../animate/Animate.tsx";
import SearchContainer from "@/routes/event/-subcomponent/SearchContainer.tsx";
import FilterContainer from "@/routes/event/-subcomponent/FilterContainer.tsx";
import ArtistContainer from "@/routes/event/-subcomponent/ArtistContainer.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { CollectionContextProvider } from "@lib/ui/src/context/CollectionContext/index.tsx";
import { trpc } from "@/helper/trpc.ts";
import { useTagFilter } from "@lib/ui/src/stores/useTagFilter.ts";
import { useEffect } from "react";
import { PaginationContextProvider } from "@/context/PaginationContext/PaginationContext.tsx";
import { SearchColumnContextProvider } from "@/context/SearchColumnContext/SearchColumnContext.tsx";
import { SortSelectContextProvider } from "@/context/SortSelectContext/SortSelectContext.tsx";
import { DataOperationProvider } from "@/context/DataOperationContext";

export const Route = createFileRoute("/event/$eventName")({
  component: EventName,
});

function EventName() {
  const tag = trpc.tag.getTag.useQuery();
  const setAllTag = useTagFilter((state) => state.setAllFilter);
  useEffect(() => {
    if (tag.data) {
      setAllTag(tag.data);
    }
  }, [tag.data, setAllTag]);
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
        <DataOperationProvider>
          <SearchContainer />
          <FilterContainer />
          <ArtistContainer />
          <ScrollToTop />
        </DataOperationProvider>
      </CollectionContextProvider>
    </motion.div>
  );
}

const EventPageAnimate = Animate(EventName);
