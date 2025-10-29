import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3 pt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
};
