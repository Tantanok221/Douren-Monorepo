import { trpc } from "@/lib/trpc";
import {
  Pagination,
  usePaginationContext,
  useSearchContext,
  useSearchColumnContext,
  useSortSelectContext,
  useTagFilterContext,
} from "@lib/ui";
import { usePagination } from "@mantine/hooks";
import { useUserRole } from "@/hooks/usePermissions";
import { ArtistTable } from "@/components/ArtistCard";

export const ArtistContainer = () => {
  const [search] = useSearchContext();
  const [searchColumn] = useSearchColumnContext();
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const allTag = tagFilter.map((val) => val.tag).join(",");
  const [sortSelect] = useSortSelectContext();
  const [page, setPage] = usePaginationContext();
  const { data: roleData } = useUserRole();

  const queryParams = {
    search: search,
    searchTable: searchColumn,
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

  // Get my artists for permission checking (only for non-admins)
  const { data: myArtists } = trpc.admin.getMyArtists.useQuery(undefined, {
    enabled: roleData?.isAdmin === false,
  });

  if (!res.data) return null;

  const myArtistIds = myArtists?.map((a) => a.uuid) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <ArtistTable
        artists={res.data.data ?? []}
        isAdmin={roleData?.isAdmin ?? false}
        myArtistIds={myArtistIds}
      />
      <div className="w-full flex justify-center">
        <Pagination pagination={pagination} />
      </div>
    </div>
  );
};
