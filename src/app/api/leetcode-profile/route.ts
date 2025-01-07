/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

type LeetcodePlatformData = {
  name: string;
  icon: string;
  stats: {
    rating: number;
    solved: number;
    rank: string;
    contests: number;
  };
  recentSubmissions: Array<{
    problem: string;
    result: string;
    date: string;
  }>;
};

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://leetcode.com/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          matchedUser(username: "${username}") {
            profile {
              ranking
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }`,
      }),
    });
    const data = await res.json();

    const platformData: LeetcodePlatformData = {
      name: "LeetCode",
      icon: "🧠",
      stats: {
        rating: data.data.matchedUser.profile.ranking,
        solved: data.data.matchedUser.submitStatsGlobal.acSubmissionNum.reduce(
          (acc: number, cur: { count: number }) => acc + cur.count,
          0
        ),
        rank: "N/A",
        contests: 0,
      },
      recentSubmissions: [], // Add logic to fetch recent submissions if needed
    };

    return NextResponse.json(platformData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}
