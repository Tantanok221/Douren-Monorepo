import { useMediaQuery } from '@mantine/hooks';

export function useGetImageSize() {
  let width = "500px"
  const tabSize = useMediaQuery('(min-width: 1340px)');
  
  const phoneSize = useMediaQuery('(max-width: 590px)');
  const smallPhoneSize = useMediaQuery('(max-width: 445px)');
  if(tabSize) {
    width = "48rem"
  }
  if(phoneSize) {
    width = "35rem"
  }
  if(smallPhoneSize){
    width = "25rem"
  }
  return width
}