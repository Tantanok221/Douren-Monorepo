import classNames from "classnames/bind";
import styles from "./EventPage.module.css";
import { motion } from "framer-motion";
import {
  CollectionContextProvider,
  DataOperationProvider,
  FilterContainer,
  SearchContainer,
} from "@lib/ui";
import { createFileRoute } from "@tanstack/react-router";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop.tsx";
import { Animate } from "@/components";
import EventContainer from "@/routes/event/-components/EventContainer.tsx";
import { useFetchTagData } from "@/hooks";

const sortItem = [
  { text: "排序: 作者名稱", value: "Author_Main(Author)" },
  { text: "排序: 攤位名稱", value: "Booth_name" },
  { text: "排序: 攤位位置 Day 01", value: "Location_Day01" },
  { text: "排序: 攤位位置 Day 02", value: "Location_Day02" },
  { text: "排序: 攤位位置 Day 03", value: "Location_Day03" },
];
function EventName() {
  const tag = useFetchTagData()
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
        <DataOperationProvider tag={tag}>
          <SearchContainer />
          <FilterContainer sortItem={sortItem} />
          <EventContainer />
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
