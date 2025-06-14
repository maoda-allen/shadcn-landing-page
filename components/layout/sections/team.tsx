"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Instagram, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Gift, Cake } from "lucide-react";
import { useLanguage } from "@/lib/contexts/language-context";

interface PartyIdeaProps {
  imageUrl: string;
  themeKey: string;
  subtitleKey: string;
  tagKeys: string[];
  features: {
    nameKey: string;
    icon: "heart" | "star" | "gift" | "cake";
  }[];
}

export const TeamSection = () => {
  const { t } = useLanguage();

  const partyIdeasList: PartyIdeaProps[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1740&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.princess.title",
      subtitleKey: "partyIdeas.themes.princess.subtitle",
      tagKeys: ["partyIdeas.themes.princess.tags.0", "partyIdeas.themes.princess.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.princess.features.age", icon: "heart" },
        { nameKey: "partyIdeas.themes.princess.features.venue", icon: "star" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?q=80&w=1746&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.retro.title",
      subtitleKey: "partyIdeas.themes.retro.subtitle",
      tagKeys: ["partyIdeas.themes.retro.tags.0", "partyIdeas.themes.retro.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.retro.features.age", icon: "gift" },
        { nameKey: "partyIdeas.themes.retro.features.venue", icon: "cake" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1740&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.superhero.title",
      subtitleKey: "partyIdeas.themes.superhero.subtitle",
      tagKeys: ["partyIdeas.themes.superhero.tags.0", "partyIdeas.themes.superhero.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.superhero.features.age", icon: "star" },
        { nameKey: "partyIdeas.themes.superhero.features.venue", icon: "heart" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1740&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.garden.title",
      subtitleKey: "partyIdeas.themes.garden.subtitle",
      tagKeys: ["partyIdeas.themes.garden.tags.0", "partyIdeas.themes.garden.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.garden.features.age", icon: "gift" },
        { nameKey: "partyIdeas.themes.garden.features.venue", icon: "cake" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1740&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.music.title",
      subtitleKey: "partyIdeas.themes.music.subtitle",
      tagKeys: ["partyIdeas.themes.music.tags.0", "partyIdeas.themes.music.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.music.features.age", icon: "star" },
        { nameKey: "partyIdeas.themes.music.features.venue", icon: "heart" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1740&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.ocean.title",
      subtitleKey: "partyIdeas.themes.ocean.subtitle",
      tagKeys: ["partyIdeas.themes.ocean.tags.0", "partyIdeas.themes.ocean.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.ocean.features.age", icon: "gift" },
        { nameKey: "partyIdeas.themes.ocean.features.venue", icon: "cake" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1740&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.modern.title",
      subtitleKey: "partyIdeas.themes.modern.subtitle",
      tagKeys: ["partyIdeas.themes.modern.tags.0", "partyIdeas.themes.modern.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.modern.features.age", icon: "star" },
        { nameKey: "partyIdeas.themes.modern.features.venue", icon: "heart" },
      ],
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740&auto=format&fit=crop",
      themeKey: "partyIdeas.themes.forest.title",
      subtitleKey: "partyIdeas.themes.forest.subtitle",
      tagKeys: ["partyIdeas.themes.forest.tags.0", "partyIdeas.themes.forest.tags.1"],
      features: [
        { nameKey: "partyIdeas.themes.forest.features.age", icon: "gift" },
        { nameKey: "partyIdeas.themes.forest.features.venue", icon: "cake" },
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
    <section id="team" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          {t('partyIdeas.subtitle')}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          {t('partyIdeas.title')}
        </h2>

        <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
          {t('partyIdeas.description')}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {partyIdeasList.map((idea, index) => (
          <Card
            key={index}
            className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
          >
            <CardHeader className="mt-8 flex justify-center items-center pb-2">
              <img
                src={idea.imageUrl}
                alt={t(idea.themeKey)}
                className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
              />
              <CardTitle className="text-center">{t(idea.themeKey)}</CardTitle>
              <CardDescription className="text-primary">
                {t(idea.subtitleKey)}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-2">
              <div className="flex flex-wrap gap-1 justify-center mb-4">
                {idea.tagKeys.map((tagKey, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                    {t(tagKey)}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {idea.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getIcon(feature.icon)}
                    <span>{t(feature.nameKey)}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex">
                <Link
                  href="/birthday-party-planner"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <span className="sr-only">Github icon</span>
                  <Github size="20" />
                </Link>
                <Link
                  href="/birthday-party-planner"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <span className="sr-only">X icon</span>
                  <Linkedin size="20" />
                </Link>

                <Link
                  href="/birthday-party-planner"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  <span className="sr-only">Instagram icon</span>
                  <Instagram size="20" />
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
