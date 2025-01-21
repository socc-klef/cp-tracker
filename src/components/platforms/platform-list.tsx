"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlatformDetails from "./platform-details";
import { getLocalItem } from "@/utils";
import {
  fetchCodeChefData,
  fetchLeetCodeData,
  fetchCodeforcesData,
} from "@/api-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Submission {
  problem: string;
  result: string;
  date: string;
}

interface Platform {
  name: string;
  icon: string;
  stats: {
    rating: number;
    solved: number;
    rank: string | number;
    contests: number;
  };
  recentSubmissions: Submission[];
}

export default function PlatformList() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const usernames = JSON.parse(getLocalItem("usernames") || "{}");

      if (!usernames.Codeforces && !usernames.LeetCode && !usernames.CodeChef) {
        setError("No usernames found. Please set them in your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const [codeforcesData, leetcodeData, codechefData] = await Promise.all([
          usernames.Codeforces
            ? fetchCodeforcesData(usernames.Codeforces)
            : null,
          usernames.LeetCode ? fetchLeetCodeData(usernames.LeetCode) : null,
          usernames.CodeChef ? fetchCodeChefData(usernames.CodeChef) : null,
        ]);

        setPlatforms(
          [codeforcesData, leetcodeData, codechefData].filter(
            (data): data is Platform => data !== null
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching platform data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full my-6">
        <CardHeader>
          <CardTitle>Coding Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full my-6">
        <CardHeader>
          <CardTitle>Coding Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (platforms.length === 0) {
    return (
      <Card className="w-full my-6">
        <CardHeader>
          <CardTitle>Coding Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">No platform data available.</div>
        </CardContent>
      </Card>
    );
  }

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
