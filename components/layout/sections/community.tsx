"use client";
import DiscordIcon from "@/components/icons/discord-icon";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts/language-context";
import { toast } from "@/lib/utils/toast";

export const CommunitySection = () => {
  const { t } = useLanguage();

  const handleJoinCommunity = () => {
    toast.info(t('community.comingSoon'), { duration: 5000 });
  };

  return (
    <section id="community" className="py-8">
      <hr className="border-secondary" />
      <div className="container py-16">
        <div className="lg:w-[50%] mx-auto">
          <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl md:text-4xl font-bold flex flex-col items-center gap-4">
                <DiscordIcon />
                <div>
                  {t('community.title')}
                  <span className="text-transparent bg-gradient-to-r from-[#E879F9] to-primary bg-clip-text">
                    {t('community.titleHighlight')}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="lg:w-[90%] text-lg text-muted-foreground pb-4">
              {t('community.description')}
              <div className="mt-4 space-y-1 text-base">
                <div>• {t('community.features.shareSuccess')}</div>
                <div>• {t('community.features.getInspiration')}</div>
                <div>• {t('community.features.consultAdvice')}</div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Button 
                className="px-8"
                onClick={handleJoinCommunity}
              >
                {t('community.joinButton')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className="border-secondary" />
    </section>
  );
};
