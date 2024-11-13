import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Playground | Scientific Visualizations",
  description: "A collection of interactive scientific visualizations exploring quantum mechanics and computational physics",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="/config.js" strategy="beforeInteractive" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
