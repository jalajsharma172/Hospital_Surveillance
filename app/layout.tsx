import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import HomeLink from "@/components/home-link";
import { HeaderNav } from "@/components/header-nav";
import "./globals.css";
import "nprogress/nprogress.css";
import { NavigationEvents } from "@/components/navigation-events";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 1, minimum: 0.99, easing: "ease", speed: 1 });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Suraksha AI — Hospital Security Intelligence",
  description: "AI-powered hospital security platform. Detect patient aggression, staff misconduct, and safety violations in real-time.",
};

const geistSans = Geist({ display: "swap", subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <NavigationEvents />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">

              {/* ── Glassmorphism Navigation Bar ────────────────────────── */}
              <nav
                className="fixed top-0 left-0 right-0 z-[100] w-full flex justify-center h-16 border-b border-white/[0.06]"
                style={{
                  background: "rgba(9,9,11,0.85)",
                  backdropFilter: "blur(20px) saturate(160%)",
                  WebkitBackdropFilter: "blur(20px) saturate(160%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 4px 32px rgba(0,0,0,0.5)",
                }}
              >
                {/* Blue → Purple top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1.5px]"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.8) 30%, rgba(99,102,241,0.7) 60%, rgba(168,85,247,0.5) 80%, transparent 100%)",
                  }}
                />

                {/* Nav content */}
                <div className="w-full max-w-7xl flex justify-between items-center px-4 sm:px-8">
                  {/* Left: Logo + nav */}
                  <div className="flex items-center gap-4 sm:gap-8">
                    <HomeLink />
                    <div className="hidden sm:block w-px h-5 bg-white/10 flex-shrink-0" />
                    <HeaderNav />
                  </div>


                </div>
              </nav>

              {/* Page content */}
              <div className="w-full pt-16">{children}</div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
