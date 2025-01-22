"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlatformDetails from "./platform-details";
import {
  fetchCodeChefData,
  fetchLeetCodeData,
  fetchCodeforcesData,
} from "@/api-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { getLocalItem } from "@/utils";

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
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  // Load data from sessionStorage
  function loadFromSessionStorage() {
    const savedData = localStorage.getItem("platformData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPlatforms(parsedData.data);
      setLastFetchTime(parsedData.lastFetchTime);
      setIsLoading(false);
    }
  }

  // Save data to sessionStorage
  function saveToSessionStorage(data: Platform[]) {
    localStorage.setItem(
      "platformData",
      JSON.stringify({
        data,
        lastFetchTime: Date.now(),
      })
    );
  }

  // Fetch data from API
  async function fetchData() {
    setIsLoading(true);
    setError(null);

    const usernames = JSON.parse(getLocalItem("usernames") || "{}");

    if (!usernames.Codeforces && !usernames.LeetCode && !usernames.CodeChef) {
      setError("No usernames found. Please set them in your profile.");
      setIsLoading(false);
      return;
    }

    try {
      const [codeforcesData, leetcodeData, codechefData] = await Promise.all([
        usernames.Codeforces ? fetchCodeforcesData(usernames.Codeforces) : null,
        usernames.LeetCode ? fetchLeetCodeData(usernames.LeetCode) : null,
        usernames.CodeChef ? fetchCodeChefData(usernames.CodeChef) : null,
      ]);

      const fetchedData = [codeforcesData, leetcodeData, codechefData].filter(
        (data): data is Platform => data !== null
      );

      setPlatforms(fetchedData);
      saveToSessionStorage(fetchedData);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error("Error fetching platform data:", error);
      setError("Error fetching platform data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  // Load data on initial render
  useEffect(() => {
    loadFromSessionStorage();
    if (!localStorage.getItem("platformData")) {
      fetchData();
    }
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
          <div className="flex justify-center mt-4">
            <Button variant="ghost" onClick={fetchData}>
              Retry
            </Button>
          </div>
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
