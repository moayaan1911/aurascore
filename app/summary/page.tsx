"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiDownload, FiX, FiImage } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import makeBlockie from "ethereum-blockies-base64";
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

const loadingMessages = [
  "Fetching wallet data",
  "Analyzing transactions",
  "Gathering DeFi positions",
  "Fetching token prices",
  "Calculating total transaction fees",
  "Aggregating data across multiple chains",
  "Checking for wallet domains (ENS, Unstoppable)",
  "Processing transaction heatmap data",
  "Building your transaction heatmap",
  "Evaluating risk from token approvals",
  "Calculating total gas fees in USD",
  "Analyzing smart contract interactions",
  "Calculating wallet's net worth",
  "Finalizing onchain analysis",
];

function SummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const walletAddress = searchParams.get("address")?.trim() || "";

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(loadingMessages[0] + "...");
  const [score, setScore] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [heatmapData, setHeatmapData] = useState<HeatmapItem[]>([]);
  const [summaryData, setSummaryData] = useState<WalletSummaryData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const fetchApi = useMemo(
    () => async (endpoint: string, body: Record<string, unknown>) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "force-cache",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        
        // Show toast for rate limit errors
        if (res.status === 429) {
          toast.error(err?.error || "Rate limit exceeded! You can only make 2 requests per 60 seconds.", {
            duration: 6000,
          });
        }
        
        throw new Error(err?.error || `Failed ${endpoint}`);
      }
      return res.json();
    },
    []
  );

  // Redirect to home if no wallet address
  useEffect(() => {
    if (!walletAddress) {
      router.replace("/");
    }
  }, [walletAddress, router]);

  // Fetch data
  useEffect(() => {
    if (!walletAddress) return;

    // Rotate loading text
    let count = 0;
    const intervalId = setInterval(() => {
      setLoadingText(loadingMessages[count % loadingMessages.length] + "...");
      count += 1;
    }, 1200);

    const run = async () => {
      try {
        setAvatarUrl(makeBlockie(walletAddress));

        // Chain activity
        const chainData = await fetchApi("/api/get-chain-activity", {
          walletAddress,
        });
        const activeChains =
          chainData?.active_chains?.filter(
            (c: { first_transaction: unknown }) => c.first_transaction
          ) || [];

        // First tx + wallet age
        let earliestTs: number | null = null;
        let earliestChain = "";
        activeChains.forEach(
          (c: {
            chain: string;
            first_transaction?: { block_timestamp?: string };
          }) => {
            const ts = c.first_transaction?.block_timestamp;
            if (!ts) return;
            const d = new Date(ts);
            if (earliestTs === null || d.getTime() < earliestTs) {
              earliestTs = d.getTime();
              earliestChain = c.chain;
            }
          }
        );
        let walletAgeYears = "0";
        if (earliestTs !== null) {
          const diff = (Date.now() - earliestTs) / (1000 * 60 * 60 * 24 * 365);
          walletAgeYears = diff.toFixed(2);
        }

        // Token prices (for fees conversion)
        const [ethPriceInUsd, bnbPriceInUsd, avaxPriceInUsd, maticPriceInUsd] =
          await Promise.all([
            fetchApi("/api/get-token-price", {
              tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              chain: "eth",
            }),
            fetchApi("/api/get-token-price", {
              tokenAddress: "0x418D75f65a02b3D53B2418FB8E1fe493759c7605",
              chain: "eth",
            }),
            fetchApi("/api/get-token-price", {
              tokenAddress: "0x85f138bfEE4ef8e540890CFb48F620571d67Eda3",
              chain: "eth",
            }),
            fetchApi("/api/get-token-price", {
              tokenAddress: "0x7c9f4C87d911613Fe9ca58b579f737911AAD2D43",
              chain: "eth",
            }),
          ]);

        const txCounts: Record<string, number> = {};
        const feesUsd: Record<string, number> = {};
        let totalTx = 0;
        const heatmapCount: Record<string, number> = {};

        await Promise.all(
          activeChains.map(async (c: { chain: string }) => {
            const { totalTransactionFees, allTimestamps } = await fetchApi(
              "/api/get-transaction-history-and-fees",
              {
                walletAddress,
                chain: c.chain,
              }
            );

            let price = ethPriceInUsd.usdPrice || 0;
            if (c.chain === "avalanche") price = avaxPriceInUsd.usdPrice || 0;
            else if (c.chain === "bsc") price = bnbPriceInUsd.usdPrice || 0;
            else if (c.chain === "polygon")
              price = maticPriceInUsd.usdPrice || 0;

            const chainFeesUsd = (totalTransactionFees || 0) * price;
            feesUsd[c.chain] = isNaN(chainFeesUsd) ? 0 : chainFeesUsd;

            const cnt = allTimestamps?.length || 0;
            txCounts[c.chain] = cnt;
            totalTx += cnt;

            allTimestamps?.forEach((ts: string) => {
              const d = new Date(ts).toISOString().split("T")[0];
              heatmapCount[d] = (heatmapCount[d] || 0) + 1;
            });
          })
        );

        // Heatmap last 365 days
        const today = new Date();
        const map: HeatmapItem[] = [];
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split("T")[0];
          map.push({ date: key, count: heatmapCount[key] || 0 });
        }
        setHeatmapData(map.reverse());

        const mostActive =
          Object.keys(txCounts).length === 0
            ? ""
            : Object.keys(txCounts).reduce((a, b) =>
                txCounts[b] > txCounts[a] ? b : a
              );

        const totalFeesUsd = Object.values(feesUsd).reduce(
          (acc, v) => acc + v,
          0
        );
        const highestFeeChain =
          Object.keys(feesUsd).length === 0
            ? ""
            : Object.keys(feesUsd).reduce((a, b) =>
                feesUsd[b] > feesUsd[a] ? b : a
              );

        // Domains
        const domainData = await fetchApi("/api/get-domain-data", {
          walletAddress,
        });
        const ensDomain = domainData?.ensDomain || null;
        const unstoppableDomain = domainData?.unstoppableDomain || null;
        setDisplayName(
          ensDomain ||
            unstoppableDomain ||
            `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        );

        // Net worth
        const netWorthChains = [
          "eth",
          "polygon",
          "bsc",
          "avalanche",
          "arbitrum",
          "optimism",
          "base",
        ];
        const netWorthData = await fetchApi("/api/get-wallet-net-worth", {
          walletAddress,
          chains: netWorthChains,
        });
        let highestNetWorth = 0;
        let highestChainData = { chain: "", amount: 0 };
        netWorthData?.chains?.forEach(
          (c: { chain: string; networth_usd: string }) => {
            const val = parseFloat(c.networth_usd || "0");
            if (val > highestNetWorth) {
              highestNetWorth = val;
              highestChainData = { chain: c.chain.toUpperCase(), amount: val };
            }
          }
        );

        // Approvals risk
        let totalUsdRisk = 0;
        await Promise.all(
          activeChains.map(async (c: { chain: string }) => {
            const approvals = await fetchApi("/api/get-token-approvals", {
              walletAddress,
              chain: c.chain,
            });
            approvals?.forEach((a: { token?: { usd_at_risk?: string } }) => {
              const risk = parseFloat(a?.token?.usd_at_risk || "0");
              if (!isNaN(risk)) totalUsdRisk += risk;
            });
          })
        );

        // DeFi positions (eth)
        type DefiPosition = {
          balance_usd: number;
          label?: string;
          tokens?: { name?: string }[];
        };
        const defiProtocols = new Set<string>();
        let maxPosition: DefiPosition | null = null;
        let maxUsdValue = 0;
        let protocolOfMax = "";
        const defiData = await fetchApi("/api/get-defi-positions", {
          walletAddress,
          chain: "eth",
        });
        defiData?.forEach(
          (p: { protocol_name?: string; position?: DefiPosition }) => {
            if (p.protocol_name) defiProtocols.add(p.protocol_name);
            if (p.position && p.position.balance_usd > maxUsdValue) {
              maxUsdValue = p.position.balance_usd;
              maxPosition = p.position;
              protocolOfMax = p.protocol_name || "";
            }
          }
        );

        // Profitability (eth, polygon)
        const pnlChains = ["eth", "polygon"];
        let totalTrades = 0;
        let totalProfit = 0;
        await Promise.all(
          pnlChains.map(async (c) => {
            const profit = await fetchApi("/api/get-profitability-summary", {
              walletAddress,
              chain: c,
            });
            totalTrades += profit.total_count_of_trades || 0;
            totalProfit += parseFloat(profit.total_realized_profit_usd || "0");
          })
        );

        // Score
        const calculatedScore = (() => {
          let s = 0;
          const transactionScore =
            25 +
            Math.min(15, (totalTx / 250) * 15) +
            Math.min(10, (activeChains.length / 3) * 10) +
            Math.min(10, (totalTrades / 40) * 10);
          s += transactionScore;
          const walletAgeScore =
            4 + Math.min(1, (parseFloat(walletAgeYears) / 1.5) * 1);
          s += walletAgeScore;
          const defiScore = 6 + Math.min(4, (defiProtocols.size / 3) * 4);
          s += defiScore;
          const totalNetWorthUsd =
            parseFloat(netWorthData.total_networth_usd) || 0;
          const netWorthScore = Math.min(20, (totalNetWorthUsd / 20000) * 20);
          s += netWorthScore;
          const riskScore = Math.max(0, (1 - totalUsdRisk / 50000) * 5);
          s += riskScore;
          const gasRatio = totalFeesUsd / (totalNetWorthUsd || 1);
          const gasScore = Math.min(10, (gasRatio / 0.05) * 10);
          s += gasScore;
          const profitScore =
            totalProfit >= 0 ? Math.min(5, (totalProfit / 2000) * 5) : 2;
          s += profitScore;
          const domainScore =
            ensDomain && unstoppableDomain
              ? 10
              : ensDomain || unstoppableDomain
              ? 5
              : 0;
          s += domainScore;
          return Math.min(100, Math.max(0, s));
        })();

        setScore(parseFloat(calculatedScore.toFixed(2)));

        const highestDefiPosition =
          maxPosition !== null
            ? {
                type: (maxPosition as DefiPosition).label ?? "position",
                protocol: protocolOfMax,
                token:
                  (maxPosition as DefiPosition).tokens?.[0]?.name || "Unknown",
                amount: maxUsdValue,
              }
            : undefined;

        setSummaryData({
          ensDomain,
          unstoppableDomain,
          chainsTransacted: activeChains.length,
          specificChains: activeChains.map((c: { chain: string }) => c.chain),
          totalTransactions: totalTx,
          highestChainTransactions: {
            chain: mostActive,
            count: txCounts[mostActive] || 0,
          },
          firstTransaction: {
            date:
              earliestTs !== null ? new Date(earliestTs).toDateString() : "N/A",
            chain: earliestChain || "N/A",
          },
          walletAge: `${walletAgeYears} years`,
          usdAtRisk: totalUsdRisk,
          defiProtocols: {
            count: defiProtocols.size,
            names: Array.from(defiProtocols),
          },
          highestDefiPosition,
          totalNetWorth: {
            total: parseFloat(netWorthData.total_networth_usd) || 0,
            highestChain: highestChainData,
          },
          totalGasFees: {
            total: totalFeesUsd,
            highestChain: {
              chain: highestFeeChain.toUpperCase(),
              amount: feesUsd[highestFeeChain] || 0,
            },
          },
          totalTrades,
          totalProfit,
        });

        setLoading(false);
        clearInterval(intervalId);
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
        setLoading(false);
        clearInterval(intervalId);
      }
    };

    run();

    return () => clearInterval(intervalId);
  }, [walletAddress, fetchApi]);

  const handleDownloadPDF = async () => {
    if (!summaryData) {
      toast.error("No data available to generate PDF");
      return;
    }

    try {
      toast.loading("Generating your AuraScore PDF...", {
        id: "pdf-generation",
      });
      await generateAuraScorePDF(
        walletAddress,
        displayName,
        score,
        summaryData,
        heatmapData
      );
      toast.success("PDF downloaded successfully! 🎉", {
        id: "pdf-generation",
        duration: 4000,
      });

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00ff88", "#00cc6a", "#00aa55", "#ffffff"],
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", {
        id: "pdf-generation",
      });
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
      toast.success("Image downloaded successfully! 🎨", {
        id: "image-gen",
        duration: 4000,
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00ff88", "#ffffff", "#00cc66"],
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.", {
        id: "image-gen",
      });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen relative flex flex-col font-sans text-white overflow-hidden selection:bg-[#00ff88] selection:text-black">
        <Background3D />
        <div className="grow flex flex-col items-center justify-center px-4 md:px-8 z-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <FaSpinner className="w-16 h-16 text-[#00ff88] animate-spin" />
            <p
              className="text-xl text-gray-300 font-medium"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {loadingText}
            </p>
            <p className="text-sm text-gray-500 font-mono">
              Analyzing {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !summaryData) {
    return (
      <main className="min-h-screen relative flex flex-col font-sans text-white overflow-hidden selection:bg-[#00ff88] selection:text-black">
        <Background3D />
        <div className="grow flex flex-col items-center justify-center px-4 md:px-8 z-10">
          <p className="text-lg text-red-400 font-semibold">{error}</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col font-sans text-white overflow-hidden selection:bg-[#00ff88] selection:text-black">
      {/* 3D Background */}
      <Background3D />

      {/* Main Content */}
      <div className="grow flex flex-col items-center justify-start px-4 md:px-8 pt-20 pb-12 z-10 w-full max-w-6xl mx-auto">
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

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen relative flex flex-col font-sans text-white overflow-hidden selection:bg-[#00ff88] selection:text-black">
          <Background3D />
          <div className="grow flex flex-col items-center justify-center px-4 md:px-8 z-10">
            <div className="flex flex-col items-center gap-6 text-center">
              <FaSpinner className="w-16 h-16 text-[#00ff88] animate-spin" />
              <p
                className="text-xl text-gray-300 font-medium"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Loading summary...
              </p>
            </div>
          </div>
          <Footer />
        </main>
      }>
      <SummaryContent />
    </Suspense>
  );
}
