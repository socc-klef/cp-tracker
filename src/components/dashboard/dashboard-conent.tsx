"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlatformList from "@/components/platforms/platform-list";
import GitHubActivity from "@/components/platforms/github-activity";
import PerformanceGraph from "@/components/dashboard/performance-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPerformanceData, PerformanceData } from "@/api-utils";

export default function DashboardContent() {
  const [performanceData, setPerformanceData] = useState<{
    codeforces: PerformanceData[];
    leetcode: PerformanceData[];
  }>({
    codeforces: [],
    leetcode: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [codeforcesData, leetcodeData] = await Promise.all([
          fetchPerformanceData("Codeforces"),
          fetchPerformanceData("LeetCode"),
        ]);

        setPerformanceData({
          codeforces: codeforcesData,
          leetcode: leetcodeData.slice(1),
        });
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setError("Error fetching performance data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full my-6">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <PerformanceGraph
            title="Codeforces Rating History"
            data={performanceData.codeforces}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <PerformanceGraph
            title="LeetCode Performance History"
            data={performanceData.leetcode}
          />
        </motion.div>
      </div>
    </div>
  );
}
