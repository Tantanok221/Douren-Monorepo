import { useMemo, useState } from "react";
import type { ImgHTMLAttributes, SyntheticEvent } from "react";

type FallbackImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  src?: string | null;
  alt: string;
};

const createFallbackImageDataUri = (alt: string): string => {
  const safeAlt = alt.trim().length > 0 ? alt.trim() : "Artwork";
  const label = safeAlt.replace(/[<>&'"]/g, "");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'><rect width='640' height='640' fill='#E5E7EB'/><rect x='156' y='180' width='328' height='280' rx='20' fill='#D1D5DB'/><circle cx='250' cy='270' r='34' fill='#9CA3AF'/><path d='M180 430l94-104 68 74 70-64 48 94H180z' fill='#9CA3AF'/><text x='320' y='522' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='#6B7280'>${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const FallbackImage = ({
  src,
  alt,
  onError,
  ...imgProps
}: FallbackImageProps) => {
  const fallbackSrc = useMemo(() => createFallbackImageDataUri(alt), [alt]);
  const [hasError, setHasError] = useState(false);

  const imageSrc =
    !hasError && typeof src === "string" && src.length > 0 ? src : fallbackSrc;

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(event);
  };

  return <img {...imgProps} src={imageSrc} alt={alt} onError={handleError} />;
};
