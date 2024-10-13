import { TagObject, useTagFilter } from "../stores/useTagFilter";

export function useProcessTagData(allTag: string[]) {
  const getTag = useTagFilter((state) => state.getTag);
  allTag?.filter((item) => item !== "");
  allTag = allTag?.map((item, index) => {
    return item.trim();
  });
  let renderTag: TagObject[][] | TagObject[] = [];
  allTag?.forEach((item, index) => {
    renderTag[index] = getTag(item);
  });

  renderTag = renderTag.flatMap((value) => value);
  return renderTag;
}
