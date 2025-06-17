"use client";

import { useParty } from '@/lib/contexts/party-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Loader2, Sparkles, CheckCircle2, ArrowRight, Users, Baby, Heart } from 'lucide-react';

export function PartyPlannerForm() {
  const { state, updateFormData, generatePartyPlan } = useParty();
  const { t, language, isLoading: languageLoading } = useLanguage();
  
  // 主题展开状态
  const [showMoreThemes, setShowMoreThemes] = useState(false);
  
  // 本地状态来强制重新渲染
  const [localLoading, setLocalLoading] = useState(false);

  // 监控加载状态变化
  useEffect(() => {
    setLocalLoading(state.isLoading);
  }, [state.isLoading]);

  // 使用组合状态
  const isCurrentlyLoading = state.isLoading || localLoading;

  // 检查表单是否完整
  const isFormComplete = () => {
    const { partyType, guestCount, venue, budget, theme, atmosphere } = state.formData;
    return partyType && guestCount && venue && budget && theme && atmosphere;
  };

  // 生成按钮点击处理 - 简化版本
  const handleGenerateClick = async () => {
    if (!isFormComplete()) {
      return;
    }
    
    if (isCurrentlyLoading) {
      return;
    }

    // 直接生成，不显示确认对话框
    setLocalLoading(true);
    
    try {
      await generatePartyPlan();
    } catch (error) {
      console.error('生成派对方案失败:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  // 处理选择函数
  const handlePartyTypeSelect = (type: 'adult' | 'child' | 'elderly') => {
    updateFormData({ partyType: type });
  };

  const handleGuestCountSelect = (count: 'small' | 'medium' | 'large') => {
    updateFormData({ guestCount: count });
  };

  const handleVenueSelect = (venue: 'home' | 'outdoor' | 'restaurant' | 'hall') => {
    updateFormData({ venue });
  };

  const handleBudgetSelect = (budget: 'budget' | 'standard' | 'premium') => {
    updateFormData({ budget });
  };

  // 处理固定主题选择
  const handleThemeSelect = (themeId: string) => {
    const themeName = t(`planner.form.theme.${themeId}.title`);
    updateFormData({ theme: themeName });
  };

  const handleAtmosphereSelect = (atmosphere: string) => {
    updateFormData({ atmosphere: atmosphere as any });
  };

  // 派对类型选项
  const partyTypes = useMemo(() => {
    if (languageLoading) return [];
    return [
      { 
        id: 'kidsBirthday', 
        icon: Baby,
        title: t('planner.form.partyType.kidsBirthday'),
        subtitle: t('planner.form.partyType.kidsBirthdayDesc'),
        badges: [t('planner.form.partyType.badges.interactive'), t('planner.form.partyType.badges.colorful')],
        value: 'child' as const
      },
      { 
        id: 'adultBirthday', 
        icon: Users,
        title: t('planner.form.partyType.adultBirthday'),
        subtitle: t('planner.form.partyType.adultBirthdayDesc'),
        badges: [t('planner.form.partyType.badges.mature'), t('planner.form.partyType.badges.personalized')],
        value: 'adult' as const
      },
      { 
        id: 'seniorBirthday', 
        icon: Heart, 
        title: t('planner.form.partyType.seniorBirthday'),
        subtitle: t('planner.form.partyType.seniorBirthdayDesc'),
        badges: [t('planner.form.partyType.badges.warm'), t('planner.form.partyType.badges.meaningful')],
        value: 'elderly' as const
      }
    ];
  }, [t, languageLoading]);

  // 聚会规模选项
  const guestCounts = useMemo(() => {
    if (languageLoading) return [];
    return [
      { id: 'smallParty', label: t('planner.form.guestCount.smallParty'), desc: t('planner.form.guestCount.smallPartyDesc'), value: 'small' as const },
      { id: 'mediumParty', label: t('planner.form.guestCount.mediumParty'), desc: t('planner.form.guestCount.mediumPartyDesc'), value: 'medium' as const },
      { id: 'largeParty', label: t('planner.form.guestCount.largeParty'), desc: t('planner.form.guestCount.largePartyDesc'), value: 'large' as const },
    ];
  }, [t, languageLoading]);

  // 场地选项
  const venues = useMemo(() => {
    if (languageLoading) return [];
    return [
      { id: 'home', label: t('planner.form.venue.home'), desc: t('planner.form.venue.homeDesc'), value: 'home' as const },
      { id: 'outdoor', label: t('planner.form.venue.outdoor'), desc: t('planner.form.venue.outdoorDesc'), value: 'outdoor' as const },
      { id: 'restaurant', label: t('planner.form.venue.restaurant'), desc: t('planner.form.venue.restaurantDesc'), value: 'restaurant' as const },
      { id: 'hall', label: t('planner.form.venue.hall'), desc: t('planner.form.venue.hallDesc'), value: 'hall' as const },
    ];
  }, [t, languageLoading]);

  // 预算选项
  const budgets = useMemo(() => {
    if (languageLoading) return [];
    return [
      { id: 'budget', label: t('planner.form.budget.budget'), desc: t('planner.form.budget.budgetDesc'), value: 'budget' as const },
      { id: 'standard', label: t('planner.form.budget.standard'), desc: t('planner.form.budget.standardDesc'), value: 'standard' as const },
      { id: 'premium', label: t('planner.form.budget.premium'), desc: t('planner.form.budget.premiumDesc'), value: 'premium' as const },
    ];
  }, [t, languageLoading]);

  // 前6个主题（常显示）
  const themes = useMemo(() => {
    if (languageLoading) return [];
    return [
      { 
        id: 'vintage', 
        title: t('planner.form.theme.vintage.title'), 
        subtitle: t('planner.form.theme.vintage.subtitle'),
        badges: [t('planner.form.theme.vintage.badge1'), t('planner.form.theme.vintage.badge2')]
      },
      { 
        id: 'luxury', 
        title: t('planner.form.theme.luxury.title'), 
        subtitle: t('planner.form.theme.luxury.subtitle'),
        badges: [t('planner.form.theme.luxury.badge1'), t('planner.form.theme.luxury.badge2')]
      },
      { 
        id: 'modern', 
        title: t('planner.form.theme.modern.title'), 
        subtitle: t('planner.form.theme.modern.subtitle'),
        badges: [t('planner.form.theme.modern.badge1'), t('planner.form.theme.modern.badge2')]
      },
      { 
        id: 'cartoon', 
        title: t('planner.form.theme.cartoon.title'), 
        subtitle: t('planner.form.theme.cartoon.subtitle'),
        badges: [t('planner.form.theme.cartoon.badge1'), t('planner.form.theme.cartoon.badge2')]
      },
      { 
        id: 'adventure', 
        title: t('planner.form.theme.adventure.title'), 
        subtitle: t('planner.form.theme.adventure.subtitle'),
        badges: [t('planner.form.theme.adventure.badge1'), t('planner.form.theme.adventure.badge2')]
      },
      { 
        id: 'traditional', 
        title: t('planner.form.theme.traditional.title'), 
        subtitle: t('planner.form.theme.traditional.subtitle'),
        badges: [t('planner.form.theme.traditional.badge1'), t('planner.form.theme.traditional.badge2')]
      }
    ];
  }, [t, languageLoading]);

  // 后6个主题（折叠显示）
  const moreThemes = useMemo(() => {
    if (languageLoading) return [];
    return [
      { 
        id: 'superhero', 
        title: t('planner.form.theme.superhero.title'), 
        subtitle: t('planner.form.theme.superhero.subtitle'),
        badges: [t('planner.form.theme.superhero.badge1'), t('planner.form.theme.superhero.badge2')]
      },
      { 
        id: 'princess', 
        title: t('planner.form.theme.princess.title'), 
        subtitle: t('planner.form.theme.princess.subtitle'),
        badges: [t('planner.form.theme.princess.badge1'), t('planner.form.theme.princess.badge2')]
      },
      { 
        id: 'space', 
        title: t('planner.form.theme.space.title'), 
        subtitle: t('planner.form.theme.space.subtitle'),
        badges: [t('planner.form.theme.space.badge1'), t('planner.form.theme.space.badge2')]
      },
      { 
        id: 'ocean', 
        title: t('planner.form.theme.ocean.title'), 
        subtitle: t('planner.form.theme.ocean.subtitle'),
        badges: [t('planner.form.theme.ocean.badge1'), t('planner.form.theme.ocean.badge2')]
      },
      { 
        id: 'garden', 
        title: t('planner.form.theme.garden.title'), 
        subtitle: t('planner.form.theme.garden.subtitle'),
        badges: [t('planner.form.theme.garden.badge1'), t('planner.form.theme.garden.badge2')]
      },
      { 
        id: 'sports', 
        title: t('planner.form.theme.sports.title'), 
        subtitle: t('planner.form.theme.sports.subtitle'),
        badges: [t('planner.form.theme.sports.badge1'), t('planner.form.theme.sports.badge2')]
      }
    ];
  }, [t, languageLoading]);

  // 同步主题状态 - 如果选择的主题在更多主题中，自动展开
  useEffect(() => {
    const currentTheme = state.formData.theme || '';
    const isInMoreThemes = moreThemes.some(theme => theme.title === currentTheme);
    
    if (isInMoreThemes) {
      setShowMoreThemes(true);
    }
  }, [state.formData.theme, moreThemes]);

  // 氛围选项
  const atmospheres = useMemo(() => {
    if (languageLoading) return [];
    return [
      { id: 'quiet', label: t('planner.form.atmosphere.quiet'), desc: t('planner.form.atmosphere.quietDesc') },
      { id: 'celebration', label: t('planner.form.atmosphere.celebration'), desc: t('planner.form.atmosphere.celebrationDesc') },
      { id: 'intimate', label: t('planner.form.atmosphere.intimate'), desc: t('planner.form.atmosphere.intimateDesc') },
      { id: 'elegant', label: t('planner.form.atmosphere.elegant'), desc: t('planner.form.atmosphere.elegantDesc') },
      { id: 'joyful', label: t('planner.form.atmosphere.joyful'), desc: t('planner.form.atmosphere.joyfulDesc') },
      { id: 'warm', label: t('planner.form.atmosphere.warm'), desc: t('planner.form.atmosphere.warmDesc') },
    ];
  }, [t, languageLoading]);

  // 渲染选择步骤组件
  const StepCard = ({ step, title, subtitle, children, className = "" }: {
    step: number;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Card className={`mb-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold">
              {step}
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-gray-900">{title}</CardTitle>
            <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="party-planner-form space-y-3">
        {/* 页面标题 */}
        <Card className="bg-primary border border-primary shadow-sm">
          <CardHeader className="text-center py-4">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 text-white mr-2" />
              <CardTitle className="text-lg font-bold text-white">{t('planner.form.title')}</CardTitle>
              <Sparkles className="w-5 h-5 text-white ml-2" />
            </div>
            <p className="text-white/90 text-sm">{t('planner.form.subtitle')}</p>
          </CardHeader>
        </Card>

        {/* 步骤1: 派对类型 */}
        <StepCard
          step={1}
          title={t('planner.form.partyType.title')}
          subtitle={t('planner.form.partyType.subtitle')}
        >
          <div className="grid grid-cols-3 gap-3">
            {partyTypes.map((type: any) => {
              const IconComponent = type.icon;
              const isSelected = state.formData.partyType === type.value;
              
              return (
                <div
                  key={type.id}
                  className={`group p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePartyTypeSelect(type.value as any)}
                >
                  <div className="text-center space-y-2">
                    <div className={`p-2 rounded-full mx-auto w-fit transition-colors ${
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-gray-900">{type.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{type.subtitle}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary mx-auto" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </StepCard>

        {/* 步骤2: 聚会规模 */}
        <StepCard
          step={2}
          title={t('planner.form.guestCount.title')}
          subtitle={t('planner.form.guestCount.subtitle')}
        >
          <div className="grid grid-cols-3 gap-3">
            {guestCounts.map((count: any) => {
              const isSelected = state.formData.guestCount === count.value;
              
              return (
                <div
                  key={count.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                  onClick={() => handleGuestCountSelect(count.value as any)}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2 transition-colors ${
                    isSelected ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{count.label}</h4>
                  <p className="text-xs text-gray-500">{count.desc}</p>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary mx-auto mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </StepCard>

        {/* 步骤3: 场地选择 */}
        <StepCard
          step={3}
          title={t('planner.form.venue.title')}
          subtitle={t('planner.form.venue.subtitle')}
        >
          <div className="grid grid-cols-2 gap-3">
            {venues.map((venue: any) => {
              const isSelected = state.formData.venue === venue.value;
              
              return (
                <div
                  key={venue.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                  onClick={() => handleVenueSelect(venue.value as any)}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2 transition-colors ${
                    isSelected ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{venue.label}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{venue.desc}</p>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary mx-auto mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </StepCard>

        {/* 步骤4: 预算设置 */}
        <StepCard
          step={4}
          title={t('planner.form.budget.title')}
          subtitle={t('planner.form.budget.subtitle')}
        >
          <div className="grid grid-cols-3 gap-3">
            {budgets.map((budget: any) => {
              const isSelected = state.formData.budget === budget.value;
              
              return (
                <div
                  key={budget.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                  onClick={() => handleBudgetSelect(budget.value as any)}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2 transition-colors ${
                    isSelected ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{budget.label}</h4>
                  <p className="text-xs text-gray-500">{budget.desc}</p>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary mx-auto mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </StepCard>

        {/* 步骤5: 主题选择 */}
        <StepCard
          step={5}
          title={t('planner.form.theme.title')}
          subtitle={t('planner.form.theme.subtitle')}
        >
          <div className="space-y-3">
            {/* 前6个主题 - 常显示 */}
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme: any) => {
                const isSelected = state.formData.theme === theme.title;
                
                return (
                  <div
                    key={theme.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-primary' : 'bg-gray-300'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">{theme.title}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{theme.subtitle}</p>
                        <div className="flex gap-1 flex-wrap">
                          {theme.badges.map((badge: any, idx: number) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="text-xs px-1.5 py-0.5 h-auto bg-gray-100 text-gray-600"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 更多主题展开区域 */}
            {showMoreThemes && (
              <div className="grid grid-cols-2 gap-3">
                {moreThemes.map((theme: any) => {
                  const isSelected = state.formData.theme === theme.title;
                  
                  return (
                    <div
                      key={theme.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-primary' : 'bg-gray-300'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">{theme.title}</h4>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed">{theme.subtitle}</p>
                          <div className="flex gap-1 flex-wrap">
                            {theme.badges.map((badge: any, idx: number) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className="text-xs px-1.5 py-0.5 h-auto bg-gray-100 text-gray-600"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 更多主题按钮 */}
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMoreThemes(!showMoreThemes)}
                className="text-primary border-primary hover:bg-primary/5"
              >
                {showMoreThemes ? (
                  <>
                    <span>{t('planner.form.theme.lessThemes')}</span>
                    <svg className="w-4 h-4 ml-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>{t('planner.form.theme.moreThemes')}</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </div>
        </StepCard>

        {/* 步骤6: 氛围选择 */}
        <StepCard
          step={6}
          title={t('planner.form.atmosphere.title')}
          subtitle={t('planner.form.atmosphere.subtitle')}
        >
          <div className="grid grid-cols-2 gap-3">
            {atmospheres.map((atmosphere: any) => {
              const isSelected = state.formData.atmosphere === atmosphere.id;
              
              return (
                <div
                  key={atmosphere.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAtmosphereSelect(atmosphere.id)}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2 transition-colors ${
                    isSelected ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{atmosphere.label}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{atmosphere.desc}</p>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary mx-auto mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </StepCard>

        {/* 生成按钮 */}
        <div className="pt-4">
          <Button
            onClick={handleGenerateClick}
            disabled={!isFormComplete() || isCurrentlyLoading}
            size="lg"
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isCurrentlyLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('planner.form.generating')}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {state.result ? t('planner.form.regenerateButton') : t('planner.form.generateButton')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {isCurrentlyLoading && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-600">{t('planner.form.generatingDesc')}</p>
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 