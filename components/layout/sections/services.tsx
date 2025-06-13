import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "儿童生日派对",
    description:
      "专为3-12岁儿童设计的生日派对方案，包含卡通主题、游戏活动、安全考虑等专业建议。",
    pro: 1,
  },
  {
    title: "成人生日聚会",
    description:
      "适合18-50岁成人的生日庆祝方案，提供优雅、时尚、个性化的派对创意和活动安排。",
    pro: 1,
  },
  {
    title: "长辈生日庆典",
    description: "为50岁以上长辈精心策划的生日庆祝活动，注重温馨、舒适、有意义的庆祝方式。",
    pro: 1,
  },
  {
    title: "主题派对策划",
    description: "提供多种创意主题选择，从复古怀旧到现代时尚，满足不同年龄段和喜好的需求。",
    pro: 1,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        服务项目
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        多样化生日派对解决方案
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        我们为不同年龄段提供专业的生日派对策划服务，让每个生日都成为特别的回忆。
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              推荐
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
