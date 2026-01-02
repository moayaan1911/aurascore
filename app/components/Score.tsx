"use client";

import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface ScoreProps {
  score?: number;
  ensName?: string;
  avatarUrl?: string;
}

export default function Score({
  score = 87.76,
  ensName = "bharatharaj.eth",
  avatarUrl = "/icon.png",
}: ScoreProps) {
  // Calculate stroke dasharray for the gauge
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // We want a semi-circle gauge (180 degrees), so we only use half the circumference for the "full" meter
  // But for a circular score, let's do a 240 degree arc or similar.
  // Let's stick to a simple clean full circle or 3/4 circle.
  // Actually, a semi-circle gauge looks great for "Speedometer" style scores.

  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = (score: number) => {
    if (score >= 80) return "#00ff88"; // Green
    if (score >= 60) return "#ffff00"; // Yellow
    if (score >= 40) return "#ffa500"; // Orange
    return "#ff0000"; // Red
  };

  const scoreColor = getColor(score);

  return (
    <div className="w-full max-w-md mx-auto mb-4 relative">
      <div className="py-4 flex flex-col items-center relative overflow-hidden group">
        {/* Avatar & ENS */}
        <div className="relative z-10 flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-[#00ff88] p-1 mb-3 shadow-[0_0_30px_rgba(0,255,136,0.6)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={ensName}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-400" />
              )}
            </div>
          </div>
          <h3
            className="text-xl font-bold text-white tracking-wide px-6 py-2 rounded-full bg-black/70 backdrop-blur-sm"
            style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {ensName}
          </h3>
        </div>

        {/* Score Gauge */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56">
            {/* SVG Gauge */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200">
              {/* Background Circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 20px ${scoreColor})` }}
              />
            </svg>

            {/* Text in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-gray-300 text-xs uppercase tracking-widest mb-2 font-medium">
                Your Score
              </span>
              <div
                className="text-6xl font-bold text-white tracking-tighter"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}>
                  {score}
                </motion.span>
              </div>
              <span className="text-gray-400 text-lg mt-1 font-light">
                / 100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
