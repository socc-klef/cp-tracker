"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

interface Submission {
  problem: string;
  result: string;
  date: string;
}

interface Platform {
  name: string;
  icon: string;
  stats: {
    rating: number;
    solved: number;
    rank: string | number;
    contests: number;
  };
  recentSubmissions: Submission[];
}

interface PlatformDetailsProps {
  platform: Platform;
  isExpanded: boolean;
  onClick: () => void;
}

export default function PlatformDetails({
  platform,
  isExpanded,
  onClick,
}: PlatformDetailsProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{platform.icon}</span>
            <span>{platform.name}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </CardTitle>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(platform.stats).map(([key, value]) => (
                    <div key={key} className="bg-muted p-4 rounded-lg">
                      <dt className="text-sm font-medium text-muted-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold">
                        {value || "N/A"}
                      </dd>
                    </div>
                  ))}
                </div>
                {platform.recentSubmissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Problem</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {platform.recentSubmissions.map((submission, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {submission.problem}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  submission.result.toLowerCase() ===
                                    "accepted" ||
                                  submission.result.toLowerCase() === "ok"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {submission.result}
                              </span>
                            </TableCell>
                            <TableCell>{submission.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No recent submissions available.
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
