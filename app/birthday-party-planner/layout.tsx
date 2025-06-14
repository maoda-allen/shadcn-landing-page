import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birthday Party Creative Planning Tool | 生日派对创意策划工具 - Personalized Party Plan Generator",
  description: "Professional birthday party planning tool providing creative plans for children's birthdays, adult birthdays, and elder birthdays. Get your exclusive birthday party planning suggestions in minutes, including theme selection, venue setup, activity arrangement, and more. 专业的生日派对策划工具，提供儿童生日、成人生日、长辈生日等多种创意方案。几分钟内获得专属的生日派对策划建议，包含主题选择、场地布置、活动安排等。",
  keywords: "birthday party ideas,生日派对创意,生日派对策划,birthday party planning,儿童生日派对,成人生日聚会,派对主题,生日活动,party planner",
  openGraph: {
    title: "Birthday Party Creative Planning Tool | 生日派对创意策划工具",
    description: "Get your exclusive birthday party creative plan in minutes and make every birthday an unforgettable memory. 几分钟内获得专属的生日派对创意方案，让每个生日都成为难忘的回忆",
    type: "website"
  }
};

export default function PartyPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 