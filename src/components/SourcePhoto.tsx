import type { CSSProperties } from "react";

// Crop the supplied photo in the browser; keep the original file untouched.
export function SourcePhoto({
  src, alt, crop, width, height, className = "", style,
}: {
  src: string; alt: string; crop: readonly [number, number, number, number];
  width: number; height: number; className?: string; style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={crop.join(" ")}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
      className={`h-full w-full ${className}`}
      style={style}
    >
      <image href={src} width={width} height={height} />
    </svg>
  );
}
