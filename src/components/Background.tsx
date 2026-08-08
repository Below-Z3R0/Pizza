/**
 * Background decorativo: grid pattern + blobs animados.
 * Server Component — solo CSS, sin JS.
 */
export function Background() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid-mask opacity-70" />

      <div
        className="absolute -top-32 -left-32 w-150 h-150 rounded-full blur-3xl animate-blob-1"
        style={{ backgroundColor: "var(--bg-blob-1)" }}
      />
      <div
        className="absolute top-1/4 -right-40 w-137.5 h-137.5 rounded-full blur-3xl animate-blob-2"
        style={{ backgroundColor: "var(--bg-blob-2)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-175 h-125 rounded-full blur-3xl animate-blob-3"
        style={{ backgroundColor: "var(--bg-blob-3)" }}
      />
      <div
        className="absolute -bottom-32 -left-20 w-125 h-125 rounded-full blur-3xl animate-blob-4"
        style={{ backgroundColor: "var(--bg-blob-4)" }}
      />
    </div>
  );
}
