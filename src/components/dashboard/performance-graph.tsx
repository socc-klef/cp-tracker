"use client";

import React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PerformanceData {
  contestName: string;
  date: string;
  rating: number;
}

interface PerformanceGraphProps {
  title: string;
  data: PerformanceData[];
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-semibold">{data.contestName}</p>
        <p className="text-sm text-muted-foreground">{formatDate(data.date)}</p>
        <p className="text-sm font-medium">Rating: {data.rating.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const CustomDot: React.FC<any> = (props) => {
  const { cx, cy, payload } = props;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill="hsl(var(--primary))"
            stroke="hsl(var(--background))"
            strokeWidth={2}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{payload.contestName}</p>
          <p className="text-sm">{formatDate(payload.date)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({
  title,
  data,
}) => {
  const sortedData = React.useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [data]
  );

  const latestRating = sortedData[sortedData.length - 1]?.rating ?? 0;
  const initialRating = sortedData[0]?.rating ?? 0;
  const overallChange = latestRating - initialRating;
  const overallTrend = overallChange >= 0 ? "up" : "down";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Performance from {formatDate(sortedData[0]?.date)} to{" "}
          {formatDate(sortedData[sortedData.length - 1]?.date)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-muted-foreground text-xs"
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis className="text-muted-foreground text-xs" />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{
                  r: 8,
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--background))",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {latestRating.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">Current Rating</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={overallTrend === "up" ? "default" : "destructive"}>
            {overallTrend === "up" ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(overallChange).toFixed(2)}
          </Badge>
          <span className="text-sm text-muted-foreground">Overall change</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PerformanceGraph;
