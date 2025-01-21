import { NextRequest, NextResponse } from "next/server";

type ParticipationSummary = Array<{
  contestName: string;
  date: string;
  rating: number;
}>;

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
      `https://codeforces.com/api/user.rating?handle=${username}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();

    if (!data || data.status !== "OK" || !data.result) {
      return NextResponse.json(
        { error: "Invalid response from Codeforces API" },
        { status: 500 }
      );
    }

    // Extract the participation history
    const userContestHistory = data.result;

    // Filter the contests where the rating has changed
    const participationSummary: ParticipationSummary =
      userContestHistory.reduce(
        (acc: ParticipationSummary, contest: any, index: number) => {
          if (
            index === 0 ||
            contest.newRating !== userContestHistory[index - 1].newRating
          ) {
            acc.push({
              contestName: contest.contestName,
              date: new Date(contest.ratingUpdateTimeSeconds * 1000)
                .toISOString()
                .split("T")[0],
              rating: contest.newRating,
            });
          }
          return acc;
        },
        []
      );

    return NextResponse.json(participationSummary);
  } catch (error) {
    console.error("Error fetching participation summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch participation summary" },
      { status: 500 }
    );
  }
}
