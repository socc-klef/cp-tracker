"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";

const steps = [
  {
    title: "Add Usernames",
    description:
      "Start by adding your usernames for all supported platforms using the form below. This is mandatory before accessing other features.",
    icon: <UserCheck className="size-6 text-blue-500" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Verify Details",
    description:
      "Verify that all your entered usernames are correct. You can update them anytime, but they cannot be deleted.",
    icon: <CheckCircle2 className="size-6 text-green-500" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Explore",
    description:
      "Once verified, you can access the dashboard and other features to track your progress across platforms.",
    icon: <ArrowRight className="size-6 text-purple-500" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export function HowToUse() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem("cp-tracker-visited");
    if (!hasVisited) {
      setOpen(true);
      localStorage.setItem("cp-tracker-visited", "true");
    } else {
      setIsFirstVisit(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {!isFirstVisit && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 size-10 rounded-full shadow-lg border border-border bg-background/50 backdrop-blur-sm hover:bg-accent"
          onClick={() => setOpen(true)}
        >
          <HelpCircle className="size-5" />
          <span className="sr-only">How to use</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">How to Use Instructions</DialogTitle>
          <div className="space-y-8 py-4">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-background to-muted p-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
              <div className="relative">
                <div
                  className={`size-12 rounded-full ${steps[currentStep].bgColor} flex items-center justify-center mb-4`}
                >
                  {steps[currentStep].icon}
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Step {currentStep + 1}: {steps[currentStep].title}
                </h2>
                <p className="text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              </Button>
            </div>

            <div className="flex justify-center gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`size-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
