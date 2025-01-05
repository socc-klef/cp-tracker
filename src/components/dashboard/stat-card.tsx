"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Platform {
  name: string;
  icon: string;
  rating?: number;
  solved?: number;
  rank?: string;
  contributions?: number;
  repos?: number;
  followers?: number;
}

export default function StatCard({ platform }: { platform: Platform }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{platform.icon}</span>
          <span>{platform.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {Object.entries(platform).map(([key, value]) => {
            if (key !== "name" && key !== "icon") {
              return (
                <motion.div
                  key={key}
                  className="flex justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <dt>{key.charAt(0).toUpperCase() + key.slice(1)}:</dt>
                  <dd>{value}</dd>
                </motion.div>
              );
            }
            return null;
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
