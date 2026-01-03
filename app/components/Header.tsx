"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { SiPeerlist } from "react-icons/si";
import { motion } from "framer-motion";

interface HeaderProps {
  itemVariants: {
    hidden: { opacity: number; y: number };
    visible: {
      opacity: number;
      y: number;
      transition: { duration: number };
    };
  };
}

export default function Header({ itemVariants }: HeaderProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="text-center max-w-3xl flex flex-col items-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
        {/* Icon */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-[#00ff88] to-[#00cc66] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative rounded-full border-2 border-[#00ff88]/50 overflow-hidden w-24 h-24 md:w-32 md:h-32 bg-black/50 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,136,0.3)]">
            <Image
              src="/icon.png"
              alt="AuraScore Icon"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-[#00ff88] to-[#00cc66] animate-gradient-text drop-shadow-[0_0_25px_rgba(0,255,136,0.5)]">
          AuraScore
        </h1>
      </div>

      <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-6">
        Unlock your onchain reputation with AuraScore. Track your wallet&apos;s
        activity, DeFi engagement, transaction history, and cross-chain
        presence—all in one comprehensive score.
      </p>

      {/* Social Icons */}
      <div className="flex items-center gap-4 mt-4">
        <a
          href="https://github.com/moayaan1911/aurascore"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00ff88] hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group overflow-hidden min-w-[48px]">
          <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-300">
            <FaGithub className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors flex-shrink-0" />
            <span className="text-sm font-medium text-gray-400 group-hover:text-[#00ff88] transition-all whitespace-nowrap w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 duration-300 overflow-hidden">
              Leave a Star
            </span>
          </div>
        </a>
        <a
          href="https://peerlist.io/ayaaneth/project/aurascore"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00ff88] hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group overflow-hidden min-w-[48px]">
          <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-300">
            <SiPeerlist className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] transition-colors flex-shrink-0" />
            <span className="text-sm font-medium text-gray-400 group-hover:text-[#00ff88] transition-all whitespace-nowrap w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 duration-300 overflow-hidden">
              Upvote on Peerlist
            </span>
          </div>
        </a>
      </div>
    </motion.div>
  );
}
