"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useState, useEffect } from "react";

// Memoize NavLink component to prevent unnecessary re-renders
const NavLink = memo(
  ({
    href,
    current,
    children,
  }: {
    href: string;
    current: boolean;
    children: React.ReactNode;
  }) => {
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          current
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        {children}
      </Link>
    );
  }
);

const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // This runs only on the client side
  }, []);

  if (!mounted) {
    return null; // Or return loading skeletons
  }

  return (
    <nav className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              CP Tracker
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/" current={pathname === "/"}>
                Home
              </NavLink>
              <NavLink href="/dashboard" current={pathname === "/dashboard"}>
                Dashboard
              </NavLink>
              <NavLink href="/platforms" current={pathname === "/platforms"}>
                Platforms
              </NavLink>
              <NavLink href="/settings" current={pathname === "/settings"}>
                Settings
              </NavLink>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted &&
              (theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              ))}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
