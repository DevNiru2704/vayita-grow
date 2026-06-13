interface TeamCardProps {
  name: string;
  role: string;
  description: string;
}

export default function TeamCard({ name, role, description }: TeamCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden group hover:shadow-md transition-shadow">
      {/* Photo placeholder */}
      <div className="h-52 bg-gradient-to-br from-brand-light to-brand-section flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center border-2 border-brand-primary/20">
          <span className="font-heading text-2xl font-bold text-brand-primary">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
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
