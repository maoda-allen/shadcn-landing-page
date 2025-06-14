"use client";

import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import { useLanguage } from "@/lib/contexts/language-context";

interface BenefitsProps {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    titleKey: "benefits.personalized.title",
    descriptionKey: "benefits.personalized.description",
  },
  {
    icon: "LineChart",
    titleKey: "benefits.professional.title",
    descriptionKey: "benefits.professional.description",
  },
  {
    icon: "Wallet",
    titleKey: "benefits.budget.title",
    descriptionKey: "benefits.budget.description",
  },
  {
    icon: "Sparkle",
    titleKey: "benefits.creative.title",
    descriptionKey: "benefits.creative.description",
  },
];

export const BenefitsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          {t('benefits.subtitle')}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          {t('benefits.title')}
        </h2>

        <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
          {t('benefits.description')}
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefitList.map(({ icon, titleKey, descriptionKey }) => (
          <div key={titleKey}>
            <div className="mb-6 text-center">
              <Icon
                name={icon as keyof typeof icons}
                size={32}
                color="hsl(var(--primary))"
                className="mx-auto"
              />
            </div>

            <h3 className="text-lg font-bold mb-2">{t(titleKey)}</h3>
            <p className="text-muted-foreground text-sm">
              {t(descriptionKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
