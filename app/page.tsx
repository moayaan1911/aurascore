"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import Background3D from "./components/Background3D";
import Header from "./components/Header";
import Features from "./components/Features";
import Footer from "./components/Footer";
import {
  FaSearch,
  FaArrowRight,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Resolve ENS domain to address
  const resolveENS = async (domain: string): Promise<string | null> => {
    const response = await fetch("/api/resolve-ens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
      cache: "force-cache",
    });

    if (!response.ok) {
      if (response.status === 429) {
        const err = await response.json().catch(() => ({}));
        toast.error(
          err?.error ||
            "Rate limit exceeded! You can only make 2 requests per 60 seconds."
        );
        throw new Error("RATE_LIMITED");
      }
      throw new Error("Failed to resolve ENS domain");
    }

    const data = await response.json();
    return data.address || null;
  };

  // Resolve Unstoppable domain to address
  const resolveUnstoppable = async (domain: string): Promise<string | null> => {
    const response = await fetch("/api/resolve-unstoppable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
      cache: "force-cache",
    });

    if (!response.ok) {
      if (response.status === 429) {
        const err = await response.json().catch(() => ({}));
        toast.error(
          err?.error ||
            "Rate limit exceeded! You can only make 2 requests per 60 seconds."
        );
        throw new Error("RATE_LIMITED");
      }
      throw new Error("Failed to resolve Unstoppable domain");
    }

    const data = await response.json();
    return data.address || null;
  };

  const handleFetchScore = async () => {
    const trimmedAddress = address.trim();

    // Check if empty
    if (!trimmedAddress) {
      toast.error(
        "Please enter a wallet address, ENS domain, or Unstoppable domain"
      );
      return;
    }

    setIsLoading(true);

    try {
      let resolvedAddress: string | null = null;

      // Check if it's an ENS domain (.eth)
      if (trimmedAddress.endsWith(".eth")) {
        toast.loading("Resolving ENS domain...", { id: "resolving" });
        resolvedAddress = await resolveENS(trimmedAddress);
        toast.dismiss("resolving");

        if (!resolvedAddress) {
          toast.error("Invalid ENS domain. Could not resolve to an address.");
          setIsLoading(false);
          return;
        }
        toast.success(
          `Resolved to ${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(
            -4
          )}`
        );
      }
      // Check if it's a valid Ethereum address
      else if (isAddress(trimmedAddress)) {
        resolvedAddress = trimmedAddress;
      }
      // Otherwise, try resolving as Unstoppable domain
      else {
        toast.loading("Resolving domain...", { id: "resolving" });
        resolvedAddress = await resolveUnstoppable(trimmedAddress);
        toast.dismiss("resolving");

        if (!resolvedAddress) {
          toast.error("Invalid domain or address. Please check and try again.");
          setIsLoading(false);
          return;
        }
        toast.success(
          `Resolved to ${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(
            -4
          )}`
        );
      }

      // Navigate to summary page with the resolved address
      router.push(`/summary?address=${resolvedAddress}`);
    } catch (error) {
      toast.dismiss("resolving");
      // Don't show additional error for rate limiting (already shown)
      if (error instanceof Error && error.message === "RATE_LIMITED") {
        setIsLoading(false);
        return;
      }
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleFetchScore();
    }
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
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(0, 255, 136, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#00ff88",
              secondary: "#000",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff4444",
              secondary: "#fff",
            },
          },
        }}
      />

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
                  onKeyDown={handleKeyPress}
                  placeholder="Enter address / ENS domain / Unstoppable domain"
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-lg font-mono"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleFetchScore}
                disabled={isLoading}
                className="bg-[#00ff88] hover:bg-[#00cc66] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transform hover:scale-105 active:scale-95 cursor-pointer disabled:transform-none disabled:hover:shadow-none">
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    Fetch Score <FaArrowRight />
                  </>
                )}
              </button>
            </div>
            {/* Disclaimer */}
            <div className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-sm">
              <FaInfoCircle className="text-[#00ff88]" />
              <span>Only EVM addresses supported</span>
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
