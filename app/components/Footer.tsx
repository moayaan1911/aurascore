"use client";

import Link from "next/link";
import { FaCopyright, FaEthereum } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full py-6 text-center text-gray-500 text-sm border-t border-white/5 bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <FaCopyright />
          <span>
            {new Date().getFullYear()} Mohammad Ayaan Siddiqui. All rights
            reserved.
          </span>
        </div>
        <Link
          href="https://moayaan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-400 hover:text-[#00ff88] transition-colors duration-300">
          <FaEthereum className="w-4 h-4" />
          <span>Built by moayaan.eth</span>
          <FaEthereum className="w-4 h-4" />
        </Link>
      </div>
    </footer>
  );
}

