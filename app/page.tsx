//home page
import Link from "next/link";
import NextImage from "next/image";
import { TICKERS, TICKER_META } from "@/lib/constants";
import { CompanyLogo } from "@/components/company-logo";

//map sector names to tailwind classes so each card gets a colored badge
const SECTOR_COLORS: Record<string, string> = {
  Technology: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Consumer Cyclical": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Financial Services": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Healthcare: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  "Consumer Defensive": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Communication Services": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
};

function SectorBadge({ sector }: { sector: string }) {
  //if we don't have a color for this sector, use a neutral style
  const cls = SECTOR_COLORS[sector] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {sector}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/*same header on every page so nav feels consistent */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
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
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Stock Dashboard</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Market Overview</h1>
          <p className="mt-2 text-muted-foreground">
            {TICKERS.length} stocks tracked &mdash; click any card to view full details and price history.
          </p>
        </div>

        {/*one card per ticker; each card links to the stock detail page */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TICKERS.map((symbol) => {
            //get name, domain, sector etc. for this ticker from shared meta
            const meta = TICKER_META[symbol];
            return (
              <Link
                key={symbol}
                href={`/stock/${symbol}`}
                className="group block rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
              >
                {/*Top row: logo, ticker and company name, and arrow icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CompanyLogo
                      symbol={symbol}
                      domain={meta.domain}
                      name={meta.name}
                      size="sm"
                    />
                    <div>
                      <p className="font-bold text-foreground text-base leading-none">{symbol}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{meta.name}</p>
                    </div>
                  </div>
                  {/*chevron icon to show the card is clickable */}
                  <svg
                    className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {/* sector label below the header */}
                <div className="mt-4">
                  <SectorBadge sector={meta.sector} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/*page footer. we use alpha vantage’s api for stock prices, so we credit them here. the link opens in a new tab target="_blank" with rel="noopener noreferrer" for security */}
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
