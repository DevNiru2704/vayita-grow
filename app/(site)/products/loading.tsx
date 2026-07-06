import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <div className="mt-10 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <Skeleton className="h-52 rounded-none" />
            <div className="space-y-2 p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
