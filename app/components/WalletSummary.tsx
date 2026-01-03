"use client";

import React from "react";
import {
  FaRocket,
  FaCircle,
  FaLightbulb,
  FaGlobe,
  FaSnowflake,
  FaCalendar,
  FaHourglassHalf,
  FaShieldAlt,
  FaLayerGroup,
  FaSmile,
  FaMoneyBillWave,
  FaGasPump,
  FaChartLine,
} from "react-icons/fa";

interface WalletSummaryProps {
  data?: {
    ensDomain?: string | null;
    unstoppableDomain?: string | null;
    chainsTransacted?: number;
    specificChains?: string[];
    totalTransactions?: number;
    highestChainTransactions?: { chain: string; count: number };
    firstTransaction?: { date: string; chain: string };
    walletAge?: string;
    usdAtRisk?: number;
    defiProtocols?: { count: number; names: string[] };
    highestDefiPosition?: {
      type: string;
      protocol: string;
      token: string;
      amount: number;
    };
    totalNetWorth?: {
      total: number;
      highestChain: { chain: string; amount: number };
    };
    totalGasFees?: {
      total: number;
      highestChain: { chain: string; amount: number };
    };
    totalTrades?: number;
    totalProfit?: number;
  };
}

const dummyData = {
  ensDomain: "bharatharaj.eth",
  unstoppableDomain: "bharathbabu3017.wallet",
  chainsTransacted: 6,
  specificChains: ["eth", "polygon", "base", "bsc", "avalanche", "optimism"],
  totalTransactions: 323,
  highestChainTransactions: { chain: "polygon", count: 161 },
  firstTransaction: { date: "Mon Apr 04 2022", chain: "eth" },
  walletAge: "2.52 years",
  usdAtRisk: 3202.51,
  defiProtocols: { count: 2, names: ["EtherFi", "EigenLayer"] },
  highestDefiPosition: {
    type: "liquidity position",
    protocol: "EigenLayer",
    token: "Ankr Staked ETH",
    amount: 79.33,
  },
  totalNetWorth: {
    total: 3083.88,
    highestChain: { chain: "ETH", amount: 1982.95 },
  },
  totalGasFees: {
    total: 303.03,
    highestChain: { chain: "ETH", amount: 285.65 },
  },
  totalTrades: 45,
  totalProfit: 1234.56,
};

export default function WalletSummary({
  data = dummyData,
}: WalletSummaryProps) {
  const summaryItems: Array<{ icon: React.ReactElement; text: string }> = [
    ...(data.ensDomain
      ? [
          {
            icon: <FaRocket className="w-5 h-5 text-red-500" />,
            text: `The wallet owns an ENS Domain (${data.ensDomain})`,
          },
        ]
      : []),
    ...(data.unstoppableDomain
      ? [
          {
            icon: <FaCircle className="w-5 h-5 text-red-500" />,
            text: `The wallet owns an Unstoppable Domain (${data.unstoppableDomain})`,
          },
        ]
      : []),
    {
      icon: <FaLightbulb className="w-5 h-5 text-yellow-500" />,
      text: `The wallet has performed transactions on ${data.chainsTransacted} chain(s).`,
    },
    {
      icon: <FaGlobe className="w-5 h-5 text-blue-500" />,
      text: `Transacted Chains: ${data.specificChains?.join(", ")}`,
    },
    {
      icon: <FaSnowflake className="w-5 h-5 text-cyan-500" />,
      text: `You have performed ${data.totalTransactions} transactions totally across all chains, with your highest on ${data.highestChainTransactions?.chain} with ${data.highestChainTransactions?.count} transactions.`,
    },
    {
      icon: <FaCalendar className="w-5 h-5 text-purple-500" />,
      text: `Your first transaction ever was performed on ${data.firstTransaction?.date} on ${data.firstTransaction?.chain}.`,
    },
    {
      icon: <FaHourglassHalf className="w-5 h-5 text-orange-500" />,
      text: `Your wallet is ${data.walletAge} old.`,
    },
    {
      icon: <FaShieldAlt className="w-5 h-5 text-yellow-500" />,
      text: `The total USD at risk from open token approvals is: $${data.usdAtRisk?.toFixed(
        2
      )}`,
    },
    ...(data.defiProtocols && data.defiProtocols.count > 0
      ? [
          {
            icon: <FaLayerGroup className="w-5 h-5 text-gray-400" />,
            text: `Interacted with ${
              data.defiProtocols.count
            } unique DeFi protocols (${data.defiProtocols.names.join(", ")})`,
          },
        ]
      : []),
    ...(data.highestDefiPosition
      ? [
          {
            icon: <FaSmile className="w-5 h-5 text-yellow-500" />,
            text: `Your highest DeFi position is a ${
              data.highestDefiPosition.type
            } with ${data.highestDefiPosition.token} on ${
              data.highestDefiPosition.protocol
            } amounting to $${data.highestDefiPosition.amount.toFixed(2)}`,
          },
        ]
      : []),
    ...(data.totalNetWorth && data.totalNetWorth.total > 0
      ? [
          {
            icon: <FaMoneyBillWave className="w-5 h-5 text-green-500" />,
            text: `The total net worth is $${data.totalNetWorth.total.toFixed(
              2
            )} with the highest funds on ${
              data.totalNetWorth.highestChain.chain
            } amounting to $${data.totalNetWorth.highestChain.amount.toFixed(
              2
            )}.`,
          },
        ]
      : []),
    ...(data.totalTrades !== undefined && data.totalTrades > 0
      ? [
          {
            icon: <FaChartLine className="w-5 h-5 text-blue-500" />,
            text: `You have made a total of ${
              data.totalTrades
            } trades across Ethereum and Polygon with your net profit of $${(
              data.totalProfit ?? 0
            ).toFixed(2)}.`,
          },
        ]
      : []),
    ...(data.totalGasFees && data.totalGasFees.total > 0
      ? [
          {
            icon: <FaGasPump className="w-5 h-5 text-red-500" />,
            text: `Total gas fees paid across all chains amounts to $${data.totalGasFees.total.toFixed(
              2
            )}, with the highest paid on ${
              data.totalGasFees.highestChain.chain
            } amounting to $${data.totalGasFees.highestChain.amount.toFixed(
              2
            )}`,
          },
        ]
      : []),
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-linear-to-r from-white via-[#00ff88] to-[#00cc66] drop-shadow-[0_0_30px_rgba(0,255,136,0.5)]">
        Wallet Summary
      </h2>

      <div className="space-y-2">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-3 transition-all duration-300 group">
            <div className="shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <p
              className="text-white text-base md:text-lg leading-relaxed flex-1 group-hover:text-[#00ff88] transition-colors font-medium"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
