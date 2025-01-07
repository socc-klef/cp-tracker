"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Adjusted data for a below-average student profile
const data = [
  { date: "2023-01", value: 800 }, // Beginner rating
  { date: "2023-02", value: 820 }, // Small improvement
  { date: "2023-03", value: 850 }, // Steady progress
  { date: "2023-04", value: 830 }, // Slight drop in performance
  { date: "2023-05", value: 870 }, // Gradual recovery
  { date: "2023-06", value: 900 }, // Improvement over time
];

export default function PerformanceGraph({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00bcd4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
