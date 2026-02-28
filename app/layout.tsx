import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// load geist sans and mono from google fonts; we expose them as CSS variables (e.g. --font-geist-sans) so globals.css and tailwind can use them
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// used for the browser tab title and search results; next injects this into <head>
export const metadata: Metadata = {
  title: "TensorWave Stock Dashboard",
  description: "Real-time stock market data powered by Alpha Vantage",
};

//Root layout wraps every page in the app. next always renders this first, then swaps in the current page as children
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    //lang for accessibility; dark forces tailwind dark mode so the whole app looks consistent
    <html lang="en" className="dark">
      {/*font variables go on body so all pages inherit them. antialiased smooths the type */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
