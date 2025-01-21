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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLocalItem } from "@/utils";
import { fetchGitHubData } from "@/api-utils";

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
  const [githubData, setGitHubData] = useState<GitHubData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const usernames = JSON.parse(getLocalItem("usernames") || "{}");
      const githubUsername = usernames.GitHub;

      if (!githubUsername) {
        setError("GitHub username not found. Please set it in your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchGitHubData(githubUsername);
        setGitHubData(data);
      } catch (error) {
        setError("Error fetching GitHub data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <Card className="w-full my-6">
        <CardHeader>
          <CardTitle>GitHub Activity</CardTitle>
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
          <CardTitle>GitHub Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!githubData) {
    return null;
  }

  return (
    <Card
      className="w-full my-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{githubData.icon}</span>
            <span>{githubData.name}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </CardTitle>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(githubData.stats).map(([key, value]) => (
                    <div key={key} className="bg-muted p-4 rounded-lg">
                      <dt className="text-sm font-medium text-muted-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold">{value}</dd>
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Repository</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {githubData.recentActivity.map((activity, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              {getActivityIcon(activity.type)}
                              <span>{activity.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.repo}</TableCell>
                          <TableCell>{activity.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default GitHubActivity;
