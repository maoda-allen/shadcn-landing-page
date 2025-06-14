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
import { useLanguage } from "@/lib/contexts/language-context";

interface ReviewProps {
  image: string;
  nameKey: string;
  userNameKey: string;
  commentKey: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://github.com/shadcn.png",
    nameKey: "testimonials.reviews.zhang.name",
    userNameKey: "testimonials.reviews.zhang.role",
    commentKey: "testimonials.reviews.zhang.comment",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    nameKey: "testimonials.reviews.li.name",
    userNameKey: "testimonials.reviews.li.role",
    commentKey: "testimonials.reviews.li.comment",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    nameKey: "testimonials.reviews.wang.name",
    userNameKey: "testimonials.reviews.wang.role",
    commentKey: "testimonials.reviews.wang.comment",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    nameKey: "testimonials.reviews.chen.name",
    userNameKey: "testimonials.reviews.chen.role",
    commentKey: "testimonials.reviews.chen.comment",
    rating: 5,
  },
  {
    image: "https://github.com/shadcn.png",
    nameKey: "testimonials.reviews.liu.name",
    userNameKey: "testimonials.reviews.liu.role",
    commentKey: "testimonials.reviews.liu.comment",
    rating: 4,
  },
  {
    image: "https://github.com/shadcn.png",
    nameKey: "testimonials.reviews.mei.name",
    userNameKey: "testimonials.reviews.mei.role",
    commentKey: "testimonials.reviews.mei.comment",
    rating: 5,
  },
];

export const TestimonialSection = () => {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          {t('testimonials.subtitle')}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          {t('testimonials.title')}
        </h2>

        <h3 className="mx-auto text-xl text-center text-muted-foreground">
          {t('testimonials.description')}
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
              key={review.nameKey}
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
                  {`"${t(review.commentKey)}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src="https://avatars.githubusercontent.com/u/75042455?v=4"
                        alt="radix"
                      />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{t(review.nameKey)}</CardTitle>
                      <CardDescription>{t(review.userNameKey)}</CardDescription>
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
