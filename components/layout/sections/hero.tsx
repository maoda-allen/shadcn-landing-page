"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/language-context";

export const HeroSection = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> {t('hero.badge')} </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              {language === 'zh' ? (
                <>
                  {t('hero.title')}
                  <span className="text-transparent px-2 bg-gradient-to-r from-[#E879F9] to-primary bg-clip-text">
                    {t('hero.titleHighlight')}
                  </span>
                  <br />
                  {t('hero.titleEnd')}
                </>
              ) : (
                <div className="space-y-2">
                  <div className="leading-tight">
                    {t('hero.title')}
                  </div>
                  <div className="leading-tight">
                    <span className="text-transparent bg-gradient-to-r from-[#E879F9] to-primary bg-clip-text">
                      {t('hero.titleHighlight')}
                    </span>
                  </div>
                  <div className="text-3xl md:text-5xl leading-tight mt-2">
                    {t('hero.titleEnd')}
                  </div>
                </div>
              )}
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {t('hero.description')}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Button asChild className="w-5/6 md:w-1/4 font-bold group/arrow">
              <Link href="/birthday-party-planner">
                {t('hero.startPlanning')}
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link href="#features">
                {t('hero.learnMore')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          
          <div className="w-full">
            <Image
              width={1200}
              height={800}
              className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center opacity-95"
              src="/demo2-img.jpg"
              alt={t('hero.imageAlt')}
              priority
              style={{
                maskImage: `
                  radial-gradient(ellipse 100% 100% at center, 
                    black 30%, 
                    rgba(0,0,0,0.8) 60%, 
                    rgba(0,0,0,0.4) 80%, 
                    transparent 100%
                  )
                `,
                WebkitMaskImage: `
                  radial-gradient(ellipse 100% 100% at center, 
                    black 30%, 
                    rgba(0,0,0,0.8) 60%, 
                    rgba(0,0,0,0.4) 80%, 
                    transparent 100%
                  )
                `
              }}
            />
            
            <div className="absolute bottom-0 left-0 w-full h-12 md:h-16 bg-gradient-to-t from-background/40 to-transparent rounded-b-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
