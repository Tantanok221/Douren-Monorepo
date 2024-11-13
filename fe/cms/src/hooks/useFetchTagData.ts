import { trpc } from "../helper/trpc.ts";


export function useFetchTagData() {
  const tag = trpc.tag.getTag.useQuery(["tag"])
  return tag.data
}
