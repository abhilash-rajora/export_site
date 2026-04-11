import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://wexports.vercel.app"),
  title: {
    default: "WExports | Trusted Global Export Partner from India",
    template: "%s | WExports",
  },
  description:
    "Leading Indian export company delivering Agriculture, Textiles, Minerals and Electronics to 50+ countries worldwide.",
  keywords: ["export company india", "indian exporter", "agriculture export", "textile export", "wexports"],
  openGraph: {
    title: "WExports | Trusted Global Export Partner from India",
    description: "Leading Indian export company delivering Agriculture, Textiles, Minerals and Electronics to 50+ countries worldwide.",
    url: "https://wexports.vercel.app",
    siteName: "WExports",
    images: [{ url: "/favicon/apple-touch-icon.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WExports | Trusted Global Export Partner",
    description: "Leading Indian export company delivering Agriculture, Textiles, Minerals and Electronics worldwide.",
    images: ["/favicon/apple-touch-icon.png"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <Analytics consent={{ analytics: true }} />
      </body>
    </html>
  );
}
