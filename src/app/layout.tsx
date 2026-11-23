import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Allura } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import Analytics from "@/components/Analytics";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-cormorant" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
const allura = Allura({ subsets: ["latin"], weight: "400", variable: "--font-allura" });

export const metadata: Metadata = {
  title: "Avora Group | Travel. Stay. Explore. More.",
  description: "Flights, accommodation, tours and travel packages. Local getaways, international dreams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${allura.variable}`}>
      <body><SmoothScroll>{children}</SmoothScroll><WhatsAppButton /><Analytics /></body>
    </html>
  );
}

