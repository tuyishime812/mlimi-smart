import { Skeleton } from "@/components/ui/skeleton";

export function WeatherSkeleton() {
  return (
    <div className="space-y-2 p-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function DiseaseSkeleton() {
  return (
    <div className="space-y-3 p-3">
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}