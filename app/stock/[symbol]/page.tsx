//stock page
import { Suspense } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { ArrowLeft } from "lucide-react";
import {
  OverviewSection,
  OverviewSkeleton,
  DailySection,
  DailySkeleton,
} from "./sections";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  return (
    <div className="min-h-screen bg-background">
      {/*same header as home so back feels natural */}
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
        {/* back link shows right away, no waiting on data */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/*overview fetches first one API call, no delay. company card + details grid */}
        <Suspense fallback={<OverviewSkeleton />}>
          <OverviewSection symbol={symbol} />
        </Suspense>

        {/*daily data waits ~12s so we don't hit alpha vantage's 5 req/min limit; then chart + table */}
        <Suspense fallback={<DailySkeleton />}>
          <DailySection symbol={symbol} />
        </Suspense>
      </main>
      {/*Security best practice when using target="_blank":
      prevents access to window.opener
      protects against tab-napping attacks*/}
      <footer className="mt-12 border-t border-border py-6 text-center text-xs text-muted-foreground">
        Market data provided by{" "}
        <a
          href="https://www.alphavantage.co"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Alpha Vantage
        </a>
      </footer>
    </div>
  );
}
