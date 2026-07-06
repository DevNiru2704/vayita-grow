import { cn } from "@/lib/utils";

/**
 * Public-site section heading: eyebrow, display title, gold underline mark,
 * and optional lede.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-4",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl tracking-tight text-balance sm:text-4xl">{title}</h2>
      <div
        aria-hidden
        className={cn("h-1 w-14 rounded-full bg-gold-500", align === "center" && "mx-auto")}
      />
      {lede ? (
        <p className="text-base text-pretty text-muted-foreground sm:text-lg">{lede}</p>
      ) : null}
    </div>
  );
}
