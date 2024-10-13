import React, { useEffect, useState } from "react";
import style from "./Artist.module.css";
import classNames from "classnames/bind";
import { useTagFilter } from "../../stores/useTagFilter";
import ArtistCard from "@lib/ui/src/components/ArtistCard";
import SearchBox from "../../components/SearchBox/SearchBox";
import { useSearch } from "../../stores/useSearch";
import Animate from "../../animate/Animate";
import { usePagination } from "@mantine/hooks";
import Pagination from "../../components/Pagination/Pagination";
import { useGetTotalPage } from "../../hooks/useGetTotalPage";
import NavbarMargin from "../../components/NavMenu/subcomponents/NavbarMargin";
import { trpc } from "@/helper/trpc.ts";
import { usePageInit } from "@/hooks/usePageInit.ts";
import { createFileRoute } from "@tanstack/react-router";

const Artist = () => {
  usePageInit();
  const sx = classNames.bind(style);
  const setAllFilter = useTagFilter((state) => state.setAllFilter);
  const resetSearch = useSearch((state) => state.resetSearch);

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
    <>
      <div className={sx("artistPage")}>
        <SearchBox></SearchBox>
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
        <NavbarMargin></NavbarMargin>
      </div>
    </>
  );
};

const AnimateArtist = Animate(Artist);
export const Route = createFileRoute("/artist/")({
  component: AnimateArtist,
});
