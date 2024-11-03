import { trpc } from "../../helper/trpc.ts";
import {
  ArtistCard,
  Pagination,
  usePaginationContext,
  useSearchContext,
  useSortSelectContext,
  useTagFilterContext
} from "@lib/ui";
import React, { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { EditButton } from "../../components/EditButton.tsx";
import { usePagination } from "@mantine/hooks";

export const ArtistContainer = () => {
  const [search] = useSearchContext();
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const allTag = tagFilter.map((val) => val.tag).join(",");
  const [sortSelect] = useSortSelectContext();
  const [page, setPage] = usePaginationContext();
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
  console.log(res.data);
  return <>
    <ResponsiveMasonry columnsCountBreakPoints={{ 200: 1, 700: 2, 900: 4 }}>
      <Masonry gutter="32px">
        {res.data.data?.map((item, index) => (
          <ArtistCard key={index} data={item}>
            <ArtistCard.RightContainer>
              <ArtistCard.ImageContainer />
              {/*<div className={sx("rightHeaderContainer")}>*/}
              <div>
                <ArtistCard.HeaderContainer />
                <ArtistCard.TagContainer size="s" activeButton />
              </div>
              <ArtistCard.LinkContainerWrapper size="s">
                <EditButton />
              </ArtistCard.LinkContainerWrapper>
            </ArtistCard.RightContainer>
          </ArtistCard>
        ))}
      </Masonry>
    </ResponsiveMasonry>
    <div className={"w-full flex justify-center"}>
    <Pagination pagination={pagination} />
    </div>
  </>;
};