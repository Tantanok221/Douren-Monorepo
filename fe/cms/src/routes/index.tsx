import { createFileRoute } from "@tanstack/react-router";
import { DataOperationProvider } from "@lib/ui/src/context/DataOperationContext/DataOperationContext";
import { FilterContainer } from "@lib/ui/src/components/FilterContainer/FilterContainer";
import { SearchContainer } from "@lib/ui/src/components/SearchContainer/SearchContainer";
import { ArtistContainer } from "./-components/ArtistContainer.tsx";
import { useFetchTagData } from "@/hooks";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
});

const sortItem = [{ text: "排序: 作者名稱", value: "Author_Main(Author)" }];

function InviteCodeDisplay() {
  const { data: inviteSettings } = trpc.invite.getMyInviteSettings.useQuery();

  if (!inviteSettings) return null;

  return (
    <Card className="py-4">
      <CardHeader className="pb-2 pt-0">
        <CardTitle className="text-base">邀請代碼</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-xl font-semibold">
              {inviteSettings.inviteCode}
            </code>
            <span className="text-sm text-muted-foreground">
              (剩餘次數: {inviteSettings.remainingInvites}/
              {inviteSettings.maxInvites})
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            分享此代碼給您的朋友，讓他們也能加入 Douren CMS。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Index() {
  const tag = useFetchTagData();
  const authClient = useAuthContext();
  const { data: session } = authClient.useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64 text-center">
        <p className="text-xl text-gray-600">你還沒登入</p>
      </div>
    );
  }

  return (
    <div className={"flex flex-col w-full gap-8"}>
      <InviteCodeDisplay />
      <DataOperationProvider tag={tag}>
        <div className={"flex flex-col w-full gap-6"}>
          <SearchContainer />
          <FilterContainer sortItem={sortItem} />
        </div>
        <div>
          <ArtistContainer />
        </div>
      </DataOperationProvider>
    </div>
  );
}
