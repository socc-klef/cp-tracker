"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PerformanceGraph from "@/components/dashboard/performance-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPerformanceData, PerformanceData } from "@/api-utils";
import { addLocalItem, getLocalItem } from "@/utils";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

const STORAGE_KEY = "dashboardPerformanceData";

export default function DashboardContent() {
  const [performanceData, setPerformanceData] = useState<{
    codeforces: PerformanceData[];
    leetcode: PerformanceData[];
  }>({ codeforces: [], leetcode: [] });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  // Function to load data from localStorage
  function loadFromLocalStorage() {
    const savedData = getLocalItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPerformanceData(parsedData.data);
      setLastFetchTime(parsedData.lastFetchTime);
      setIsLoading(false);
    }
  }

  // Function to save data to localStorage
  function saveToLocalStorage(data: {
    codeforces: PerformanceData[];
    leetcode: PerformanceData[];
  }) {
    addLocalItem(
      STORAGE_KEY,
      JSON.stringify({
        data,
        lastFetchTime: Date.now(),
      })
    );
  }

  // Function to fetch data from API
  async function fetchData() {
    setIsLoading(true);
    setError(null);
    try {
      const [codeforcesData, leetcodeData] = await Promise.all([
        fetchPerformanceData("Codeforces"),
        fetchPerformanceData("LeetCode"),
      ]);

      const newData = {
        codeforces: codeforcesData,
        leetcode: leetcodeData.slice(1),
      };

      setPerformanceData(newData);
      saveToLocalStorage(newData);
      setLastFetchTime(Date.now());
    } catch (err) {
      console.error("Error fetching performance data:", err);
      setError("Error fetching performance data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  // Load from localStorage on initial render
  useEffect(() => {
    loadFromLocalStorage();
    if (!getLocalItem(STORAGE_KEY)) {
      fetchData();
    }
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
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={fetchData}
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex w-full justify-between items-center">
        {lastFetchTime && (
          <span className="text-gray-500">
            Last updated: {new Date(lastFetchTime).toLocaleString()}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={fetchData}>
          <RefreshCcw />
        </Button>
      </div>

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
