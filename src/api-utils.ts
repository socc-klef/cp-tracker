import { getLocalItem } from "./utils";

export interface Submission {
  problem: string;
  result: string;
  date: string;
}

export interface Platform {
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

export interface GitHubData {
  name: string;
  icon: string;
  stats: {
    repositories: number;
    stars: number;
    followers: number;
    contributions: number;
  };
  recentActivity: {
    type: string;
    repo: string;
    date: string;
  }[];
}

// Utility function to process submissions
const processSubmissions = (submissions: Submission[]): Submission[] =>
  submissions.slice(0, 3).map((sub) => ({
    ...sub,
    date:
      sub.date === "N/A" ? sub.date : new Date(sub.date).toLocaleDateString(),
  }));

// Fetch data for Codeforces
export const fetchCodeforcesData = async (
  username: string
): Promise<Platform> => {
  const response = await fetch(`/api/codeforces-profile?username=${username}`);
  const data = await response.json();
  return {
    ...data,
    recentSubmissions: processSubmissions(data.recentSubmissions),
  };
};

// Fetch data for LeetCode
export const fetchLeetCodeData = async (
  username: string
): Promise<Platform> => {
  const response = await fetch(`/api/leetcode-profile?username=${username}`);
  const data = await response.json();
  return {
    ...data,
    recentSubmissions: processSubmissions(data.recentSubmissions),
  };
};

// Fetch data for CodeChef
export const fetchCodeChefData = async (
  username: string
): Promise<Platform> => {
  const response = await fetch(`/api/codechef-profile?username=${username}`);
  const data = await response.json();
  return {
    ...data,
    recentSubmissions: processSubmissions(data.recentSubmissions),
  };
};

// Fetch GitHub data
export const fetchGitHubData = async (
  username: string
): Promise<GitHubData> => {
  const response = await fetch(`/api/github-profile?username=${username}`);
  const data = await response.json();
  return data;
};

export interface PerformanceData {
  contestName: string;
  date: string;
  rating: number;
}

// New interface for platform performance
export interface PlatformPerformance {
  codeforces: PerformanceData[];
  leetcode: PerformanceData[];
}

// Fetch performance data for a specific platform
export const fetchPerformanceData = async (
  platform: "Codeforces" | "LeetCode"
): Promise<PerformanceData[]> => {
  // Get the usernames object from local storage
  const usernames = JSON.parse(getLocalItem("usernames") || "{}");

  // Check if the platform is valid and the username exists for the platform
  let username: string | null = null;

  if (platform && usernames) {
    if (platform === "Codeforces" && usernames.Codeforces) {
      username = usernames.Codeforces;
    } else if (platform === "LeetCode" && usernames.LeetCode) {
      username = usernames.LeetCode;
    } else {
      // If the platform doesn't have a valid username, log an error
      console.error("Username not found for platform:", platform);
    }
  } else {
    // Handle case where usernames object or platform is missing
    console.error("Usernames or platform is not available");
  }

  // If username is not found or is null, stop further processing
  if (!username) {
    throw new Error(`No username available for platform ${platform}`);
  }

  // Fetch the performance data using the username for the specified platform
  try {
    const response = await fetch(
      `/api/${platform.toLowerCase()}-performance?username=${username}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for platform ${platform}`);
    }

    const data = await response.json();

    // Format the date properly and return the performance data
    return data.map((item: PerformanceData) => ({
      ...item,
      date: item.date,
    }));
  } catch (error) {
    console.error("Error fetching performance data:", error);
    throw new Error("Error fetching performance data. Please try again later.");
  }
};

// Fetch performance data for all platforms
export const fetchAllPerformanceData =
  async (): Promise<PlatformPerformance> => {
    const [codeforcesData, leetcodeData] = await Promise.all([
      fetchPerformanceData("Codeforces"),
      fetchPerformanceData("LeetCode"),
    ]);

    return {
      codeforces: codeforcesData,
      leetcode: leetcodeData,
    };
  };
