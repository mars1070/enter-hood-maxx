/** Liens live du token HOODMAXXING (chain Robinhood). */
export const CONTRACT = "0x7B18942d5717EB0EFe3EC82e617F7CA6890E7777";

export const BUY_URL = `https://app.uniswap.org/swap?chain=robinhood&inputCurrency=NATIVE&outputCurrency=${CONTRACT}`;
export const CHART_URL = `https://gmgn.ai/robinhood/token/${CONTRACT.toLowerCase()}`;

export const SOCIALS = [
  { label: "X", href: "https://x.com" },
  { label: "TELEGRAM", href: "https://t.me" },
  { label: "DEX", href: CHART_URL },
];
