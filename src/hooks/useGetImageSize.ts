import { useMediaQuery } from "@mantine/hooks";

export function useGetImageSize() {
  let width = "30rem";
  const phoneSize = useMediaQuery("(max-width: 1000px)");
  const smallPhoneSize = useMediaQuery("(max-width: 800px)");

  if (phoneSize) {
    width = "25rem";
  }
  if (smallPhoneSize) {
    width = "25rem";
  }
  return width;
}
