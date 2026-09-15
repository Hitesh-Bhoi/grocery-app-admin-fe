import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "Adminpanel — Grocery & eCommerce Dashboard",
  description:
    "Modern production-quality admin dashboard for grocery management, eCommerce, and SaaS analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body
        className="h-full"
        style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
