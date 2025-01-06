"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  Circle,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const GitHubActivity = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const githubData = {
    name: "GitHub",
    icon: "🐙",
    stats: {
      repositories: 45,
      stars: 120,
      followers: 89,
      contributions: 847,
    },
    recentActivity: [
      { type: "Push", repo: "algorithm-visualizer", date: "2023-06-15" },
      { type: "PullRequest", repo: "open-source-project", date: "2023-06-14" },
      { type: "Issue", repo: "web-framework", date: "2023-06-13" },
    ],
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Push":
        return <GitCommit className="w-4 h-4" />;
      case "PullRequest":
        return <GitPullRequest className="w-4 h-4" />;
      case "Issue":
        return <Circle className="w-4 h-4" />;
      default:
        return <GitBranch className="w-4 h-4" />;
    }
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-shadow border dark:border-gray-700 my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="p-4 flex items-center justify-between">
        <button
          className="flex-grow flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="github-details"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{githubData.icon}</span>
            <span className="font-semibold text-lg dark:text-white">
              {githubData.name}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Repositories
              </div>
              <div className="font-semibold dark:text-white">
                {githubData.stats.repositories}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Stars
              </div>
              <div className="font-semibold dark:text-white">
                {githubData.stats.stars}
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="ml-2 text-gray-600 dark:text-gray-400"
            >
              <ChevronDown />
            </motion.div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="github-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t bg-muted">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 dark:text-white">
                    Contribution Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Contributions
                      </div>
                      <div className="font-semibold dark:text-white">
                        {githubData.stats.contributions}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Followers
                      </div>
                      <div className="font-semibold dark:text-white">
                        {githubData.stats.followers}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 dark:text-white">
                    Recent Activity
                  </h3>
                  <div className="space-y-2">
                    {githubData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          {getActivityIcon(activity.type)}
                        </span>
                        <span className="text-sm dark:text-gray-200">
                          {activity.type} on{" "}
                          <span className="font-medium">{activity.repo}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GitHubActivity;
