"use client";

import { FiDownload, FiX } from "react-icons/fi";
import Background3D from "../components/Background3D";
import WalletSummary from "../components/WalletSummary";
import Score from "../components/Score";
import Heatmap from "../components/Heatmap";
import Footer from "../components/Footer";

export default function SummaryPage() {
  return (
    <main className="min-h-screen relative flex flex-col font-sans text-white overflow-hidden selection:bg-[#00ff88] selection:text-black">
      {/* 3D Background */}
      <Background3D />

      {/* Main Content */}
      <div className="grow flex flex-col items-center justify-start px-4 md:px-8 pt-20 pb-12 z-10 w-full max-w-6xl mx-auto">
        <Score />
        <Heatmap />
        <WalletSummary />

        {/* Icons Below WalletSummary */}
        <div className="flex items-center gap-4 mt-8 mb-12">
          <button
            className="relative flex items-center justify-center p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00ff88] hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group cursor-pointer overflow-hidden min-w-[48px]"
            aria-label="Download">
            <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-300">
              <FiDownload className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-[#00ff88] transition-all whitespace-nowrap w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 duration-300 overflow-hidden">
                Download PDF Report of AuraScore
              </span>
            </div>
          </button>
          <button
            className="relative flex items-center justify-center p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00ff88] hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group cursor-pointer overflow-hidden min-w-[48px]"
            aria-label="Share on X">
            <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-300">
              <FiX className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors flex-shrink-0" />
              <span className="text-sm font-medium text-gray-400 group-hover:text-[#00ff88] transition-all whitespace-nowrap w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 duration-300 overflow-hidden">
                Share my AuraScore
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
