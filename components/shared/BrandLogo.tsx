import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The VayitaGrow logo mark (public/vayitagrow_logo.svg, 612×408).
 * `inverted` renders it white for dark surfaces. Decorative by default -
 * pass `alt` only when the logo stands alone without the wordmark text.
 */
export function BrandLogo({
  height = 36,
  inverted = false,
  alt = "",
  className,
}: {
  height?: number;
  inverted?: boolean;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src="/vayitagrow_logo.svg"
      alt={alt}
      width={Math.round(height * 1.5)}
      height={height}
      unoptimized
      className={cn(inverted && "brightness-0 invert", className)}
    />
  );
}
