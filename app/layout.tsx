import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AuraScore - Your Onchain Score",
  description:
    "Unlock your onchain reputation with AuraScore. Track your wallet's activity, DeFi engagement, transaction history, and cross-chain presence—all in one comprehensive score.",
  keywords: [
    "aura score",
    "onchain score",
    "wallet analytics",
    "web3",
    "blockchain",
    "ethereum",
    "defi",
    "portfolio tracker",
    "wallet analysis",
    "crypto analytics",
    "transaction history",
    "multichain",
  ],
  authors: [{ name: "Mohammad Ayaan Siddiqui" }],
  openGraph: {
    title: "AuraScore - Your Onchain Score",
    description:
      "Unlock your onchain reputation with AuraScore. Track your wallet's activity, DeFi engagement, transaction history, and cross-chain presence—all in one comprehensive score.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraScore - Your Onchain Score",
    description:
      "Unlock your onchain reputation with AuraScore. Track your wallet's activity, DeFi engagement, transaction history, and cross-chain presence—all in one comprehensive score.",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
