import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "生日派对创意策划工具 - 个性化派对方案生成器",
  description: "专业的生日派对策划工具，提供儿童生日、成人生日、长辈生日等多种创意方案。几分钟内获得专属的生日派对策划建议，包含主题选择、场地布置、活动安排等。",
  keywords: "生日派对创意,生日派对策划,birthday party ideas,生日庆祝,派对主题,生日活动",
  openGraph: {
    title: "生日派对创意策划工具",
    description: "几分钟内获得专属的生日派对创意方案，让每个生日都成为难忘的回忆",
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