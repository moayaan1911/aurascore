"use client";

import { motion } from "framer-motion";

interface HeatmapProps {
  data?: { date: string; count: number }[];
}

// Generate dummy data for the last 12 months (365 days)
const generateDummyHeatmapData = () => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    // Full year
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Random transaction count with some logic to make it look realistic (clusters)
    const count = Math.random() > 0.6 ? Math.floor(Math.random() * 12) : 0;
    data.push({ date: date.toISOString().split("T")[0], count });
  }
  return data.reverse();
};

const dummyData = generateDummyHeatmapData();

export default function Heatmap({ data = dummyData }: HeatmapProps) {
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-[#2a2a2a]"; // Grey for no transactions
    if (count <= 3) return "bg-[#0d4429]"; // Light green
    if (count <= 6) return "bg-[#00662f]"; // Medium green
    if (count <= 9) return "bg-[#00aa55]"; // Brighter green
    return "bg-[#00ff88]"; // Bright neon green
  };

  // Generate month labels for the past 12 months
  const getMonthLabels = () => {
    const months = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleString("default", { month: "short" }));
    }
    return months;
  };

  const monthLabels = getMonthLabels();

  // Group data by weeks for proper display
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-4">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-[#00ff88] rounded-full mr-2"></span>
            Transaction Heatmap
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span>Less</span>
            <div className="w-3 h-3 bg-[#2a2a2a] rounded-sm border border-gray-500/30"></div>
            <div className="w-3 h-3 bg-[#0d4429] rounded-sm"></div>
            <div className="w-3 h-3 bg-[#00662f] rounded-sm"></div>
            <div className="w-3 h-3 bg-[#00aa55] rounded-sm"></div>
            <div className="w-3 h-3 bg-[#00ff88] rounded-sm"></div>
            <span>More</span>
          </div>
        </div>

        <div className="w-full">
          {/* Month Labels */}
          <div className="flex mb-2">
            {monthLabels.map((month, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-300 font-medium text-center"
                style={{ width: `${100 / 12}%` }}>
                {month}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-full">
            {data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.001, duration: 0.15 }}
                className={`w-full aspect-square rounded-sm ${getColorClass(
                  item.count
                )} relative group cursor-pointer`}
                whileHover={{ scale: 1.5, zIndex: 10 }}>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/20 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-20 transition-opacity">
                  {item.count} txns on {item.date}
                </div>

                {/* Glow effect for high activity */}
                {item.count > 5 && (
                  <div className="absolute inset-0 bg-[#00ff88] blur-sm opacity-50"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-3 font-mono">
          Showing transaction activity over the last 12 months
        </p>
      </div>
    </div>
  );
}
