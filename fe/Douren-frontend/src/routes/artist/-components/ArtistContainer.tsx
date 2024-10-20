import { ArtistCard, Pagination, useSearchContext, useSortSelectContext, useTagFilter } from "@lib/ui";
import React, { useState } from "react";
import classNames from "classnames/bind";
import style from "@/routes/artist/Artist.module.css";
import { usePagination } from "@mantine/hooks";
import { trpc } from "@/helper";


export const ArtistContainer = () => {
  const [search] = useSearchContext();
  const [page, setPage] = useState(1);
  const sx = classNames.bind(style);
  const tagFilter = useTagFilter((state) => state.tagFilter);
  const allTag = tagFilter.map((val) => val.tag).join(",");
  const [sortSelect] = useSortSelectContext();
  const res = trpc.artist.getArtist.useQuery({
    search: search,
    searchTable: "",
    page: String(page),
    sort: sortSelect,
    tag: allTag
  });
  const pagination = usePagination({
    total: res?.data?.totalPage ?? 20,
    page,
    siblings: 2,
    onChange: setPage
  });

  if (!res.data) return null;
  return <>
    <div className={sx("mainContainer")}>
      {res.data.data?.map((item, index) => (
        <ArtistCard key={index} data={item}>
          <ArtistCard.ImageContainer />
          <ArtistCard.RightContainer>
            <div className={sx("rightHeaderContainer")}>
              <ArtistCard.HeaderContainer/>
              <ArtistCard.TagContainer size="s" activeButton/>
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
  </>;
};