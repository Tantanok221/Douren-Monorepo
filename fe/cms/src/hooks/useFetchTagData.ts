import { trpc } from "@/helper";

export function useFetchTagData() {
  // @ts-expect-error Type error from trpc useQuery Lib
  const tag = trpc.tag.getTag.useQuery(["tag"]);
  return tag.data;
}
