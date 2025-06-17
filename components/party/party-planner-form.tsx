"use client";

import { useParty } from '@/lib/contexts/party-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Loader2, Sparkles, CheckCircle2, ArrowRight, Users, Baby, Heart } from 'lucide-react';

export function PartyPlannerForm() {
  const { state, updateFormData, generatePartyPlan } = useParty();
  const { t, language, isLoading: languageLoading } = useLanguage();
  
  // 将customTheme状态完全本地化，不触发重新渲染
  const [customTheme, setCustomTheme] = useState('');
  const [showCustomTheme, setShowCustomTheme] = useState(false);
  
  // 添加自定义主题标识
  const [isCustomThemeActive, setIsCustomThemeActive] = useState(false);
  
  // 添加输入框引用来保持焦点和位置
  const customThemeInputRef = useRef<HTMLInputElement>(null);
  const customThemeContainerRef = useRef<HTMLDivElement>(null);

  // 本地状态来强制重新渲染
  const [localLoading, setLocalLoading] = useState(false);

  // 使用ref来存储稳定的翻译内容，避免每次输入都重新计算
  const stableTranslations = useRef<any>({});
  const lastLanguage = useRef(language);

  // 只在语言切换时更新翻译内容
  useEffect(() => {
    if (language !== lastLanguage.current || !stableTranslations.current.initialized) {
      stableTranslations.current = {
        initialized: true,
        // 自定义主题相关 - 只储存这些，其他直接用t()
        customTheme: {
          label: t('planner.form.theme.customThemeLabel'),
          placeholder: t('planner.form.theme.customThemePlaceholder'),
          help: t('planner.form.theme.customThemeHelp'),
          title: t('planner.form.theme.customTheme'),
          desc: t('planner.form.theme.customThemeDesc'),
          editHint: t('planner.form.theme.customThemeEditHint'),
        },
        // 按钮文本
        confirmText: language === 'zh' ? '确认' : 'Confirm',
        cancelText: language === 'zh' ? '取消' : 'Cancel',
      };
      lastLanguage.current = language;
    }
  }, [language, t]);

  // 直接获取翻译文本的辅助函数，避免依赖stableTranslations
  const getCustomThemeText = useCallback((key: string) => {
    switch(key) {
      case 'title':
        return t('planner.form.theme.customTheme') || '自定义主题';
      case 'desc':
        return t('planner.form.theme.customThemeDesc') || '输入您自己的创意主题';
      case 'editHint':
        return t('planner.form.theme.customThemeEditHint') || '点击编辑您的自定义主题';
      case 'label':
        return t('planner.form.theme.customThemeLabel') || '您的创意主题';
      case 'placeholder':
        return t('planner.form.theme.customThemePlaceholder') || '例如：80年代复古、赛博朋克...';
      case 'help':
        return t('planner.form.theme.customThemeHelp') || 'AI将根据您的主题生成创意方案';
      case 'confirmText':
        return language === 'zh' ? '确认' : 'Confirm';
      case 'cancelText':
        return language === 'zh' ? '取消' : 'Cancel';
      default:
        return '';
    }
  }, [t, language]);

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

  // 生成按钮点击处理
  const handleGenerateClick = async () => {
    if (!isFormComplete()) {
      return;
    }
    
    if (isCurrentlyLoading) {
      return;
    }
    
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

  const handleThemeSelect = (themeId: string) => {
    const themeName = t(`planner.form.theme.${themeId}.title`);
    updateFormData({ theme: themeName });
    setShowCustomTheme(false);
    setIsCustomThemeActive(false); // 选择固定主题时，取消自定义主题状态
  };

  // 完全重写自定义主题处理，使用纯本地状态避免重新渲染
  const handleCustomThemeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 阻止事件冒泡，防止触发页面滚动
    e.stopPropagation();
    
    // 只更新本地状态，不触发任何外部状态更新
    setCustomTheme(e.target.value);
  }, []);

  const handleCustomThemeSubmit = useCallback(() => {
    if (customTheme.trim()) {
      updateFormData({ theme: customTheme.trim() });
      setShowCustomTheme(false);
      setIsCustomThemeActive(true); // 设置自定义主题为激活状态
      setCustomTheme('');
    }
  }, [customTheme, updateFormData]);

  const handleCustomThemeCancel = useCallback(() => {
    setShowCustomTheme(false);
    setCustomTheme('');
  }, []);

  // 展开自定义主题输入时的处理
  const handleShowCustomTheme = useCallback(() => {
    setShowCustomTheme(true);
    
    // 延迟聚焦，使用更温和的方式防止滚动
    setTimeout(() => {
      if (customThemeInputRef.current) {
        // 临时添加防滚动样式
        document.body.style.overflow = 'hidden';
        
        // 聚焦但防止滚动
        customThemeInputRef.current.focus({ preventScroll: true });
        
        // 快速恢复body的滚动
        setTimeout(() => {
          document.body.style.overflow = '';
        }, 100);
      }
    }, 150);
  }, []);

  const handleAtmosphereSelect = (atmosphere: string) => {
    updateFormData({ atmosphere: atmosphere as any });
  };

  // 派对类型选项 - 简化为3个，移除对t的直接依赖并稳定化
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

  // 聚会规模选项，优化依赖
  const guestCounts = useMemo(() => {
    if (languageLoading) return [];
    return [
      { id: 'smallParty', label: t('planner.form.guestCount.smallParty'), desc: t('planner.form.guestCount.smallPartyDesc'), value: 'small' as const },
      { id: 'mediumParty', label: t('planner.form.guestCount.mediumParty'), desc: t('planner.form.guestCount.mediumPartyDesc'), value: 'medium' as const },
      { id: 'largeParty', label: t('planner.form.guestCount.largeParty'), desc: t('planner.form.guestCount.largePartyDesc'), value: 'large' as const },
    ];
  }, [t, languageLoading]);

  // 场地选项，优化依赖
  const venues = useMemo(() => {
    if (languageLoading) return [];
    return [
      { id: 'home', label: t('planner.form.venue.home'), desc: t('planner.form.venue.homeDesc'), value: 'home' as const },
      { id: 'outdoor', label: t('planner.form.venue.outdoor'), desc: t('planner.form.venue.outdoorDesc'), value: 'outdoor' as const },
      { id: 'restaurant', label: t('planner.form.venue.restaurant'), desc: t('planner.form.venue.restaurantDesc'), value: 'restaurant' as const },
      { id: 'hall', label: t('planner.form.venue.hall'), desc: t('planner.form.venue.hallDesc'), value: 'hall' as const },
    ];
  }, [t, languageLoading]);

  // 预算选项，优化依赖
  const budgets = useMemo(() => {
    if (languageLoading) return [];
    return [
      { id: 'budget', label: t('planner.form.budget.budget'), desc: t('planner.form.budget.budgetDesc'), value: 'budget' as const },
      { id: 'standard', label: t('planner.form.budget.standard'), desc: t('planner.form.budget.standardDesc'), value: 'standard' as const },
      { id: 'premium', label: t('planner.form.budget.premium'), desc: t('planner.form.budget.premiumDesc'), value: 'premium' as const },
    ];
  }, [t, languageLoading]);

  // 新的主题选项，优化依赖并使用稳定的键
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

  // 新的氛围选项，优化依赖
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

  // 渲染选择步骤组件 - 统一颜色风格
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
    <div className="party-planner-form space-y-3">
      {/* 页面标题 - 调整为与生成按钮一致的深色背景，文字改为白色 */}
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

      {/* 步骤1: 派对类型 - 调整字号和卡片尺寸与派对规模保持一致 */}
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

      {/* 步骤2: 聚会规模 - 优化文字排版 */}
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

      {/* 步骤3: 场地选择 - 2x2网格，优化文字排版 */}
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

      {/* 步骤4: 预算设置 - 优化文字排版 */}
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

      {/* 步骤5: 主题选择 - 2x3网格，优化文字排版和尺寸 */}
      <StepCard
        step={5}
        title={t('planner.form.theme.title')}
        subtitle={t('planner.form.theme.subtitle')}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme: any) => {
              // 修复选中逻辑：如果是自定义主题激活状态，固定选项都不选中
              const isSelected = !isCustomThemeActive && state.formData.theme === theme.title;
              
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

          {/* 自定义主题选项 - 彻底优化防止页面跳转 */}
          <div 
            ref={customThemeContainerRef}
            className={`custom-theme-container p-3 rounded-lg border border-dashed transition-all duration-200 ${
              showCustomTheme 
                ? 'border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10' 
                : isCustomThemeActive
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-300 hover:border-primary/50 bg-gradient-to-br from-gray-50 to-white hover:from-primary/5 hover:to-primary/10'
            }`}
            style={{
              // 防止布局跳动
              minHeight: showCustomTheme ? 'auto' : '80px',
              contain: 'layout' // CSS containment 防止布局抖动
            }}
          >
            {!showCustomTheme ? (
              <div 
                className="text-center cursor-pointer py-2"
                onClick={handleShowCustomTheme}
                style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  {isCustomThemeActive && <CheckCircle2 className="w-4 h-4 text-primary ml-2" />}
                </div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">
                  {isCustomThemeActive ? state.formData.theme : getCustomThemeText('title')}
                </h4>
                <p className="text-xs text-gray-500">
                  {isCustomThemeActive ? getCustomThemeText('editHint') : getCustomThemeText('desc')}
                </p>
              </div>
            ) : (
              <div className="space-y-3" style={{ minHeight: '120px' }}>
                <Label htmlFor="customTheme" className="text-sm font-medium text-gray-700">
                  {getCustomThemeText('label')}
                </Label>
                <Input
                  ref={customThemeInputRef}
                  id="customTheme"
                  value={customTheme}
                  onChange={handleCustomThemeChange}
                  placeholder={getCustomThemeText('placeholder')}
                  className="custom-theme-input text-sm h-8 border-gray-300 focus:border-primary"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    // 只阻止特定按键的默认行为，不阻止输入
                    if (e.key === 'Enter' && customTheme.trim()) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCustomThemeSubmit();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCustomThemeCancel();
                    }
                    // 对于其他按键，不做任何阻止，让输入正常进行
                  }}
                />
                <p className="text-xs text-gray-500">{getCustomThemeText('help')}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleCustomThemeSubmit} 
                    disabled={!customTheme.trim()}
                    className="h-7 text-sm bg-primary hover:bg-primary/90"
                  >
                    {getCustomThemeText('confirmText')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCustomThemeCancel}
                    className="h-7 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {getCustomThemeText('cancelText')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </StepCard>

      {/* 步骤6: 氛围选择 - 2x3网格，优化文字排版 */}
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

      {/* 生成按钮 - 简化设计 */}
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
  );
} 