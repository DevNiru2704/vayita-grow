import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { company } from "@/lib/config/company";
import { publicNav } from "@/lib/config/navigation";

/** Site footer - all facts and links come from lib/config (single source). */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo height={40} inverted />
              <p className="font-display text-lg font-semibold text-white">
                {company.shortName} Bioorganics
              </p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-brand-200">
              {company.supportingMessage}
            </p>
          </div>

          <nav aria-label="Footer" className="space-y-4">
            <p className="text-sm font-semibold tracking-wide text-white uppercase">Company</p>
            <ul className="space-y-2.5">
              {publicNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-sm text-sm text-brand-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-wide text-white uppercase">
              Where We Operate
            </p>
            <ul className="space-y-2.5 text-sm text-brand-200">
              {company.operatingStates.map((state) => (
                <li key={state} className="flex items-center gap-2">
                  <MapPin aria-hidden className="size-4 shrink-0 text-brand-400" />
                  {state}
                </li>
              ))}
            </ul>
            <p className="text-xs text-brand-300">Registered office: {company.registeredState}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-wide text-white uppercase">Contact</p>
            <ul className="space-y-2.5 text-sm text-brand-200">
              <li className="flex items-start gap-2">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <span>{company.contact.addressLines.join(", ")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone aria-hidden className="size-4 shrink-0 text-brand-400" />
                <a
                  href={`tel:${company.contact.landline.replaceAll(" ", "")}`}
                  className="rounded-sm hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                >
                  {company.contact.landline}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail aria-hidden className="size-4 shrink-0 text-brand-400" />
                <a
                  href={`mailto:${company.contact.email}`}
                  className="rounded-sm hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                >
                  {company.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-brand-300">
            © {year} {company.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
