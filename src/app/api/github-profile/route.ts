/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

type GitHubPlatformData = {
  name: string;
  icon: string;
  stats: {
    repositories: number;
    stars: number;
    followers: number;
    contributions: number;
  };
  recentActivity: Array<{
    type: string;
    repo: string;
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
    const [userRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/events`),
    ]);

    const user = await userRes.json();
    const events = await eventsRes.json();

    const platformData: GitHubPlatformData = {
      name: "GitHub",
      icon: "🐙",
      stats: {
        repositories: user.public_repos,
        stars: user.starred_url
          ? parseInt(user.starred_url.split("?")[1]?.split("=")[1]) || 0
          : 0,
        followers: user.followers,
        contributions: events.filter((event: any) => event.type === "PushEvent")
          .length,
      },
      recentActivity: events.slice(0, 3).map((event: any) => ({
        type: event.type,
        repo: event.repo.name,
        date: event.created_at,
      })),
    };

    return NextResponse.json(platformData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
