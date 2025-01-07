"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlatformDetails from "./platform-details";

const platforms = [
  {
    name: "Codeforces",
    icon: "🏆",
    stats: {
      rating: 950, // Below average rating
      solved: 30, // A modest number of problems solved
      rank: "Newbie", // Beginner rank
      contests: 5, // Participated in a few contests
    },
    recentSubmissions: [
      { problem: "Two Sum", result: "Accepted", date: "2023-06-15" },
      {
        problem: "Reverse Integer",
        result: "Wrong Answer",
        date: "2023-06-14",
      },
      { problem: "Palindrome Number", result: "Accepted", date: "2023-06-13" },
    ],
  },
  {
    name: "LeetCode",
    icon: "🧠",
    stats: {
      rating: 1200, // Modest rating
      solved: 25, // Small number of problems solved
      rank: "Bronze", // Reflects beginner level
      contests: 3, // Participated in only a few contests
    },
    recentSubmissions: [
      { problem: "Add Two Numbers", result: "Accepted", date: "2023-06-15" },
      {
        problem: "Longest Substring",
        result: "Time Limit Exceeded",
        date: "2023-06-14",
      },
      {
        problem: "Median of Two Sorted Arrays",
        result: "Accepted",
        date: "2023-06-13",
      },
    ],
  },
  {
    name: "CodeChef",
    icon: "👨‍🍳",
    stats: {
      rating: 1050, // Beginner rating
      solved: 15, // Few problems solved
      rank: "2 Star", // Reflects a beginner level
      contests: 4, // Participated in a small number of contests
    },
    recentSubmissions: [
      { problem: "Chef and Arrays", result: "Accepted", date: "2023-06-15" },
      { problem: "Prime Game", result: "Partial", date: "2023-06-14" },
      { problem: "Maximum Subarray", result: "Accepted", date: "2023-06-13" },
    ],
  },
];

export default function PlatformList() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {platforms.map((platform) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <PlatformDetails
              platform={platform}
              isExpanded={selectedPlatform === platform.name}
              onClick={() =>
                setSelectedPlatform(
                  selectedPlatform === platform.name ? null : platform.name
                )
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
