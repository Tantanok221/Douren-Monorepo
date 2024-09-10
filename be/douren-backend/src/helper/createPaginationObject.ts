export function createPaginationObject<T>(
  data: T,
  currentPage: number,
  pageSize: number,
  totalCount: number
) {
  const totalPage = Math.ceil(totalCount / pageSize);
  return {
    data,
    totalCount,
    totalPage,
    nextPageAvailable: currentPage < totalPage,
    previousPageAvailable: currentPage > 1,
    pageSize,
  };
}
