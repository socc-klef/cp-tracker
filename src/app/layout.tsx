import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

// Load the JetBrains Mono font
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

// Metadata for the page
export const metadata = {
  title: "CP Tracker",
  description:
    "Track your competitive programming progress across multiple platforms",
};

// RootLayout Component
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={jetbrainsMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children || <h1>Fallback Content</h1>}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
