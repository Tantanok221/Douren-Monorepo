import { TagObject,  useTagFilterContext } from "@lib/ui";

export function useProcessTagData(allTag: string[]) {
  const getTag = useTagFilterContext((state) => state.getTag);
  allTag?.filter((item) => item !== "");
  allTag = allTag?.map((item ) => {
    return item.trim();
  });
  let renderTag: TagObject[][] | TagObject[] = [];
  allTag?.forEach((item, index) => {
    renderTag[index] = getTag(item);
  });

  renderTag = renderTag.flatMap((value) => value);
  return renderTag;
}
