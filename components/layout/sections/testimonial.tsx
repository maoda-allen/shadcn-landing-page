"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "张小雨",
    userName: "宝妈",
    comment:
      "太棒了！用这个工具为我女儿策划了6岁生日派对，公主主题的建议非常详细，孩子们玩得特别开心。活动安排很合理，时间把控得很好。",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "李先生",
    userName: "上班族",
    comment:
      "为老婆策划30岁生日用的这个工具，复古主题的方案很有创意。餐饮和音乐的建议都很棒，朋友们都说这是他们参加过最棒的生日聚会！",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "王阿姨",
    userName: "退休教师",
    comment:
      "用来给老伴办70大寿，花园主题的方案特别温馨。茶话会的形式很适合我们这个年纪，装饰建议也很实用，花费不多但效果很好。",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "陈妈妈",
    userName: "家庭主妇",
    comment:
      "连续两年用这个工具策划孩子生日派对了，从超级英雄到海洋探险主题，每次都有惊喜。预算控制得很好，孩子特别喜欢。",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "刘经理",
    userName: "企业管理者",
    comment:
      "公司年会用了简约现代主题，虽然不是传统意义的生日派对，但这个工具的创意让我们的活动与众不同，同事们反响很好。",
    rating: 4,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "小美",
    userName: "大学生",
    comment:
      "给室友策划21岁生日，音乐派对主题超级棒！DJ音乐和霓虹灯光的建议让我们的宿舍变成了小型夜店，太有意思了！",
    rating: 5,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          用户评价
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          听听我们的用户怎么说
        </h2>

        <h3 className="mx-auto text-xl text-center text-muted-foreground">
          已有超过1000+家庭使用我们的工具成功策划了难忘的生日派对
        </h3>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                    <Star className="size-4 fill-primary text-primary" />
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src="https://avatars.githubusercontent.com/u/16860528"
                        alt="radix"
                      />
                      <AvatarFallback>
                        {review.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
