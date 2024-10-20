import React, { useEffect, useState } from "react";
import style from "./Artist.module.css";
import classNames from "classnames/bind";
import { usePagination } from "@mantine/hooks";
import { useGetTotalPage } from "@/hooks";
import { trpc } from "@/helper/trpc.ts";
import { usePageInit } from "@/hooks/usePageInit.ts";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArtistCard,
  DataOperationProvider,
  NavbarMargin,
  Pagination,
  SearchBox,
  SearchContextProvider, useSearchContext
} from "@lib/ui";
import { Animate } from "@/components";
import { ArtistContainer } from "@/routes/artist/-components/ArtistContainer.tsx";
import { FilterContainer } from "@/components/FilterContainer/FilterContainer.tsx";

const sortItem = [
  { text: "排序: 作者名稱", value: "Author_Main(Author)" },
];

const Artist = () => {
  usePageInit();
  const sx = classNames.bind(style);
  const totalCount = useGetTotalPage("Author_Main", "Author=neq.");

  const totalPage = Math.ceil((totalCount as number) / 10);

  return (
    <DataOperationProvider>
      <div className={sx("artistPage")}>
        <SearchBox />
        <FilterContainer sortItem={sortItem}/>
        <ArtistContainer/>
      </div>
    </DataOperationProvider>
  );
};

const AnimateArtist = Animate(Artist);
export const Route = createFileRoute("/artist/")({
  component: AnimateArtist,
});
