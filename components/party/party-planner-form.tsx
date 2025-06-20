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
import { Loader2, Sparkles, CheckCircle2, ArrowRight, Users, Baby, Heart, User, UserCheck, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { DYNAMIC_TAGS, DynamicTag } from '@/lib/types/party';

export function PartyPlannerForm() {
  const { state, updateFormData, generatePartyPlan } = useParty();
  const { t, language, isLoading: languageLoading } = useLanguage();
  
  // 主题展开状态
  const [showMoreThemes, setShowMoreThemes] = useState(false);
  
  // 本地状态来强制重新渲染
  const [localLoading, setLocalLoading] = useState(false);

  // 手机端提示状态
  const [mobileTooltip, setMobileTooltip] = useState<{ tagId: string; content: string; visible: boolean } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // 长按检测函数
  const handleTouchStart = useCallback((tag: DynamicTag) => {
    if (!isMobile) return;
    
    longPressTimer.current = setTimeout(() => {
      // 触发震动反馈（如果支持）
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      setMobileTooltip({
        tagId: tag.id,
        content: `${tag.label} - ${tag.description}`,
        visible: true
      });
    }, 500); // 500ms长按触发
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchCancel = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // 隐藏移动端提示
  const hideMobileTooltip = useCallback(() => {
    setMobileTooltip(null);
  }, []);

  // 监控加载状态变化
  useEffect(() => {
    setLocalLoading(state.isLoading);
  }, [state.isLoading]);

  // 使用组合状态
  const isCurrentlyLoading = state.isLoading || localLoading;

  // 检查表单是否完整
  const isFormComplete = () => {
    const { ageGroup, gender, guestCount, venue, budget, theme, atmosphere } = state.formData;
    return ageGroup && gender && guestCount && venue && budget && theme && atmosphere;
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
  const handleAgeGroupSelect = (ageGroup: '0-3' | '4-17' | '18-59' | '60+') => {
    // 选择年龄段时，重置性别和动态标签
    updateFormData({ 
      ageGroup, 
      gender: '', 
      dynamicTags: [],
      // 根据年龄段自动设置partyType
      partyType: ageGroup === '0-3' || ageGroup === '4-17' ? 'child' : ageGroup === '18-59' ? 'adult' : 'elderly'
    });
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'other') => {
    // 选择性别时，重置动态标签
    updateFormData({ gender, dynamicTags: [] });
  };

  const handleDynamicTagToggle = (tagId: string) => {
    const currentTags = state.formData.dynamicTags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    updateFormData({ dynamicTags: newTags });
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

  // 年龄段选项
  const ageGroups = useMemo(() => {
    if (languageLoading) return [];
    return [
      { 
        id: '0-3', 
        icon: Baby,
        title: language === 'zh' ? '宝宝生日' : 'Baby Birthday',
        subtitle: language === 'zh' ? '0-3岁，初次体验' : '0-3 years, first experiences',
        value: '0-3' as const
      },
      { 
        id: '4-17', 
        icon: Users,
        title: language === 'zh' ? '青少年生日' : 'Teen Birthday',
        subtitle: language === 'zh' ? '4-17岁，成长里程碑' : '4-17 years, growing milestones',
        value: '4-17' as const
      },
      { 
        id: '18-59', 
        icon: User,
        title: language === 'zh' ? '成人生日' : 'Adult Birthday',
        subtitle: language === 'zh' ? '18-59岁，人生庆典' : '18-59 years, life celebrations',
        value: '18-59' as const
      },
      { 
        id: '60+', 
        icon: Heart,
        title: language === 'zh' ? '长辈生日' : 'Senior Birthday',
        subtitle: language === 'zh' ? '60岁及以上，智慧传承' : '60+ years, wisdom legacy',
        value: '60+' as const
      }
    ];
  }, [language, languageLoading]);

  // 性别选项
  const genderOptions = useMemo(() => {
    if (languageLoading) return [];
    return [
      { 
        id: 'male', 
        label: language === 'zh' ? '男性' : 'Male',
        value: 'male' as const
      },
      { 
        id: 'female', 
        label: language === 'zh' ? '女性' : 'Female',
        value: 'female' as const
      },
      { 
        id: 'other', 
        label: language === 'zh' ? '其他' : 'Other',
        value: 'other' as const
      }
    ];
  }, [language, languageLoading]);

  // 获取当前年龄段的动态标签
  const currentDynamicTags = useMemo(() => {
    if (!state.formData.ageGroup) return [];
    
    const tags = DYNAMIC_TAGS[state.formData.ageGroup] || [];
    
    // 如果已选择性别，则过滤标签；如果未选择性别，则显示所有标签
    if (state.formData.gender) {
      return tags.filter(tag => 
        tag.gender === 'all' || 
        tag.gender === state.formData.gender ||
        (tag.gender === 'female' && state.formData.gender === 'other') // 包容性处理
      );
    } else {
      // 未选择性别时，显示所有标签
      return tags;
    }
  }, [state.formData.ageGroup, state.formData.gender]);

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

        {/* 步骤1: 派对类型 - 一步到位设计 */}
        <StepCard
          step={1}
          title={t('planner.form.partyType.title')}
          subtitle={t('planner.form.partyType.subtitle')}
        >
          <div className="space-y-5">
            {/* 年龄段选择 */}
            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map((type: any) => {
                const IconComponent = type.icon;
                const isSelected = state.formData.ageGroup === type.value;
                
                return (
                  <div
                    key={type.id}
                    className={`group relative rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-gray-200 hover:border-primary/30 hover:shadow-md'
                    }`}
                    onClick={() => handleAgeGroupSelect(type.value as any)}
                  >
                    <div className="p-4 text-center space-y-2">
                      <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">{type.title}</h3>
                        <p className="text-xs text-gray-500">{type.subtitle}</p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 同时展示：性别选择 + 动态标签 */}
            {state.formData.ageGroup && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                
                {/* 性别选择 - 横向紧凑布局 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {language === 'zh' ? '性别' : 'Gender'}
                    </span>
                    <div className="px-2 py-0.5 bg-orange-100 rounded text-xs text-orange-700 font-medium">
                      {language === 'zh' ? '影响大' : 'High Impact'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {genderOptions.map((gender: any) => {
                      const isSelected = state.formData.gender === gender.value;
                      
                      return (
                        <button
                          key={gender.id}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-sm border transition-all duration-200 ${
                            isSelected 
                              ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-medium'
                              : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-25'
                          }`}
                          onClick={() => handleGenderSelect(gender.value as any)}
                        >
                          {gender.label}
                          {isSelected && <CheckCircle2 className="w-3 h-3 inline ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 动态标签 - 极简标签云 */}
                {currentDynamicTags.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {language === 'zh' ? '特殊里程碑' : 'Special Milestones'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {language === 'zh' ? '(可选)' : '(Optional)'}
                        </span>
                      </div>
                      
                      {state.formData.dynamicTags && state.formData.dynamicTags.length > 0 && (
                        <span className="text-xs text-purple-600 font-medium">
                          {state.formData.dynamicTags.length} {language === 'zh' ? '已选' : 'selected'}
                        </span>
                      )}
                    </div>
                    
                    {/* 极简标签云 - 最小化空间占用 */}
                    <div className="flex flex-wrap gap-1">
                      {currentDynamicTags.map((tag: DynamicTag) => {
                        const isSelected = state.formData.dynamicTags?.includes(tag.id) || false;
                        const isRelevant = !state.formData.gender || 
                          tag.gender === 'all' || 
                          tag.gender === state.formData.gender ||
                          (tag.gender === 'female' && state.formData.gender === 'other');
                        
                        return (
                          <button
                            key={tag.id}
                            className={`px-2 py-1 rounded text-xs border transition-all duration-200 hover:scale-105 ${
                              isSelected 
                                ? 'border-purple-400 bg-purple-100 text-purple-700 font-medium shadow-sm'
                                : isRelevant
                                  ? 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                                  : 'border-gray-100 text-gray-400 bg-gray-50 hover:border-gray-200'
                            }`}
                            onClick={() => handleDynamicTagToggle(tag.id)}
                            onTouchStart={() => handleTouchStart && handleTouchStart(tag)}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchCancel}
                            title={`${tag.label} - ${tag.description}${!isRelevant ? ` (${language === 'zh' ? '选择对应性别后可用' : 'Available after selecting relevant gender'})` : ''}`}
                          >
                            {tag.label}
                            {isSelected && <span className="ml-1">✓</span>}
                            {!isRelevant && <span className="ml-1 opacity-50">*</span>}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* 移动端提示框 */}
                    {mobileTooltip && mobileTooltip.visible && (
                      <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={hideMobileTooltip}
                      >
                        <div className="bg-white rounded-lg p-4 mx-4 max-w-sm shadow-lg">
                          <p className="text-sm text-gray-800 leading-relaxed">{mobileTooltip.content}</p>
                          <div className="mt-3 text-center">
                            <button 
                              className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
                              onClick={hideMobileTooltip}
                            >
                              {language === 'zh' ? '知道了' : 'Got it'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-200/50">
                      <p className="text-xs text-gray-500">
                        {language === 'zh' 
                          ? `💡 ${isMobile ? '点击选择，长按查看详情' : '悬停查看详情'} • 选项越详细，生成结果会让您更满意` 
                          : `💡 ${isMobile ? 'Tap to select, long press for details' : 'Hover for details'} • More detailed options lead to better results`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                    <ChevronUp className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    <span>{t('planner.form.theme.moreThemes')}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
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