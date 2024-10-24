import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type Props = {
  width?: string;
  photo: string;
  alt: string | undefined;
};

export const LazyImage = ({ width, alt, photo }: Props) => {
  width = width ?? "100%";
  return (
    <>
      <LazyLoadImage
        width={width}
        alt={`${alt} pictures`}
        className="image"
        effect="blur"
        src={photo}
      />
    </>
  );
};
