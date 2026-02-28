//list of symbols we show on the home page and can fetch details for
export const TICKERS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "NVDA",
  "TSLA",
  "JPM",
  "JNJ",
  "V",
  "WMT",
  "PG",
  "UNH",
  "HD",
  "DIS",
] as const;

export type Ticker = (typeof TICKERS)[number];

export type TickerMeta = {
  name: string;
  domain: string;
  sector: string;
};

//domain is used for logo/favicon lookup; sector for the colored badge on the card
export const TICKER_META: Record<string, TickerMeta> = {
  AAPL: { name: "Apple Inc.", domain: "apple.com", sector: "Technology" },
  MSFT: { name: "Microsoft Corp.", domain: "microsoft.com", sector: "Technology" },
  GOOGL: { name: "Alphabet Inc.", domain: "abc.xyz", sector: "Technology" },
  AMZN: { name: "Amazon.com Inc.", domain: "amazon.com", sector: "Consumer Cyclical" },
  META: { name: "Meta Platforms", domain: "meta.com", sector: "Technology" },
  NVDA: { name: "NVIDIA Corp.", domain: "nvidia.com", sector: "Technology" },
  TSLA: { name: "Tesla Inc.", domain: "tesla.com", sector: "Consumer Cyclical" },
  JPM: { name: "JPMorgan Chase", domain: "jpmorganchase.com", sector: "Financial Services" },
  JNJ: { name: "Johnson & Johnson", domain: "jnj.com", sector: "Healthcare" },
  V: { name: "Visa Inc.", domain: "visa.com", sector: "Financial Services" },
  WMT: { name: "Walmart Inc.", domain: "walmart.com", sector: "Consumer Defensive" },
  PG: { name: "Procter & Gamble", domain: "pg.com", sector: "Consumer Defensive" },
  UNH: { name: "UnitedHealth Group", domain: "unitedhealthgroup.com", sector: "Healthcare" },
  HD: { name: "Home Depot Inc.", domain: "homedepot.com", sector: "Consumer Cyclical" },
  DIS: { name: "Walt Disney Co.", domain: "thewaltdisneycompany.com", sector: "Communication Services" },
};

//clearbit has nice logos but can rate limit; we try this first then fall back to favicon
export function getLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

//duckduckgo favicon — low res, we use google's when clearbit fails
export function getFaviconUrl(domain: string): string {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

//google lets you ask for a size (16–256) so we don't upscale a tiny favicon
export function getGoogleFaviconUrl(domain: string, size: number = 64): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}
