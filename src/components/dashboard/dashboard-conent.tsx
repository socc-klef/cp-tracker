"use client";

import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/stat-card";
import PerformanceGraph from "@/components/dashboard/performance-graph";

const platforms = [
  { name: "Codeforces", icon: "🏆", rating: 1800, solved: 500, rank: "Expert" },
  { name: "LeetCode", icon: "🧠", rating: 2100, solved: 350, rank: "Guardian" },
  { name: "CodeChef", icon: "👨‍🍳", rating: 2000, solved: 200, rank: "5 Star" },
  { name: "GitHub", icon: "🐙", contributions: 500, repos: 20, followers: 100 },
];

export default function DashboardContent() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCard platform={platform} />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PerformanceGraph title="Codeforces Rating History" />
        <PerformanceGraph title="LeetCode Submission History" />
      </div>
    </div>
  );
}
