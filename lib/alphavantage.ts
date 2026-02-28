export type OverviewData = Record<string, unknown>;
export type DailySeriesData = Record<string, Record<string, string>>;

export type OverviewResult = {
  data: OverviewData | null;
};

export type DailyResult = {
  data: DailySeriesData | null;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

//alpha vantage returns a note/message instead of data when you're rate limited or hit an error
function isRateLimitedOrError(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return true;
  const obj = payload as Record<string, unknown>;
  return Boolean(obj.Note || obj.Information || obj["Error Message"]);
}

//no delay — we call this first so the overview section can show quickly
export async function getOverview(symbol: string): Promise<OverviewResult> {
  const key = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY ?? "";

  if (!key) {
    console.log("[getOverview] No API key — returning null", { symbol });
    return { data: null };
  }

  try {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${key}`;
    const res = await fetch(url, { cache: "no-store" }); // don't cache so we get fresh data
    const raw: unknown = await res.json();

    if (!res.ok || isRateLimitedOrError(raw)) {
      console.log("[getOverview] Rate-limited or error — returning null", { symbol, raw });
      return { data: null };
    }

    console.log("[getOverview] Success from API", { symbol });
    return { data: raw as OverviewData };
  } catch (err) {
    console.log("[getOverview] Fetch failed — returning null", { symbol, err });
    return { data: null };
  }
}

// alpha vantage free tier is 5 requests per minute — overview runs at 0s so we wait before daily
const RATE_LIMIT_DELAY_MS = 12_000;

export async function getDailyData(symbol: string): Promise<DailyResult> {
  const key = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY ?? "";

  if (!key) {
    console.log("[getDailyData] No API key — returning null", { symbol });
    return { data: null };
  }

  await sleep(RATE_LIMIT_DELAY_MS);

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${key}`;
    const res = await fetch(url, { cache: "no-store" });
    const raw: unknown = await res.json();

    if (!res.ok || isRateLimitedOrError(raw)) {
      console.log("[getDailyData] Rate-limited or error — returning null", { symbol, raw });
      return { data: null };
    }

    //response shape is { "Time Series (Daily)": { "2024-01-15": { "4. close": "..." }, ... } }
    const payload = (raw as Record<string, unknown>)["Time Series (Daily)"];
    if (!payload || typeof payload !== "object") {
      console.log("[getDailyData] Missing daily series — returning null", { symbol });
      return { data: null };
    }

    const series = payload as DailySeriesData;
    console.log("[getDailyData] Success from API", { symbol, days: Object.keys(series).length });
    return { data: series };
  } catch (err) {
    console.log("[getDailyData] Fetch failed — returning null", { symbol, err });
    return { data: null };
  }
}

//convenience helper if you ever need both in one place (overview + daily with the 12s gap)
export type StockDataResult = {
  success: boolean;
  overview: OverviewData | null;
  daily: DailySeriesData | null;
};

export async function getStockData(symbol: string): Promise<StockDataResult> {
  const [overviewResult, dailyResult] = await Promise.all([
    getOverview(symbol),
    getDailyData(symbol),
  ]);

  const overview = overviewResult.data;
  const daily = dailyResult.data;

  return {
    success: Boolean(overview || daily),
    overview,
    daily,
  };
}
