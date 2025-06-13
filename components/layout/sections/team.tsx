import { Heart, Star, Gift, Cake } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface PartyIdeaProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  themes: string[];
  features: PartyFeatureProps[];
}

interface PartyFeatureProps {
  name: string;
  icon: "heart" | "star" | "gift" | "cake";
}

export const TeamSection = () => {
  const partyIdeasList: PartyIdeaProps[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1740&auto=format&fit=crop",
      title: "梦幻公主主题",
      subtitle: "儿童生日派对",
      themes: ["粉色装饰", "城堡布景"],
      features: [
        { name: "适合3-8岁", icon: "heart" },
        { name: "室内派对", icon: "star" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=1746&auto=format&fit=crop",
      title: "复古怀旧主题",
      subtitle: "成人生日聚会",
      themes: ["80年代风格", "怀旧音乐"],
      features: [
        { name: "适合25-45岁", icon: "gift" },
        { name: "室内外皆可", icon: "cake" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1740&auto=format&fit=crop",
      title: "超级英雄主题",
      subtitle: "儿童生日派对",
      themes: ["漫威角色", "动作游戏"],
      features: [
        { name: "适合5-12岁", icon: "star" },
        { name: "户外活动", icon: "heart" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop",
      title: "优雅花园主题",
      subtitle: "长辈生日庆典",
      themes: ["鲜花装饰", "茶话会"],
      features: [
        { name: "适合50岁以上", icon: "gift" },
        { name: "花园聚会", icon: "cake" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1740&auto=format&fit=crop",
      title: "音乐派对主题",
      subtitle: "青年生日聚会",
      themes: ["DJ音乐", "霓虹灯光"],
      features: [
        { name: "适合18-30岁", icon: "star" },
        { name: "夜间派对", icon: "heart" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1740&auto=format&fit=crop",
      title: "海洋探险主题",
      subtitle: "儿童生日派对",
      themes: ["海洋生物", "探险游戏"],
      features: [
        { name: "适合4-10岁", icon: "gift" },
        { name: "室内布景", icon: "cake" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1740&auto=format&fit=crop",
      title: "简约现代主题",
      subtitle: "成人生日聚会",
      themes: ["极简风格", "精致餐饮"],
      features: [
        { name: "适合30-50岁", icon: "star" },
        { name: "高端场所", icon: "heart" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740&auto=format&fit=crop",
      title: "童话森林主题",
      subtitle: "儿童生日派对",
      themes: ["森林动物", "自然装饰"],
      features: [
        { name: "适合3-9岁", icon: "gift" },
        { name: "户外森林", icon: "cake" },
      ],
    },
  ];

  const getIcon = (iconName: "heart" | "star" | "gift" | "cake") => {
    switch (iconName) {
      case "heart":
        return <Heart className="w-4 h-4" />;
      case "star":
        return <Star className="w-4 h-4" />;
      case "gift":
        return <Gift className="w-4 h-4" />;
      case "cake":
        return <Cake className="w-4 h-4" />;
    }
  };

  return (
    <section id="party-ideas" className="container lg:w-[75%] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          创意灵感
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          精选生日派对创意案例
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {partyIdeasList.map(
          (
            { imageUrl, title, subtitle, themes, features },
            index
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${title} - ${subtitle}`}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6">
                  {title}
                  <span className="text-primary ml-2 text-sm font-normal">{subtitle}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pb-0 px-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {themes.map((theme, themeIndex) => (
                    <Badge key={themeIndex} variant="secondary" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 mt-auto px-6">
                {features.map(({ name, icon }, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center gap-1 text-sm text-muted-foreground"
                  >
                    {getIcon(icon)}
                    <span>{name}</span>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
