/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

const CODECHEF_ENDPOINT = "<REPLACE WITH YOUR PROFILE SCRAPER URL (Flask App)>";

type CodeChefPlatformData = {
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
    const res = await fetch(
      `${CODECHEF_ENDPOINT}/get-cc-data?uname=${username}`
    );
    const data = await res.json();
    console.log(`Data from Codechef ${data}`);

    const platformData: CodeChefPlatformData = {
      name: "CodeChef",
      icon: "👨‍🍳",
      stats: {
        rating: data.current_rating,
        solved: data.total_problems_solved,
        rank: data.highest_rating.toString(),
        contests: data.contests.length,
      },
      recentSubmissions: data.contests.slice(0, 3).map((contest: any) => ({
        problem: contest.problems_solved[0],
        result: "Accepted",
        date: "N/A",
      })),
    };

    return NextResponse.json(platformData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch CodeChef data" },
      { status: 500 }
    );
  }
}
