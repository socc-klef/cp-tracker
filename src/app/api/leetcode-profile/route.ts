/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

type LeetcodePlatformData = {
  name: string;
  icon: string;
  stats: {
    rating: number | null;
    solved: number | null;
    rank: string | null;
    contests: number | null;
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
    const query = `
      query getLeetCodeCPData($username: String!, $recentLimit: Int!) {
        matchedUser(username: $username) {
          profile {
            ranking
          }
          submitStatsGlobal {
            acSubmissionNum {
              count
            }
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
        }
        recentAcSubmissionList(username: $username, limit: $recentLimit) {
          title
          timestamp
          id
        }
      }
    `;

    const variables = {
      username,
      recentLimit: 5, // Adjust as needed
    };

    const res = await fetch(`https://leetcode.com/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();

    if (!data || !data.data || !data.data.matchedUser) {
      return NextResponse.json(
        { error: "Invalid response from LeetCode API" },
        { status: 500 }
      );
    }

    const matchedUser = data.data.matchedUser;
    const userContestRanking = data.data.userContestRanking;
    const recentSubmissions = data.data.recentAcSubmissionList;

    const platformData: LeetcodePlatformData = {
      name: "LeetCode",
      icon: "🧠",
      stats: {
        rating: userContestRanking?.rating || null,
        solved: matchedUser.submitStatsGlobal?.acSubmissionNum
          ? matchedUser.submitStatsGlobal.acSubmissionNum.reduce(
              (acc: number, cur: { count: number }) => acc + (cur.count || 0),
              0
            )
          : null,
        rank: userContestRanking?.globalRanking || null,
        contests: userContestRanking?.attendedContestsCount || null,
      },
      recentSubmissions: recentSubmissions
        ? recentSubmissions.map((submission: any) => ({
            problem: submission.title,
            result: "Accepted", // You can modify this logic to determine the result if needed
            date: new Date(submission.timestamp * 1000)
              .toISOString()
              .split("T")[0],
          }))
        : [],
    };

    return NextResponse.json(platformData);
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}
