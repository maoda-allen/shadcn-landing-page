"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/contexts/language-context";

enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  titleKey: string;
  pro: ProService;
  descriptionKey: string;
}
const serviceList: ServiceProps[] = [
  {
    titleKey: "services.children.title",
    descriptionKey: "services.children.description",
    pro: 1,
  },
  {
    titleKey: "services.adult.title",
    descriptionKey: "services.adult.description",
    pro: 1,
  },
  {
    titleKey: "services.elderly.title",
    descriptionKey: "services.elderly.description",
    pro: 1,
  },
  {
    titleKey: "services.theme.title",
    descriptionKey: "services.theme.description",
    pro: 1,
  },
];

export const ServicesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t('services.subtitle')}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t('services.title')}
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        {t('services.description')}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ titleKey, descriptionKey, pro }) => (
          <Card
            key={titleKey}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{t(titleKey)}</CardTitle>
              <CardDescription>{t(descriptionKey)}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              {t('services.recommended')}
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
