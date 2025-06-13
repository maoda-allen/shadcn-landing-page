import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    title: "个性化定制",
    description:
      "根据生日主角的年龄、喜好和需求，量身定制专属的派对方案，确保每个细节都完美契合。",
  },
  {
    icon: "LineChart",
    title: "专业策划团队",
    description:
      "拥有丰富经验的派对策划师，从创意构思到执行落地，全程提供专业指导和建议。",
  },
  {
    icon: "Wallet",
    title: "预算灵活控制",
    description:
      "提供多种预算方案选择，从经济实惠到豪华定制，满足不同家庭的消费需求。",
  },
  {
    icon: "Sparkle",
    title: "创意无限",
    description:
      "丰富的主题库和创意点子，从经典传统到时尚前卫，总有一款适合您的派对风格。",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">优势特色</h2>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            为什么选择我们的生日派对策划服务
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            我们致力于为每一位客户打造独一无二的生日庆典，让美好回忆永远珍藏。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
