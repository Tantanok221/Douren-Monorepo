import {trpc} from "../../helper/trpc.ts";
import {ArtistCard, useSearchContext, useSortSelectContext, useTagFilter} from "@lib/ui";
import React, {useState} from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

export const ArtistContainer = () => {
  const [search] = useSearchContext();
  const [page,] = useState(1);
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
  if (!res.data) return null;
  console.log(res.data)
  return <>
    <ResponsiveMasonry columnsCountBreakPoints={{200: 1, 700: 2}}>
      <Masonry gutter="32px">
        {res.data.data?.map((item, index) => (
          <ArtistCard key={index} data={item}>
            <ArtistCard.RightContainer>
            <ArtistCard.ImageContainer/>
              {/*<div className={sx("rightHeaderContainer")}>*/}
              <div>
                <ArtistCard.HeaderContainer/>
                <ArtistCard.TagContainer size="s" activeButton/>
              </div>
              <ArtistCard.LinkContainerWrapper size="s">
              </ArtistCard.LinkContainerWrapper>
            </ArtistCard.RightContainer>
          </ArtistCard>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  </>
}