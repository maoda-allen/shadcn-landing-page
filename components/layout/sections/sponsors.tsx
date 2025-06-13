"use client";

import { Icon } from "@/components/ui/icon";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { icons } from "lucide-react";

interface sponsorsProps {
  icon: string;
  name: string;
}

const sponsors: sponsorsProps[] = [
  {
    icon: "Crown",
    name: "皇冠气球",
  },
  {
    icon: "Gift",
    name: "礼品之家",
  },
  {
    icon: "Cake",
    name: "甜蜜蛋糕",
  },
  {
    icon: "Music",
    name: "音响设备",
  },
  {
    icon: "Camera",
    name: "摄影工作室",
  },
  {
    icon: "Sparkles",
    name: "装饰专家",
  },
  {
    icon: "Utensils",
    name: "餐饮服务",
  },
];

export const SponsorsSection = () => {
  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-xl text-center mb-6">
        我们的合作伙伴
      </h2>

      <div className="mx-auto">
        <Marquee
          className="gap-[3rem]"
          fade
          innerClassName="gap-[3rem]"
          pauseOnHover
        >
          {sponsors.map(({ icon, name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium"
            >
              <Icon
                name={icon as keyof typeof icons}
                size={32}
                color="currentColor"
                className="mr-2"
              />
              {name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
