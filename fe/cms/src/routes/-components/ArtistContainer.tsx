import { trpc } from "../../helper/trpc.ts";
import { ArtistCard, useSearchContext, useSortSelectContext, useTagFilter } from "@lib/ui";
import React, { useState } from "react";

export const ArtistContainer = () => {
  const [search] = useSearchContext();
  const [page, ] = useState(1);
  const tagFilter = useTagFilter((state) => state.tagFilter);
  const allTag = tagFilter.map((val) => val.tag).join(",");
  const [sortSelect] = useSortSelectContext();
  const res = trpc.artist.getArtist.useQuery({
    search: search,
    searchTable: "",
    page: String(page),
    sort: sortSelect,
    tag: allTag,
  });
  if(!res.data) return null;
  console.log(res.data)
  return <>
    {res.data.data?.map((item, index) => (
      <ArtistCard key={index} data={item}>
        <ArtistCard.ImageContainer />
        <ArtistCard.RightContainer>
          {/*<div className={sx("rightHeaderContainer")}>*/}
            <div>
            <ArtistCard.HeaderContainer />
            <ArtistCard.TagContainer size="s" activeButton />
          </div>
          <ArtistCard.LinkContainer size="s">
            {/*<ArtistCard.Button size="s" />*/}
          </ArtistCard.LinkContainer>
        </ArtistCard.RightContainer>
      </ArtistCard>
    ))}
  </>
}