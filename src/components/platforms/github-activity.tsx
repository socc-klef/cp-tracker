"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  Circle,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";

type Activity = {
  type: string;
  repo: string;
  date: string;
};

type GitHubData = {
  name: string;
  icon: string;
  stats: {
    repositories: number;
    stars: number;
    followers: number;
    contributions: number;
  };
  recentActivity: Activity[];
};

const GitHubActivity = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const githubData: GitHubData = {
    name: "GitHub",
    icon: "🐙",
    stats: {
      repositories: 38, // Updated value
      stars: 21, // Updated value
      followers: 43, // Updated value
      contributions: 60, // Updated value
    },
    recentActivity: [
      { type: "Push", repo: "new-project", date: "2024-12-01" }, // Updated value
      { type: "PullRequest", repo: "my-library", date: "2024-11-28" }, // Updated value
      { type: "Issue", repo: "design-system", date: "2024-11-25" }, // Updated value
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
                    {githubData.recentActivity.map(
                      (activity: Activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-gray-600 dark:text-gray-400">
                            {getActivityIcon(activity.type)}
                          </span>
                          <span className="text-sm dark:text-gray-200">
                            {activity.type} on{" "}
                            <span className="font-medium">{activity.repo}</span>
                          </span>
                        </div>
                      )
                    )}
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
