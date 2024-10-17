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
  SearchContextProvider,
} from "@lib/ui";
import { Animate } from "@/components";

const Artist = () => {
  usePageInit();
  const sx = classNames.bind(style);

  const [page, setPage] = useState(1);
  const totalCount = useGetTotalPage("Author_Main", "Author=neq.");

  const totalPage = Math.ceil((totalCount as number) / 10);
  const pagination = usePagination({
    total: totalPage,
    page,
    siblings: 2,
    onChange: setPage,
  });
  // const { data } = useArtistQuery(page);

  const res = trpc.artist.getArtist.useQuery({
    search: "",
    searchTable: "",
    page: String(page),
    sort: "asc Author.Main()",
    tag: "",
  });
  console.log(res.data);
  if (!res.data) return null;

  return (
    <DataOperationProvider>
      <div className={sx("artistPage")}>
        <SearchBox />
        <div className={sx("mainContainer")}>
          {res.data.data?.map((item, index) => (
            <ArtistCard key={index} data={item}>
              <ArtistCard.ImageContainer />
              <ArtistCard.RightContainer>
                <div className={sx("rightHeaderContainer")}>
                  <ArtistCard.HeaderContainer></ArtistCard.HeaderContainer>
                  <ArtistCard.TagContainer size="s"></ArtistCard.TagContainer>
                </div>
                <ArtistCard.LinkContainer size="s">
                  <ArtistCard.Button size="s" />
                </ArtistCard.LinkContainer>
              </ArtistCard.RightContainer>
            </ArtistCard>
          ))}
        </div>
        <div className={sx("paginationContainer")}>
          <Pagination pagination={pagination} />
        </div>
        <NavbarMargin />
      </div>
    </DataOperationProvider>
  );
};

const AnimateArtist = Animate(Artist);
export const Route = createFileRoute("/artist/")({
  component: AnimateArtist,
});
