import React from "react";
import style from "./Artist.module.css";
import classNames from "classnames/bind";
import { createFileRoute } from "@tanstack/react-router";
import { DataOperationProvider, FilterContainer, SearchBox } from "@lib/ui";
import { Animate } from "@/components";
import { ArtistContainer } from "@/routes/artist/-components/ArtistContainer.tsx";
import { useFetchTagData } from "@/hooks";

const sortItem = [{ text: "排序: 作者名稱", value: "Author_Main(Author)" }];

const Artist = () => {
  const sx = classNames.bind(style);
  const tag = useFetchTagData()
  return (
    <DataOperationProvider tag={tag}>
      <div className={sx("artistPage")}>
        <SearchBox />
        <FilterContainer sortItem={sortItem} />
        <ArtistContainer />
      </div>
    </DataOperationProvider>
  );
};

const AnimateArtist = Animate(Artist);
export const Route = createFileRoute("/artist/")({
  component: AnimateArtist,
});
