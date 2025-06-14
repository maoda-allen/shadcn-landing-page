"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import { useLanguage } from "@/lib/contexts/language-context";

interface FeaturesProps {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Users",
    titleKey: "features.partyTypes.title",
    descriptionKey: "features.partyTypes.description",
  },
  {
    icon: "Calendar",
    titleKey: "features.smartPlanning.title",
    descriptionKey: "features.smartPlanning.description",
  },
  {
    icon: "MapPin",
    titleKey: "features.venueSetup.title",
    descriptionKey: "features.venueSetup.description",
  },
  {
    icon: "Palette",
    titleKey: "features.themes.title",
    descriptionKey: "features.themes.description",
  },
  {
    icon: "Music",
    titleKey: "features.atmosphere.title",
    descriptionKey: "features.atmosphere.description",
  },
  {
    icon: "Utensils",
    titleKey: "features.catering.title",
    descriptionKey: "features.catering.description",
  },
];

export const FeaturesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t('features.subtitle')}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t('features.title')}
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        {t('features.description')}
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, titleKey, descriptionKey }) => (
          <div key={titleKey}>
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

                <CardTitle>{t(titleKey)}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {t(descriptionKey)}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
