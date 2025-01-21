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
    const query = `
      query getContestParticipation($username: String!) {
        userContestRankingHistory(username: $username) {
          contest {
            title
            startTime
          }
          rating
        }
      }
    `;

    const variables = { username };

    const res = await fetch(`https://leetcode.com/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();

    if (!data || !data.data || !data.data.userContestRankingHistory) {
      return NextResponse.json(
        { error: "Invalid response from LeetCode API" },
        { status: 500 }
      );
    }

    // Extract the participation history
    const userContestHistory = data.data.userContestRankingHistory;

    // Filter the contests where the rating has changed
    const participationSummary: ParticipationSummary =
      userContestHistory.reduce(
        (acc: ParticipationSummary, contest: any, index: number) => {
          if (
            index === 0 ||
            contest.rating !== userContestHistory[index - 1].rating
          ) {
            acc.push({
              contestName: contest.contest.title,
              date: new Date(contest.contest.startTime * 1000)
                .toISOString()
                .split("T")[0],
              rating: contest.rating,
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
