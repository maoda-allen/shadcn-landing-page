import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Users",
    title: "派对类型选择",
    description:
      "支持成人生日、儿童生日、长辈生日等多种类型，为不同年龄段提供专属的派对创意方案。",
  },
  {
    icon: "Calendar",
    title: "智能活动安排",
    description:
      "根据派对规模和时长，自动生成合理的活动时间安排，确保派对节奏紧凑有趣。",
  },
  {
    icon: "MapPin",
    title: "场地布置建议",
    description:
      "提供室内外场地的专业布置方案，包括装饰摆放、空间规划等详细指导。",
  },
  {
    icon: "Palette",
    title: "丰富主题选择",
    description:
      "从经典主题到创意主题，支持自定义主题设计，满足个性化派对需求。",
  },
  {
    icon: "Music",
    title: "氛围营造",
    description:
      "根据派对类型推荐合适的音乐、灯光和装饰，营造完美的生日庆祝氛围。",
  },
  {
    icon: "Utensils",
    title: "餐饮搭配",
    description:
      "提供生日蛋糕、小食、饮品等餐饮建议，根据人数和预算制定最佳方案。",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        功能特色
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        丰富的生日派对创意功能
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        从派对策划到执行，我们提供全方位的生日派对解决方案，让每个生日都成为美好回忆。
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--primary))"
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
