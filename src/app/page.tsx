"use client";
import { useState } from "react";
import UsernameForm from "@/components/UsernameForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import StoredUsernames from "@/components/stored-usernames";
import { HowToUse } from "@/components/howToUse";

export default function Home() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleUpdate = () => {
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center mb-16 space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-mono font-bold mb-4 relative inline-block">
                Welcome to CP Tracker
                <span className="absolute -inset-3 bg-blue-500/10 blur-xl rounded-full" />
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track your competitive programming progress across multiple
                platforms
              </p>
            </div>
          </section>

          <Alert className="mb-8 border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 flex items-center">
            <div className="flex items-center">
              <AlertCircle className="size-4" />
            </div>
            <AlertDescription className="ml-2 text-yellow-500">
              Important: You must add and verify your usernames before accessing
              the dashboard and other features.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            <Card className="border border-blue-500/20 bg-card/30 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-mono font-semibold">
                    Username Management
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdate}
                    className="gap-2 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10"
                  >
                    <RefreshCw className="size-4" />
                    Refresh List
                  </Button>
                </div>
                <div className="space-y-6">
                  <UsernameForm onUpdate={handleUpdate} />
                  <StoredUsernames key={updateTrigger} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <HowToUse />
    </div>
  );
}
