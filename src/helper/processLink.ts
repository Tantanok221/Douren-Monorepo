export interface LinkResult {
  category: string
  link: string
  name: string
}

export function processLink(links: string | null, names: string | null, category: string) {
  if (!links) {
    return [];
  }
  let link = (links ?? "").split("\n");
  let name = (names ?? "")?.split("\n");
  let result:LinkResult[] = [];

  link?.forEach((item, index) => {
    result.push({
      category: category ?? "",
      link: item ?? "",
      name: name[index] ?? "",
    });
  });
  return result;
}