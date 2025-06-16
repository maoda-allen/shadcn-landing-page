import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider, Language } from "@/lib/contexts/language-context";
import Script from "next/script";

// 导入翻译文件
import zhTranslations from '@/messages/zh.json';
import enTranslations from '@/messages/en.json';
import { Translations } from "@/lib/types/translations";

const inter = Inter({ subsets: ["latin"] });

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-TYW6BEQR0Z';

export default async function RootLayout({
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
          >
            <Navbar />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 