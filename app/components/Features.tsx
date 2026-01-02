"use client";

import {
  FaWallet,
  FaChartLine,
  FaExchangeAlt,
  FaFire,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface FeaturesProps {
  itemVariants: {
    hidden: { opacity: number; y: number };
    visible: {
      opacity: number;
      y: number;
      transition: { duration: number };
    };
  };
}

const features = [
  {
    icon: <FaChartLine className="w-8 h-8 text-[#00ff88]" />,
    title: "Chain Diversity",
    description:
      "Explore how many blockchains you've transacted on. Greater chain activity boosts your score.",
  },
  {
    icon: <FaWallet className="w-8 h-8 text-[#00ff88]" />,
    title: "Wallet Activity",
    description:
      "Analyze how active your wallet is across transactions, trades, and different blockchains.",
  },
  {
    icon: <FaExchangeAlt className="w-8 h-8 text-[#00ff88]" />,
    title: "DeFi Engagement",
    description:
      "Find out how much you've engaged in DeFi protocols. Staking, swapping, and participation boost your score.",
  },
  {
    icon: <FaFire className="w-8 h-8 text-[#00ff88]" />,
    title: "Transaction Heatmap",
    description:
      "Visualize your transaction patterns over time. See which months you were most active on-chain.",
  },
  {
    icon: <FaShieldAlt className="w-8 h-8 text-[#00ff88]" />,
    title: "Risk Analysis",
    description:
      "Track open token approvals and assess potential security risks. Stay safe with real-time monitoring.",
  },
  {
    icon: <FaClock className="w-8 h-8 text-[#00ff88]" />,
    title: "Wallet Age & History",
    description:
      "Discover your wallet's age and first transaction. Longer history and consistent activity improve your score.",
  },
];

export default function Features({ itemVariants }: FeaturesProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
      {features.map((feature, index) => (
        <div key={index} className="group relative h-full">
          {/* Card Glow Effect */}
          <div className="absolute -inset-0.5 bg-linear-to-b from-[#00ff88]/50 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

          {/* Card Content */}
          <div className="relative h-full bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-black/80 transition-all duration-300 flex flex-col items-center text-center">
            <div className="mb-6 p-4 bg-white/5 rounded-full ring-1 ring-[#00ff88]/30 group-hover:ring-[#00ff88] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,136,0.1)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.3)]">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#00ff88] transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

