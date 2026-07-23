import localFont from "next/font/local";

/**
 * Plus Jakarta Sans (variabel, self-hosted), geen externe fontrequests.
 */
export const jakarta = localFont({
  src: [
    {
      path: "../assets/fonts/PlusJakartaSans-Variable.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "../assets/fonts/PlusJakartaSans-Italic-Variable.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  variable: "--font-jakarta",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});
