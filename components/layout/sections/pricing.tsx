import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  currency: string;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const plans: PlanProps[] = [
  {
    title: "免费版",
    popular: 0,
    price: 0,
    currency: "¥",
    description:
      "体验基础派对策划功能，适合偶尔举办生日派对的用户。",
    buttonText: "免费开始",
    benefitList: [
      "每天生成3次派对方案",
      "数据保存最多7天",
      "不支持导出功能",
      "生成简单策划方案",
    ],
  },
  {
    title: "高级版",
    popular: 1,
    price: 9.9,
    currency: "$",
    description:
      "解锁全部功能，享受无限制的个性化派对策划体验。",
    buttonText: "立即升级",
    benefitList: [
      "无限生成派对方案",
      "数据永久保存",
      "支持导出功能",
      "详细定制化方案",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        定价方案
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        选择适合您的派对策划方案
      </h2>

      <h3 className="md:w-2/3 mx-auto text-xl text-center text-muted-foreground pb-14">
        从免费体验到专业定制，让每一个生日派对都充满创意和惊喜
      </h3>

      <div className="flex justify-center">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl w-full">
          {plans.map(
            ({ title, popular, price, currency, description, buttonText, benefitList }) => (
              <Card
                key={title}
                className={`${
                  popular === PopularPlan?.YES
                    ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary scale-105 relative"
                    : "border-border"
                } transition-all duration-300 hover:shadow-lg h-full flex flex-col`}
              >
                {popular === PopularPlan?.YES && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      推荐选择
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold mb-3">{title}</CardTitle>

                  <div className="mb-4">
                    <span className="text-4xl font-bold">{currency}{price}</span>
                    <span className="text-muted-foreground text-lg"> /月</span>
                  </div>

                  <CardDescription className="text-base leading-relaxed px-2">
                    {description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 flex-grow">
                  <div className="space-y-4">
                    {benefitList.map((benefit) => (
                      <div key={benefit} className="flex items-start">
                        <Check className="text-primary mr-3 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-sm leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-8 pb-6">
                  <Button
                    variant={
                      popular === PopularPlan?.YES ? "default" : "outline"
                    }
                    className="w-full py-3 text-base font-medium"
                    size="lg"
                  >
                    {buttonText}
                  </Button>
                </CardFooter>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
};
