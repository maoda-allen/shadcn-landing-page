import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
<<<<<<< HEAD
import { LanguageProvider, Language } from "@/lib/contexts/language-context";
import Script from "next/script";
=======
import { LanguageProvider, useLanguage } from "@/lib/contexts/language-context";
import { Loader2 } from "lucide-react";
>>>>>>> parent of 2961d35 (修复加载遮罩，添加统计代码)

// 导入翻译文件
import zhTranslations from '@/messages/zh.json';
import enTranslations from '@/messages/en.json';
import { Translations } from "@/lib/types/translations";

const inter = Inter({ subsets: ["latin"] });

<<<<<<< HEAD
// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-TYW6BEQR0Z';

export default async function RootLayout({
=======
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
>>>>>>> parent of 2961d35 (修复加载遮罩，添加统计代码)
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- 服务器端逻辑 ---
  // 在服务器端决定初始语言。这里我们暂时硬编码为 'zh'
  // 之后您可以根据需要从 headers, cookies, 或 URL 中动态获取
  const initialLanguage: Language = 'zh';
  const initialTranslations = initialLanguage === 'zh' ? zhTranslations : enTranslations;

  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <head>
        <title>Birthday Party Planner - Professional Planning Tool</title>
        <meta name="description" content="Professional birthday party planning tool to help you easily plan the perfect birthday celebration." />
      </head>
      <body className={cn("min-h-screen bg-background", inter.className)}>
<<<<<<< HEAD
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

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider
            initialLanguage={initialLanguage}
            initialTranslations={initialTranslations as any}
=======
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
>>>>>>> parent of 2961d35 (修复加载遮罩，添加统计代码)
          >
            <Navbar />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
