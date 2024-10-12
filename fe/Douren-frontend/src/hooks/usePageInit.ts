import { useEffect } from "react";
import { useTagFilter } from "../stores/useTagFilter";
import {trpc} from "@/helper/trpc.ts";

export function usePageInit() {
  const tag = trpc.tag.getTag.useQuery()
  const setAllTag = useTagFilter((state) => state.setAllFilter)
  useEffect(() => {
    if (tag.data) {
      setAllTag(tag.data)
    }
  },[tag.data, setAllTag])
}