"use client";

import { PartyProvider } from '@/lib/contexts/party-context';
import { PartyPlannerForm } from '@/components/party/party-planner-form';
import { PartyResultDisplay } from '@/components/party/party-result-display';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Users } from 'lucide-react';

export default function BirthdayPartyPlannerPage() {
  return (
    <PartyProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="container py-8 md:py-12">
          <div className="text-center space-y-4 md:space-y-6">
            <div className="flex justify-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI智能策划
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                3分钟完成
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                个性化定制
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              生日派对创意策划工具
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              几分钟内获得专属的生日派对创意方案，让每个生日都成为难忘的回忆
            </p>
            <div className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                左侧完成6步选择
              </span>
              <span className="mx-3">→</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                右侧查看专属方案
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container pb-16 md:pb-24">
          <div className="grid lg:grid-cols-7 gap-6 lg:gap-8">
            {/* Form Section - 缩小 */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="lg:sticky lg:top-8">
                <PartyPlannerForm />
              </div>
            </div>
            
            {/* Result Section - 放大 */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <PartyResultDisplay />
            </div>
          </div>
        </section>
      </div>
    </PartyProvider>
  );
} 