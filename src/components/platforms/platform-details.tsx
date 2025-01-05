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

interface Platform {
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
    <Card className="cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{platform.icon}</span>
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(platform.stats).map(([key, value]) => (
                    <div key={key} className="bg-muted p-4 rounded-lg">
                      <dt className="text-sm font-medium text-muted-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold">{value}</dd>
                    </div>
                  ))}
                </div>
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
                        <TableCell>{submission.problem}</TableCell>
                        <TableCell>{submission.result}</TableCell>
                        <TableCell>{submission.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
