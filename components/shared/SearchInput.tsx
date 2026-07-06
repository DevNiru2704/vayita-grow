"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * Debounced search box that writes `?query=` to the URL (resetting `page`),
 * letting the server component re-filter through its service.
 */
export function SearchInput({ placeholder = "Search…" }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("query") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (next.trim()) {
        params.set("query", next.trim());
      } else {
        params.delete("query");
      }
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, 300);
  }

  return (
    <div className="relative w-full max-w-xs">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        role="searchbox"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className="pl-8"
      />
    </div>
  );
}
