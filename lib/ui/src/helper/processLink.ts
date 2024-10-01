export interface LinkResult {
  category: string;
  link: string;
  name: string;
}

export function processLink(
  links: string | null,
  names: string | null,
  category: string,
) {
  if (!links) {
    return [];
  }
  const link = (links ?? "").split("\n");
  const name = (names ?? "")?.split("\n");
  const result: LinkResult[] = [];

  link?.forEach((item, index) => {
    result.push({
      category: category ?? "",
      link: item ?? "",
      name: name[index] ?? name[0],
    });
  });
  return result;
}
