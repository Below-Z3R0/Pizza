// ================================================================
// loading.tsx — Skeleton del dashboard (Next.js standard)
// ================================================================
export default function Loading() {
  return (
    <main className="min-h-screen bg-page animate-pulse">
      {/* Header skeleton */}
      <section className="py-6 md:py-10 px-6 md:px-12 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
          <div className="h-9 w-80 bg-gray-200 rounded mb-2" />
          <div className="h-5 w-64 bg-gray-200 rounded" />
        </div>
      </section>

      {/* KPIs skeleton */}
      <section className="px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border-subtle bg-card p-4">
                <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-7 w-12 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-10 w-96 bg-gray-200 rounded" />
          <div className="h-64 w-full bg-gray-200 rounded-xl" />
        </div>
      </section>
    </main>
  );
}
