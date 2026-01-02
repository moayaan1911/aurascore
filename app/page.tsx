"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Background3D from "./components/Background3D";
import Header from "./components/Header";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleFetchScore = () => {
    router.push("/summary");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen relative flex flex-col font-sans text-white overflow-hidden selection:bg-[#00ff88] selection:text-black">
      {/* 3D Background */}
      <Background3D />

      {/* Main Content */}
      <div className="grow flex flex-col items-center justify-center px-4 md:px-8 pt-20 pb-12 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl w-full flex flex-col items-center gap-12">
          {/* Header Section */}
          <Header itemVariants={itemVariants} />

          {/* Input Section */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-3xl relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-[#00ff88] to-[#00cc66] rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 p-2 flex flex-col md:flex-row gap-2">
              <div className="relative grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address / ENS domain / Unstoppable domain"
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-lg font-mono"
                />
              </div>
              <button
                onClick={handleFetchScore}
                className="bg-[#00ff88] hover:bg-[#00cc66] text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transform hover:scale-105 active:scale-95 cursor-pointer">
                Fetch Score <FaArrowRight />
              </button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <Features itemVariants={itemVariants} />
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
