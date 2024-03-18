import { useMediaQuery } from '@mantine/hooks';

export function useGetImageSize() {
  let width = "40rem"  
  const phoneSize = useMediaQuery('(max-width: 590px)');
  const smallPhoneSize = useMediaQuery('(max-width: 445px)');

  if(phoneSize) {
    width = "35rem"
  }
  if(smallPhoneSize){
    width = "25rem"
  }
  return width
}