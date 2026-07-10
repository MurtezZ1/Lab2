export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.07] ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <SkeletonBlock className="aspect-square w-full" />
      <SkeletonBlock className="mt-5 h-3 w-20" />
      <SkeletonBlock className="mt-3 h-6 w-4/5" />
      <SkeletonBlock className="mt-3 h-4 w-32" />
      <div className="mt-8 flex items-center justify-between">
        <SkeletonBlock className="h-7 w-24" />
        <SkeletonBlock className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-12">
      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-5">
          <div className="flex gap-3">
            <SkeletonBlock className="h-10 w-28" />
            <SkeletonBlock className="h-10 w-24" />
          </div>
          <div className="glass-card rounded-3xl p-3 sm:p-4">
            <SkeletonBlock className="aspect-[4/5] sm:aspect-[16/11] xl:aspect-square" />
          </div>
          <SkeletonBlock className="h-24 w-full" />
        </div>
        <div className="space-y-5">
          <SkeletonBlock className="h-6 w-24" />
          <SkeletonBlock className="h-16 w-4/5" />
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-10 w-36" />
          <SkeletonBlock className="h-20 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20 sm:col-span-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPanelSkeleton() {
  return (
    <div className="glass-card mt-8 rounded-2xl p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
      </div>
      <SkeletonBlock className="mt-6 h-56 w-full" />
    </div>
  );
}
