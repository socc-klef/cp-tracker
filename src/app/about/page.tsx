import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Code, Github, Linkedin, Star } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          About CP Tracker
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Elevate your competitive programming journey with comprehensive
          progress tracking across multiple platforms
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg">
            <Link href="https://github.com/yourusername/cp-tracker">
              <Github className="mr-2 h-5 w-5" /> View on GitHub
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://www.linkedin.com/in/yourusername">
              <Linkedin className="mr-2 h-5 w-5" /> Developer's LinkedIn
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="text-2xl">What is CP Tracker?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              CP Tracker is your all-in-one solution for monitoring your
              competitive programming progress. By aggregating data from popular
              platforms like Codeforces, LeetCode, and CodeChef, it provides a
              unified and insightful view of your coding journey.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-950 dark:to-yellow-950">
          <CardHeader>
            <CardTitle className="text-2xl">Why Use CP Tracker?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              With CP Tracker, you can effortlessly monitor your performance,
              track rating changes, and analyze solving patterns. It helps you
              pinpoint areas for improvement and celebrate achievements across
              all platforms in one centralized location.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Code className="mr-2 text-blue-500" /> Multi-Platform Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Seamlessly track your progress on Codeforces, LeetCode,
                CodeChef, and GitHub all in one intuitive interface.
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Star className="mr-2 text-yellow-500" /> Comprehensive Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Get a holistic view of your ratings, solved problems, ranks, and
                contest participation across all supported platforms.
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Activity className="mr-2 text-green-500" /> Performance
                Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Dive deep into your performance over time with detailed,
                interactive graphs and insightful statistics.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
