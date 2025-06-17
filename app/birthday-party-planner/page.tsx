"use client";

import { PartyProvider } from '@/lib/contexts/party-context';
import { PartyPlannerForm } from '@/components/party/party-planner-form';
import { PartyResultDisplay } from '@/components/party/party-result-display';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useState, useEffect } from 'react';

export default function BirthdayPartyPlannerPage() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 防止SSR/Client不匹配
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <PartyProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="container py-8 md:py-12">
          <div className="text-center space-y-4 md:space-y-6">
            <div className="flex justify-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {t('planner.aiPlanning')}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {t('planner.quickComplete')}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {t('planner.personalized')}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {t('planner.pageTitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('planner.pageDescription')}
            </p>
            <div className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {t('planner.stepGuide').split(' → ')[0]}
              </span>
              <span className="mx-3">→</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {t('planner.stepGuide').split(' → ')[1]}
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container pb-16 md:pb-24">
          <div className="grid lg:grid-cols-8 gap-6 lg:gap-8">
            {/* Form Section - reduced size */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="lg:sticky lg:top-8">
                <PartyPlannerForm />
              </div>
            </div>
            
            {/* Result Section - expanded size */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <PartyResultDisplay />
            </div>
          </div>
        </section>
      </div>
    </PartyProvider>
  );
} 