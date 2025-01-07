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
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const data = await res.json();

    const platformData: CodeforcesPlatformData = {
      name: "Codeforces",
      icon: "🏆",
      stats: {
        rating: data.result[0].rating,
        solved: data.result[0].solvedProblems || 0,
        rank: data.result[0].rank,
        contests: data.result[0].contests || 0,
      },
      recentSubmissions: [], // Add logic to fetch recent submissions if needed
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
