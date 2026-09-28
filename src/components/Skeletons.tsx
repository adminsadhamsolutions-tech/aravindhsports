export function SectionSkeleton() {
  return (
    <div className="py-24 md:py-32 bg-primary-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block h-8 w-32 rounded-full bg-white/5 shimmer mb-4" />
          <div className="h-12 w-64 mx-auto rounded-xl bg-white/5 shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-40 rounded-2xl bg-white/5 shimmer" />
      ))}
    </div>
  );
}
