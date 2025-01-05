import UsernameForm from "@/components/UsernameForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to CP Tracker</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Track your competitive programming progress across multiple platforms
        </p>
        <Link href="/dashboard">
          <Button size="lg">View Dashboard</Button>
        </Link>
      </section>
      <UsernameForm />
    </div>
  );
}
