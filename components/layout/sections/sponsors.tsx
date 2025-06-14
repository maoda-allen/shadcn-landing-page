"use client";

import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { useLanguage } from "@/lib/contexts/language-context";

interface sponsorsProps {
  icon: string;
  nameKey: string;
}

const sponsors: sponsorsProps[] = [
  {
    icon: "Crown",
    nameKey: "sponsors.partners.crown",
  },
  {
    icon: "Gift",
    nameKey: "sponsors.partners.gift",
  },
  {
    icon: "Cake",
    nameKey: "sponsors.partners.cake",
  },
  {
    icon: "Music",
    nameKey: "sponsors.partners.music",
  },
  {
    icon: "Camera",
    nameKey: "sponsors.partners.camera",
  },
  {
    icon: "Sparkles",
    nameKey: "sponsors.partners.sparkles",
  },
  {
    icon: "Utensils",
    nameKey: "sponsors.partners.utensils",
  },
];

export const SponsorsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-xl text-center mb-6">
        {t('sponsors.title')}
      </h2>

      <div className="mx-auto">
        <Marquee
          className="gap-[3rem]"
          fade
          innerClassName="gap-[3rem]"
          pauseOnHover
        >
          {sponsors.map(({ icon, nameKey }) => (
            <div
              key={nameKey}
              className="flex items-center text-xl md:text-2xl font-medium"
            >
              <Icon
                name={icon as keyof typeof icons}
                size={32}
                color="currentColor"
                className="mr-2"
              />
              {t(nameKey)}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
