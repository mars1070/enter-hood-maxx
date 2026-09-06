/** Liens live du token HOODMAXXING (chain Robinhood). */
export const CONTRACT = "0x7B18942d5717EB0EFe3EC82e617F7CA6890E7777";

export const BUY_URL = `https://app.uniswap.org/swap?chain=robinhood&inputCurrency=NATIVE&outputCurrency=${CONTRACT}`;
export const CHART_URL = `https://gmgn.ai/robinhood/token/${CONTRACT.toLowerCase()}`;

export const X_URL = "https://x.com/Hoodmaxxing";
export const TELEGRAM_URL = "https://t.me/hoodmaxxingrh";

export const SOCIALS = [
  { label: "X", href: X_URL },
  { label: "TELEGRAM", href: TELEGRAM_URL },
  { label: "DEX", href: CHART_URL },
];
