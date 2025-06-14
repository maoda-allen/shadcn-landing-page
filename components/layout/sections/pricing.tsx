"use client";

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
import { useLanguage } from "@/lib/contexts/language-context";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  titleKey: string;
  popular: PopularPlan;
  price: number;
  currency: string;
  descriptionKey: string;
  buttonTextKey: string;
  benefitKeys: string[];
}

const plans: PlanProps[] = [
  {
    titleKey: "pricing.free.title",
    popular: 0,
    price: 0,
    currency: "¥",
    descriptionKey: "pricing.free.description",
    buttonTextKey: "pricing.free.buttonText",
    benefitKeys: [
      "pricing.free.benefits.dailyLimit",
      "pricing.free.benefits.dataRetention",
      "pricing.free.benefits.noExport",
      "pricing.free.benefits.basicPlan",
    ],
  },
  {
    titleKey: "pricing.premium.title",
    popular: 1,
    price: 9.9,
    currency: "$",
    descriptionKey: "pricing.premium.description",
    buttonTextKey: "pricing.premium.buttonText",
    benefitKeys: [
      "pricing.premium.benefits.unlimited",
      "pricing.premium.benefits.permanentStorage",
      "pricing.premium.benefits.exportSupport",
      "pricing.premium.benefits.detailedPlan",
    ],
  },
];

export const PricingSection = () => {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t('pricing.subtitle')}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t('pricing.title')}
      </h2>

      <h3 className="md:w-2/3 mx-auto text-xl text-center text-muted-foreground pb-14">
        {t('pricing.description')}
      </h3>

      <div className="flex justify-center">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl w-full">
          {plans.map(
            ({ titleKey, popular, price, currency, descriptionKey, buttonTextKey, benefitKeys }) => (
              <Card
                key={titleKey}
                className={`${
                  popular === PopularPlan?.YES
                    ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary scale-105 relative"
                    : "border-border"
                } transition-all duration-300 hover:shadow-lg h-full flex flex-col`}
              >
                {popular === PopularPlan?.YES && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      {t('pricing.recommended')}
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold mb-3">{t(titleKey)}</CardTitle>

                  <div className="mb-4">
                    <span className="text-4xl font-bold">{currency}{price}</span>
                    <span className="text-muted-foreground text-lg"> {t('pricing.perMonth')}</span>
                  </div>

                  <CardDescription className="text-base leading-relaxed px-2">
                    {t(descriptionKey)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 flex-grow">
                  <div className="space-y-4">
                    {benefitKeys.map((benefitKey) => (
                      <div key={benefitKey} className="flex items-start">
                        <Check className="text-primary mr-3 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-sm leading-relaxed">{t(benefitKey)}</span>
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
                    {t(buttonTextKey)}
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
