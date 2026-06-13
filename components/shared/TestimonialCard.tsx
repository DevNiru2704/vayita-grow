import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border hover:shadow-md transition-shadow">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-brand-gold text-brand-gold"
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-sm text-brand-body leading-relaxed mb-5">
        &ldquo;{content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
          <span className="text-sm font-semibold text-brand-primary">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-dark">{name}</p>
          <p className="text-xs text-brand-body">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  );
}
