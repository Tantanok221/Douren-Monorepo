import classNames from "classnames/bind";
import styles from "./EventPage.module.css";
import { motion } from "framer-motion";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop.tsx";
import SearchContainer from "@/routes/event/-components/SearchContainer.tsx";
import FilterContainer from "@/routes/event/-components/FilterContainer.tsx";
import ArtistContainer from "@/routes/event/-components/ArtistContainer.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { CollectionContextProvider, DataOperationProvider } from "@lib/ui";
import { trpc } from "@/helper/trpc.ts";
import { useTagFilter } from "@lib/ui/src/stores/useTagFilter.ts";
import { useEffect } from "react";
import { Animate } from "@/components/Animate/Animate.tsx";

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
export const Route = createFileRoute("/event/$eventName")({
  component: EventPageAnimate,
});
