export const ALL_TAGS_FILTER = "全部";

export const parseTagFilter = (rawTagFilter: string): string[] => {
  if (!rawTagFilter || rawTagFilter === ALL_TAGS_FILTER) {
    return [];
  }

  return rawTagFilter
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
};

export const serializeTagFilter = (tags: string[]): string => {
  const normalizedTags = Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    ),
  ).sort((left, right) => left.localeCompare(right));

  if (normalizedTags.length === 0) {
    return ALL_TAGS_FILTER;
  }

  return normalizedTags.join(",");
};
