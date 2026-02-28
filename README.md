# TensorWave Stock Dashboard

A stock dashboard that pulls live data from Alpha Vantage and shows it in a clean, dark UI. You get a home page of ticker cards, then drill into any symbol for company overview, a 30-day price chart, and a daily table.

**How it runs.** Install deps, add your API key, then start the dev server. The app fetches overview data right away; daily time series is delayed to respect Alpha Vantage’s rate limits, so the chart and table load after a short wait. All pages are server-rendered except the chart, which uses Recharts on the client.

```bash
npm install
```

Create `.env.local` with:

```
NEXT_PUBLIC_ALPHAVANTAGE_API_KEY=your_key_here
```

Get a free key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Build for production with `npm run build`, then `npm start`.

**Stack:** Next.js (App Router), React 19, Tailwind CSS, Recharts, Alpha Vantage API.
