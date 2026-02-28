// client component — recharts needs the DOM so this has to run in the browser
"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// same shape as the table rows from sections (date + close string from API)
export type PriceChartData = { date: string; close: string }[];

type PriceHistoryChartProps = {
  data: PriceChartData;
};

// recharts wants numbers and oldest-first for a proper time axis
function toChartData(data: PriceChartData): { date: string; close: number }[] {
  const withNumbers = data.map(({ date, close }) => ({
    date,
    close: parseFloat(close) || 0,
  }));
  return [...withNumbers].reverse();
}

// fixed color so the line is always visible in dark theme (matches --chart-1)
const CHART_LINE_STROKE = "oklch(0.488 0.243 264.376)";
const chartConfig = {
  close: {
    label: "Close",
    color: CHART_LINE_STROKE,
  },
} satisfies ChartConfig;

export function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const chartData = useMemo(() => toChartData(data), [data]);

  if (chartData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price history (last 30 days)</CardTitle>
        <CardDescription>
          Closing price by day. Hover over the line to see values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const d = new Date(value + "T12:00:00");
                const month = d.getMonth() + 1;
                const day = d.getDate();
                return `${month}/${day}`;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]}
                />
              }
            />
            <Line
              dataKey="close"
              type="linear"
              stroke={CHART_LINE_STROKE}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
