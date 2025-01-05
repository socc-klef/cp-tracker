"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Settings() {
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = (format: "CSV" | "PDF") => {
    // TODO: Implement actual export functionality
    toast({
      title: "Export Initiated",
      description: `Your data is being exported in ${format} format.`,
    });
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Label htmlFor="dark-mode">Dark Mode</Label>
          {mounted && (
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          )}
        </motion.div>
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </motion.div>
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold">Export Data</h2>
          <div className="flex space-x-4">
            <Button onClick={() => handleExport("CSV")}>Export as CSV</Button>
            <Button onClick={() => handleExport("PDF")}>Export as PDF</Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
