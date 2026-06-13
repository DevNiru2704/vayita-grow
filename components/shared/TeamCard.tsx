import Image from "next/image";

interface TeamCardProps {
  name: string;
  role: string;
  description: string;
}

export default function TeamCard({ name, role, description }: TeamCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative h-52 bg-brand-light flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-center">
        <h3 className="font-heading text-base font-semibold text-brand-dark mb-0.5">
          {name}
        </h3>
        <p className="text-sm font-medium text-brand-primary mb-3">{role}</p>
        <p className="text-sm text-brand-body leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
