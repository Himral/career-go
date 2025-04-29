import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function cleanCurrencySpan(htmlString) {
  // Input validation
  if (typeof htmlString !== "string") {
    return htmlString;
  }

  // Extract currency symbol and value using regex
  const match = htmlString.match(/^([^\s<]+)\s*<span[^>]*>([^<]+)<\/span>$/);

  if (!match) {
    return htmlString;
  }

  const [, currencySymbol, value] = match;
  return `${currencySymbol}${value}`;
}

export function formatImageUrl(imageUrl) {
  if (imageUrl.startsWith("//")) {
    return `https:${imageUrl}`;
  }

  return imageUrl;
}
