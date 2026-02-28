"use client";

import Image from "next/image";
import { useState } from "react";
import { getLogoUrl, getGoogleFaviconUrl } from "@/lib/constants";

type CompanyLogoProps = {
  symbol: string;
  domain: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-10 w-10 rounded-lg",
  md: "h-12 w-12 rounded-lg",
  lg: "h-16 w-16 rounded-xl",
};

//request a bigger favicon so it stays sharp on retina
const faviconSizes: Record<"sm" | "md" | "lg", number> = {
  sm: 64,
  md: 96,
  lg: 128,
};

//when both clearbit and favicon fail we show ticker initials
// if both logo providers fail, we show ticker initials instead
function InitialsFallback({ symbol, size }: { symbol: string; size: "sm" | "md" | "lg" }) {
  
  //use first 2 letters if possible, otherwise 1
  const initials = symbol.length >= 2 
    ? symbol.slice(0, 2) 
    : symbol.slice(0, 1);

  //adjust text size based on logo size
  const textSize =
    size === "sm"
      ? "text-sm"
      : size === "md"
      ? "text-base"
      : "text-lg";

  return (
    <div
      className={`flex items-center justify-center bg-primary/20 text-primary font-bold ${sizeClasses[size]} ${textSize}`}
      aria-hidden
      // aria-hidden because this is decorative fallback content
    >
      {initials}
    </div>
  );
}


export function CompanyLogo({
  symbol,
  domain,
  name,
  size = "sm",
  className = "",
}: CompanyLogoProps) {

  //first we try clearbit
  // if it fails, we switch to google favicon
  const [source, setSource] = useState<"clearbit" | "favicon">("clearbit");

  //if both fail, this becomes true and we render initials instead
  const [failed, setFailed] = useState(false);


  //if everything failed, render the initials fallback
  if (failed) {
    return (
      <div className={`relative flex-shrink-0 overflow-hidden ${sizeClasses[size]} ${className}`}>
        <InitialsFallback symbol={symbol} size={size} />
      </div>
    );
  }

  //check if we are currently using clearbit
  const isClearbit = source === "clearbit";

  //decide which image url to use
  //clearbit first, otherwise google favicon
  const src = isClearbit
    ? getLogoUrl(domain)
    : getGoogleFaviconUrl(domain, faviconSizes[size]);

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden bg-muted ${sizeClasses[size]} ${className}`}
    >
      <Image
        src={src}
        //alt text improves accessibility
        //uses company name if provided, otherwise falls back to ticker
        alt={name ? `${name} logo` : `${symbol} logo`}

        fill
        //fill makes the image stretch to fill the parent container
        //the parent must be position: relative for this to work

        className={
          isClearbit
            ? "object-contain p-1"
            : "object-contain p-1.5"
        }
        // object-contain keeps aspect ratio
        // slightly different padding depending on image source

        unoptimized
        // disables next.js automatic image optimization

        sizes={`${size === "sm" ? 40 : size === "md" ? 48 : 64}px`}
        // tells the browser the rendered size for performance optimization

        onError={() => {
          // if clearbit fails, try favicon instead
          if (source === "clearbit") {
            setSource("favicon");
          } else {
            // if favicon also fails, show initials fallback
            setFailed(true);
          }
        }}
      />
    </div>
  );
}