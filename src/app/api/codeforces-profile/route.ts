/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

type CodeforcesPlatformData = {
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
    // Fetch user information
    const userInfoRes = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const userInfoData = await userInfoRes.json();

    if (userInfoData.status !== "OK" || !userInfoData.result.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userHandle = userInfoData.result[0].handle;

    // Fetch recent submissions
    const submissionsRes = await fetch(
      `https://codeforces.com/api/user.status?handle=${userHandle}&from=1&count=1000`
    );
    const submissionsData = await submissionsRes.json();

    if (submissionsData.status !== "OK") {
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 }
      );
    }

    // Calculate solved problems
    const solvedProblems = new Set(
      submissionsData.result
        .filter((submission: any) => submission.verdict === "OK")
        .map(
          (submission: any) =>
            `${submission.problem.contestId}-${submission.problem.index}`
        )
    ).size;

    // Fetch contest participation data
    const contestsRes = await fetch(
      `https://codeforces.com/api/user.rating?handle=${userHandle}`
    );
    const contestsData = await contestsRes.json();

    if (contestsData.status !== "OK") {
      return NextResponse.json(
        { error: "Failed to fetch contests" },
        { status: 500 }
      );
    }

    const contestCount = contestsData.result.length;

    // Extract recent submissions data
    const recentSubmissions = submissionsData.result
      .slice(0, 10)
      .map((submission: any) => ({
        problem: `${submission.problem.contestId}-${submission.problem.index}: ${submission.problem.name}`,
        result: submission.verdict || "Unknown",
        date: new Date(submission.creationTimeSeconds * 1000).toISOString(),
      }));

    // Construct platform data
    const platformData: CodeforcesPlatformData = {
      name: "Codeforces",
      icon: "🏆",
      stats: {
        rating: userInfoData.result[0].rating,
        solved: solvedProblems,
        rank: userInfoData.result[0].rank,
        contests: contestCount,
      },
      recentSubmissions,
    };

    return NextResponse.json(platformData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch Codeforces data" },
      { status: 500 }
    );
  }
}
