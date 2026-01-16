import { trpc } from "@/lib/trpc";

import {
  ArtistCard,
  Pagination,
  usePaginationContext,
  useSearchContext,
  useSortSelectContext,
  useTagFilterContext,
} from "@lib/ui";
import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ArtistEditButton } from "@/components";
import { usePagination } from "@mantine/hooks";
import { useUserRole } from "@/hooks/usePermissions";

export const ArtistContainer = () => {
  const [search] = useSearchContext();
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const allTag = tagFilter.map((val) => val.tag).join(",");
  const [sortSelect] = useSortSelectContext();
  const [page, setPage] = usePaginationContext();
  const { data: roleData } = useUserRole();

  const queryParams = {
    search: search,
    searchTable: "",
    page: String(page),
    sort: sortSelect,
    tag: allTag,
  };

  const adminRes = trpc.artist.getArtist.useQuery(queryParams, {
    enabled: roleData?.isAdmin === true,
  });

  const userRes = trpc.admin.getMyArtistsPaginated.useQuery(queryParams, {
    enabled: roleData?.isAdmin === false,
  });

  const res = roleData?.isAdmin ? adminRes : userRes;
  const pagination = usePagination({
    total: res?.data?.totalPage ?? 20,
    page,
    siblings: 2,
    onChange: setPage,
  });
  if (!res.data) return null;
  return (
    <>
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
                  <ArtistEditButton />
                </ArtistCard.LinkContainerWrapper>
              </ArtistCard.RightContainer>
            </ArtistCard>
          ))}
        </Masonry>
      </ResponsiveMasonry>
      <div className={"w-full flex justify-center"}>
        <Pagination pagination={pagination} />
      </div>
    </>
  );
};
