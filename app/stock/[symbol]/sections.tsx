//stock detail page is split into two sections. overview and daily. this file has both sections plus shared helpers and skeletons.
import { getOverview, getDailyData } from "@/lib/alphavantage";
import { TICKER_META } from "@/lib/constants";
import { CompanyLogo } from "@/components/company-logo";
import { PriceHistoryChart } from "./chart";

//shared helpers for both overview and daily sections

//used for the "Change" column: day-over-day percent change in closing price
//formula (current close - previous close) / previous close * 100. returns string with + or - and two decimals.
function percentChange(current: string, previous: string): string {
  const curr = parseFloat(current);
  const prev = parseFloat(previous);
  if (prev === 0) return "N/A";
  const pct = ((curr - prev) / prev) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;//template literal + ternary so we always show sign
}

// shown when overview or daily API returns null (no key, rate limit, or error)
const API_LIMIT_MESSAGE =
  "Unable to load data. You may have exceeded the API request limit. Try again later.";

//renders the change string like +2.50%  in green/red/neutral. used in the table and in the big price badge.
//Destructuring: {change} pulls the prop into a variable named change.
function ChangeCell({ change }: { change: string }) {
  const isPositive = change.startsWith("+");
  const isNegative = change.startsWith("-");
  return (
    <span
      className={
        isPositive
          ? "text-emerald-400 font-medium"
          : isNegative
          ? "text-rose-400 font-medium"
          : "text-muted-foreground"
      }
    >
      {change}
    </span>
  );
}

//skeletons shown while each section is loading. layout matches real content to avoid layout shift.
export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/*hero block: logo placeholder + title/description bars */}
      <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
        <div className="flex gap-5">
          <div className="h-16 w-16 rounded-xl bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>
      </div>
      {/*creates 6 placeholder items and use .map() to render the detail fields */}
      <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
        <div className="h-4 w-32 rounded bg-muted mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//matches the daily section layout: chart then table. h-[280px] is arbitrary value tailwind bracket notation.
export function DailySkeleton() {
  return (
    <div className="space-y-6">
      {/* chart area placeholder */}
      <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
        <div className="h-4 w-48 rounded bg-muted mb-4" />
        <div className="h-[280px] rounded bg-muted" />
      </div>
      {/* table header + row placeholders; 8 fake rows */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-4 w-48 rounded bg-muted" />
        </div>
        <div className="p-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground animate-pulse">
        Loading price history… (rate-limit delay: ~12s)
      </p>
    </div>
  );
}

//async server component runs on the server, no delay so it shows first. symbol comes from the URL segment.
export async function OverviewSection({ symbol }: { symbol: string }) {
  const { data: overview } = await getOverview(symbol);

  if (!overview) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">{API_LIMIT_MESSAGE}</p>
      </div>
    );
  }

  const meta = TICKER_META[symbol]; // our local map: name, domain, sector for this ticker
  //API returns different key shapes like "Asset Type" vs AssetType,
  //so we normalize and fall back to meta or "N/A"
  const name = overview ? String(overview.Name ?? "N/A") : (meta?.name ?? "N/A");
  const description = overview ? String(overview.Description ?? "N/A") : "N/A";
  const assetType = overview
    ? String(overview.AssetType ?? overview["Asset Type"] ?? "").trim() || "N/A" //bracket notation for key with a space
    : "N/A";
  const exchange = overview ? String(overview.Exchange ?? "N/A") : "N/A";
  const sector = overview ? String(overview.Sector ?? "N/A") : (meta?.sector ?? "N/A"); //optional chaining  meta?.sector avoids error if meta is undefined
  const industry = overview ? String(overview.Industry ?? "N/A") : "N/A";
  const rawCap = overview
    ? String(overview.MarketCapitalization ?? overview["Market Capitalization"] ?? "").trim()
    : "";
  //only format as currency if it looks like a number API sometimes sends "None" or similar. /^\d+$/.test = digits only
  const marketCap =
    rawCap && rawCap !== "0" && /^\d+$/.test(rawCap)
      ? `$${Number(rawCap).toLocaleString()}` // .toLocaleString() adds commas (e.g. 1000000 -> "1,000,000")
      : "N/A";

  //builds the key-value list for the details grid. we .map over this below to render each row
  const overviewFields = [
    { label: "Symbol", value: symbol },
    { label: "Asset Type", value: assetType },
    { label: "Exchange", value: exchange },
    { label: "Sector", value: sector },
    { label: "Industry", value: industry },
    { label: "Market Cap", value: marketCap },
  ];

  return (
    <div className="space-y-6">
      {/*company hero: logo + name + symbol + short description. flex-col on mobile, flex-row from sm breakpoint up */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {meta && (
            <CompanyLogo symbol={symbol} domain={meta.domain} name={name} size="lg" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{name}</h1>
              <span className="rounded-md bg-muted px-2 py-0.5 text-sm font-mono font-medium text-muted-foreground">
                {symbol}
              </span>
            </div>
            {description !== "N/A" && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2x3 grid of label + value pairs. .map(({ label, value }) => ...) destructures each array element */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Company Details
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {overviewFields.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground break-words">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//async server component. getDailyData waits 12seconds before calling API so we stay under rate limit
//before I made this change the overview would display but the price data wounldn't at times.
export async function DailySection({ symbol }: { symbol: string }) {
  const { data: daily } = await getDailyData(symbol);

  if (!daily) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">{API_LIMIT_MESSAGE}</p>
      </div>
    );
  }

  //API returns { "2024-01-15": { "4. close": "185.20", "5. volume": "..." }, ... }. Object.entries gives [date, day] pairs.
  //sort((a, b) => b[0].localeCompare(a[0])) = newest date first (b before a when b > a). then take first 30.
  const entries = Object.entries(daily).sort((a, b) => b[0].localeCompare(a[0]));
  const slice = entries.slice(0, 30);
  const rows = slice.map(([date, day], i) => {
    const close = day["4. close"] ?? "N/A"; // Alpha Vantage uses "4. close" and "5. volume" as keys
    const volume = day["5. volume"] ?? "N/A";
    // change is vs previous day. slice[i+1] is the next row (older date); [1] is the day object; ?. avoids crash if missing
    const prevClose = slice[i + 1]?.[1]?.["4. close"];
    const change = prevClose ? percentChange(close, prevClose) : "N/A"; // percentChange used here for table + badge
    return { date, close, volume, change };
  });

 //get the most recent row (index 0 = latest trading day)
//optional chaining ?. prevents a crash if rows[0] is undefined
//nullish coalescing ?? null ensures we explicitly store null instead of undefined
const latestPrice = rows[0]?.close ?? null;
const latestChange = rows[0]?.change ?? null;

return (
  <div className="space-y-6">
  {/* 
  render this block only if latestPrice is truthy.
  if it is null or undefined, nothing is rendered.
*/}
    {latestPrice && (
      <div className="flex items-baseline gap-2 px-1">
        
        {/* 
          Convert string price to number using parseFloat()
          .toFixed(2) forces exactly 2 decimal places (currency format)
        */}
        <span className="text-3xl font-bold text-foreground">
          ${parseFloat(latestPrice).toFixed(2)}
        </span>

        {/*only show daily change if:
          it exists
          it isn't the string "N/A"
        */}
        {latestChange && latestChange !== "N/A" && (
          <ChangeCell change={latestChange} />
        )}

        <span className="text-xs text-muted-foreground">
          latest close
        </span>
      </div>
    )}

    {/*Chart component receives the same rows array.
      It visualizes the same 30 days shown in the table below.
    */}
    <PriceHistoryChart data={rows} />

    {/*table wrapper
      overflow-x-auto allows horizontal scrolling on small screens
      so the table doesn't break mobile layout
    */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      
      {/*table header section */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Daily Prices — Last 30 Days
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/*column headers */}
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Close</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Volume</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Change</th>
            </tr>
          </thead>

          <tbody>
            {/*
              Loop through each row of price data.
              .map() transforms the rows array into <tr> elements.
            */}
            {rows.map((row, i) => (
              <tr
                key={row.date} // unique key required by React
                className={`
                  border-b border-border/50 
                  transition-colors hover:bg-muted/30
                  ${i === 0 ? "bg-muted/20" : ""}
                `}
                
                  //template literal for dynamic class names.
                 // If this is the first row (i === 0),
                  //apply a highlight background.
                 //otherwise apply nothing extra.
              >
                {/*Date column. monospace for alignment consistency */}
                <td className="px-4 py-3 text-foreground font-mono text-xs">
                  {row.date}
                </td>

                {/*close price column */}
                <td className="px-4 py-3 text-right text-foreground">
                  {/*if value isn't "N/A":
                    convert to number
                    format to 2 decimal places
                    otherwise display "N/A" */}
                  {row.close !== "N/A"
                    ? `$${parseFloat(row.close).toFixed(2)}`
                    : "N/A"}
                </td>

                {/*volume column */}
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {/*Convert volume string to number
                  use toLocaleString() to add commas. example: 1200000 -> 1,200,000
                  */}
                  {row.volume !== "N/A"
                    ? Number(row.volume).toLocaleString()
                    : "N/A"}
                </td>

                {/*change column delegated to reusable component */}
                <td className="px-4 py-3 text-right">
                  <ChangeCell change={row.change} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}
