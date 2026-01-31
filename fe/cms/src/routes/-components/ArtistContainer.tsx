import { usePagination } from "@mantine/hooks";
import { Plus } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import {
  Pagination,
  usePaginationContext,
  useSearchContext,
  useSearchColumnContext,
  useSortSelectContext,
  useTagFilterContext,
} from "@lib/ui";

import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { ArtistTable } from "@/components/ArtistCard";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/usePermissions";
import { trpc } from "@/lib/trpc";

export const ArtistContainer = () => {
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();
  const [search] = useSearchContext();
  const [searchColumn] = useSearchColumnContext();
  const tagFilter = useTagFilterContext((state) => state.tagFilter);
  const allTag = tagFilter.map((val) => val.tag).join(",");
  const [sortSelect] = useSortSelectContext();
  const [page, setPage] = usePaginationContext();
  const { data: roleData, isLoading: isRoleLoading } = useUserRole();

  const queryParams = {
    search: search,
    searchTable: searchColumn,
    page: String(page),
    sort: sortSelect,
    tag: allTag,
  };

  const adminRes = trpc.artist.getArtist.useQuery(queryParams, {
    enabled: !!session,
  });

  const userRes = trpc.admin.getMyArtistsPaginated.useQuery(queryParams, {
    enabled: !!session,
  });

  const res = roleData?.isAdmin ? adminRes : userRes;
  const pagination = usePagination({
    total: res?.data?.totalPage ?? 20,
    page,
    siblings: 2,
    onChange: setPage,
  });

  // Get my artists for permission checking
  const { data: myArtists } = trpc.admin.getMyArtists.useQuery(undefined, {
    enabled: !!session,
  });

  if (isRoleLoading || !roleData) return null;
  if (!res.data) return null;

  const myArtistIds = myArtists?.map((a) => a.uuid) ?? [];

  const totalPages = res.data.totalPage ?? 1;
  const hasArtists = res.data.data && res.data.data.length > 0;

  if (!hasArtists) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-500 text-lg">您尚未上傳任何藝術家資料。</p>
        <p className="text-gray-400 text-sm mt-2">
          請新增您的第一位藝術家以開始使用。
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/new">
            <Plus size={20} />
            新增藝術家
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ArtistTable
        artists={res.data.data ?? []}
        isAdmin={roleData?.isAdmin ?? false}
        myArtistIds={myArtistIds}
      />
      {totalPages > 1 && (
        <div className="w-full flex justify-center">
          <Pagination pagination={pagination} />
        </div>
      )}
    </div>
  );
};
