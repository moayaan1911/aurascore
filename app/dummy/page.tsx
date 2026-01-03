"use client";

import { useState } from "react";
import { FiDownload, FiX, FiImage } from "react-icons/fi";
import Background3D from "../components/Background3D";
import WalletSummary from "../components/WalletSummary";
import Score from "../components/Score";
import Heatmap from "../components/Heatmap";
import Footer from "../components/Footer";
import { generateAuraScorePDF } from "../utils/generatePDF";
import {
  downloadShareImage,
  shareOnTwitter,
} from "../utils/generateShareImage";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

type HeatmapItem = { date: string; count: number };

interface WalletSummaryData {
  ensDomain: string | null;
  unstoppableDomain: string | null;
  chainsTransacted: number;
  specificChains: string[];
  totalTransactions: number;
  highestChainTransactions: { chain: string; count: number };
  firstTransaction: { date: string; chain: string };
  walletAge: string;
  usdAtRisk: number;
  defiProtocols: { count: number; names: string[] };
  highestDefiPosition?: {
    type: string;
    protocol: string;
    token: string;
    amount: number;
  };
  totalNetWorth: {
    total: number;
    highestChain: { chain: string; amount: number };
  };
  totalGasFees: {
    total: number;
    highestChain: { chain: string; amount: number };
  };
  totalTrades: number;
  totalProfit: number;
}

// Generate dummy heatmap data for last 365 days
const generateDummyHeatmap = (): HeatmapItem[] => {
  const today = new Date();
  const data: HeatmapItem[] = [];
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    // Random transaction count between 0-15
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 15) : 0;
    data.push({ date: key, count });
  }
  return data.reverse();
};

export default function DummyPage() {
  const walletAddress = "0x1234567890123456789012345678901234567890";
  const displayName = "moayaan.eth";
  const avatarUrl = "/icon.png";
  const score = 87.5;

  const [heatmapData] = useState<HeatmapItem[]>(generateDummyHeatmap());
  const [summaryData] = useState<WalletSummaryData>({
    ensDomain: "moayaan.eth",
    unstoppableDomain: null,
    chainsTransacted: 7,
    specificChains: ["eth", "polygon", "base", "arbitrum", "optimism", "bsc", "avalanche"],
    totalTransactions: 1247,
    highestChainTransactions: { chain: "eth", count: 523 },
    firstTransaction: { date: "Mon Jan 15 2021", chain: "eth" },
    walletAge: "3.95 years",
    usdAtRisk: 1250.75,
    defiProtocols: {
      count: 8,
      names: ["Uniswap", "Aave", "Compound", "Curve", "Lido", "MakerDAO", "Balancer", "Yearn"],
    },
    highestDefiPosition: {
      type: "Liquidity Pool",
      protocol: "Uniswap",
      token: "USDC-ETH",
      amount: 15420.50,
    },
    totalNetWorth: {
      total: 42350.25,
      highestChain: { chain: "ETH", amount: 28500.00 },
    },
    totalGasFees: {
      total: 3250.80,
      highestChain: { chain: "ETH", amount: 2100.50 },
    },
    totalTrades: 156,
    totalProfit: 8750.25,
  });

  const handleDownloadPDF = async () => {
    try {
      toast.loading("Generating your AuraScore PDF...", { id: "pdf-generation" });
      await generateAuraScorePDF(
        walletAddress,
        displayName,
        score,
        summaryData,
        heatmapData
      );
      toast.success("PDF downloaded successfully! 🎉", { id: "pdf-generation", duration: 4000 });
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff88', '#00cc6a', '#00aa55', '#ffffff'],
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: "pdf-generation" });
    }
  };

  const handleShareOnTwitter = () => {
    try {
      shareOnTwitter(score);
      toast.success("Share your AuraScore on X! 🐦", { duration: 3000 });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00ff88", "#ffffff", "#00cc66"],
      });
    } catch (error) {
      console.error("Error opening Twitter:", error);
      toast.error("Failed to open Twitter. Please try again.");
    }
  };

  const handleDownloadImage = async () => {
    try {
      toast.loading("Generating your share image...", { id: "image-gen" });
      await downloadShareImage(walletAddress, displayName, score, avatarUrl);
      toast.success("Image downloaded successfully! 🎨", { id: "image-gen", duration: 4000 });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00ff88", "#ffffff", "#00cc66"],
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.", { id: "image-gen" });
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col font-sans text-white overflow-hidden selection:bg-[#00ff88] selection:text-black">
      {/* 3D Background */}
      <Background3D />

      {/* Main Content */}
      <div className="grow flex flex-col items-center justify-start px-4 md:px-8 pt-20 pb-12 z-10 w-full max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-sm text-yellow-400 font-semibold bg-yellow-400/10 px-4 py-2 rounded-full inline-block">
            ⚠️ DUMMY DATA - For Testing Only
          </p>
        </div>

        <Score
          score={score}
          ensName={displayName}
          avatarUrl={avatarUrl}
        />
        <Heatmap data={heatmapData} />
        <WalletSummary data={summaryData} />

        {/* Icons Below WalletSummary */}
        <div className="flex items-center gap-4 mt-8 mb-12">
          <button
            onClick={handleDownloadPDF}
            className="relative flex items-center justify-center p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00ff88] hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group cursor-pointer overflow-hidden min-w-[48px]"
            aria-label="Download PDF">
            <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-300">
              <FiDownload className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors shrink-0" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-[#00ff88] transition-all whitespace-nowrap w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 duration-300 overflow-hidden">
                Download PDF Report
              </span>
            </div>
          </button>
          <button
            onClick={handleDownloadImage}
            className="relative flex items-center justify-center p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00ff88] hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group cursor-pointer overflow-hidden min-w-[48px]"
            aria-label="Download Image">
            <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-300">
              <FiImage className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors shrink-0" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-[#00ff88] transition-all whitespace-nowrap w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 duration-300 overflow-hidden">
                Download Share Image
              </span>
            </div>
          </button>
          <button
            onClick={handleShareOnTwitter}
            className="relative flex items-center justify-center p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00ff88] hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group cursor-pointer overflow-hidden min-w-[48px]"
            aria-label="Share on X">
            <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-300">
              <FiX className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors shrink-0" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-[#00ff88] transition-all whitespace-nowrap w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 duration-300 overflow-hidden">
                Share on X
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

