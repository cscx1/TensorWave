import NextImage from "next/image";

// next shows this while the stock route is loading (before the real page renders)
export default function LoadingStockPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 h-16 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 flex-shrink-0">
              <NextImage
                src="/logo.png"
                alt="TensorWave"
                width={48}
                height={48}
                className="h-full w-full object-contain"
                unoptimized
              />
            </div>
            <span className="text-lg font-semibold text-foreground">TensorWave</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-6">
        {/* placeholders match the layout of the real page so the transition isn't jumpy */}
        <div className="h-4 w-36 rounded bg-muted animate-pulse" />

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex gap-5">
            <div className="h-16 w-16 rounded-xl bg-muted animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 rounded bg-muted animate-pulse" />
              <div className="h-8 w-32 rounded bg-muted animate-pulse" />
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-4 w-32 rounded bg-muted animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="h-4 w-40 rounded bg-muted animate-pulse mb-4" />
          <div className="h-[280px] rounded bg-muted animate-pulse" />
        </div>

        <div className="flex items-center justify-center gap-3 py-4 text-muted-foreground text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
          Loading stock data…
        </div>
      </main>
    </div>
  );
}
