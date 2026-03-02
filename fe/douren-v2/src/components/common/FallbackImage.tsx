import type { ImgHTMLAttributes, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { FALLBACK_IMAGE } from "@/constants/fallbackImage";

interface FallbackImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const normalizeImageSrc = (value?: string) => value?.trim() ?? "";

export const FallbackImage = ({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  onError,
  ...props
}: FallbackImageProps) => {
  const initialSrc =
    normalizeImageSrc(typeof src === "string" ? src : undefined) || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setCurrentSrc((previousSrc) =>
      previousSrc === fallbackSrc ? previousSrc : fallbackSrc,
    );
    onError?.(event);
  };

  return <img {...props} src={currentSrc} onError={handleError} />;
};
