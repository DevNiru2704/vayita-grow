interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  center = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <h2
        className={`font-heading text-3xl sm:text-4xl font-bold mb-4 ${
          light ? "text-white" : "text-brand-dark"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl text-base leading-relaxed ${
            center ? "mx-auto" : ""
          } ${light ? "text-gray-300" : "text-brand-body"}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded-full ${
          center ? "mx-auto" : ""
        } bg-brand-gold`}
      />
    </div>
  );
}
