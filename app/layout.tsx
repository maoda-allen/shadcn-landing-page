"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider, useLanguage } from "@/lib/contexts/language-context";
import { Loader2 } from "lucide-react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-TYW6BEQR0Z';

// 内部包装组件，用于检查加载状态
function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-1">Birthday Party Planner</h3>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Birthday Party Planner - Professional Planning Tool</title>
        <meta name="description" content="Professional birthday party planning tool to help you easily plan the perfect birthday celebration." />
      </head>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppContent>
              {children}
            </AppContent>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
