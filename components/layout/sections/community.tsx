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

export const CommunitySection = () => {
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
                  加入我们的
                  <span className="text-transparent bg-gradient-to-r from-[#E879F9] to-primary bg-clip-text">
                    创意社区
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="lg:w-[90%] text-lg text-muted-foreground pb-4">
              与千万家庭一起分享生日派对创意，获取专业策划建议
              <div className="mt-4 space-y-1 text-base">
                <div>• 分享派对成功案例</div>
                <div>• 获取创意灵感</div>
                <div>• 咨询专业建议</div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Button 
                className="px-8"
                onClick={() => {
                  alert('社区功能正在开发中，敬请期待！\n\n您可以通过邮箱 community@birthday-party.com 与我们交流派对创意。');
                }}
              >
                立即加入社区
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className="border-secondary" />
    </section>
  );
};
