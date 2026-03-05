import type { ImgHTMLAttributes, SyntheticEvent } from "react";
import { useState } from "react";
import { FALLBACK_IMAGE } from "@/constants/fallbackImage";

type FallbackImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
};

export const FallbackImage = ({
  src,
  alt,
  onError,
  fallbackSrc = FALLBACK_IMAGE,
  ...imgProps
}: FallbackImageProps) => {
  const [hasError, setHasError] = useState(false);

  const imageSrc =
    !hasError && typeof src === "string" && src.length > 0 ? src : fallbackSrc;

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(event);
  };

  return <img {...imgProps} src={imageSrc} alt={alt} onError={handleError} />;
};
