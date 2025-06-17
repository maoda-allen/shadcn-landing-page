"use client";

import { useParty } from '@/lib/contexts/party-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Loader2, Sparkles } from 'lucide-react';

export function PartyPlannerForm() {
  const { state, updateFormData, generatePartyPlan } = useParty();
  const { t, language } = useLanguage();
  const [customTheme, setCustomTheme] = useState('');
  const [showCustomTheme, setShowCustomTheme] = useState(false);

<<<<<<< HEAD
=======
  // 本地状态来强制重新渲染
  const [localLoading, setLocalLoading] = useState(false);

  // 监控加载状态变化
  useEffect(() => {
    setLocalLoading(state.isLoading);
  }, [state.isLoading]);

  // 使用组合状态
  const isCurrentlyLoading = state.isLoading || localLoading;

  // 定义主题选项
  const themeOptions = [
    { id: 'modern', icon: 'Square', suitable: ['adult'] },
    { id: 'retro', icon: 'Music', suitable: ['adult'] },
    { id: 'garden', icon: 'Flower', suitable: ['adult', 'elderly'] },
    { id: 'superhero', icon: 'Zap', suitable: ['child', 'teen'] },
    { id: 'princess', icon: 'Crown', suitable: ['child'] },
    { id: 'ocean', icon: 'Waves', suitable: ['child'] }
  ];

  // 定义氛围选项
  const atmosphereOptions = [
    'lively', 'elegant', 'casual', 'formal', 'creative', 'intimate'
  ];

  const handlePartyTypeSelect = (type: 'adult' | 'child' | 'elderly') => {
    updateFormData({ partyType: type });
  };

  const handleGuestCountSelect = (count: 'small' | 'medium' | 'large') => {
    updateFormData({ guestCount: count });
  };

  const handleVenueSelect = (venue: 'indoor' | 'outdoor') => {
    updateFormData({ venue });
  };

  const handleBudgetSelect = (budget: 'low' | 'medium' | 'high') => {
    updateFormData({ budget });
  };

  const handleThemeSelect = (themeId: string) => {
    const themeName = t(`planner.form.theme.${themeId}`);
    updateFormData({ theme: themeName });
    setShowCustomTheme(false);
  };

  const handleCustomThemeSubmit = () => {
    if (customTheme.trim()) {
      updateFormData({ theme: customTheme.trim() });
      setShowCustomTheme(false);
    }
  };

  const handleAtmosphereSelect = (atmosphere: string) => {
    updateFormData({ atmosphere: atmosphere as any });
  };

  const isFormComplete = () => {
    const { partyType, guestCount, venue, budget, theme, atmosphere } = state.formData;
    return partyType && guestCount && venue && budget && theme && atmosphere;
  };

>>>>>>> parent of f6e9e17 (修复生成页面体验效果)
  // 生成按钮点击处理
  const handleGenerateClick = async () => {
    if (!isFormComplete()) {
      return;
    }
    
<<<<<<< HEAD
    // 执行生成
    await generatePartyPlan();
  };

  // 派对类型选项
  const partyTypes = [
    { 
      id: 'adultBirthday', 
      icon: 'User', 
      title: t('planner.form.partyType.adultBirthday'),
      subtitle: t('planner.form.partyType.adultBirthdayDesc'),
      badges: [t('planner.form.partyType.badges.mature'), t('planner.form.partyType.badges.personalized')]
    },
    { 
      id: 'kidsBirthday', 
      icon: 'Baby', 
      title: t('planner.form.partyType.kidsBirthday'),
      subtitle: t('planner.form.partyType.kidsBirthdayDesc'),
      badges: [t('planner.form.partyType.badges.interactive'), t('planner.form.partyType.badges.colorful')]
    },
    { 
      id: 'seniorBirthday', 
      icon: 'Heart', 
      title: t('planner.form.partyType.seniorBirthday'),
      subtitle: t('planner.form.partyType.seniorBirthdayDesc'),
      badges: [t('planner.form.partyType.badges.warm'), t('planner.form.partyType.badges.meaningful')]
    },
    { 
      id: 'teenBirthday', 
      icon: 'Zap', 
      title: t('planner.form.partyType.teenBirthday'),
      subtitle: t('planner.form.partyType.teenBirthdayDesc'),
      badges: [t('planner.form.partyType.badges.trendy'), t('planner.form.partyType.badges.social')]
    },
  ];

  // 聚会规模选项
  const guestCounts = [
    { id: 'smallParty', label: t('planner.form.guestCount.smallParty'), desc: t('planner.form.guestCount.smallPartyDesc') },
    { id: 'mediumParty', label: t('planner.form.guestCount.mediumParty'), desc: t('planner.form.guestCount.mediumPartyDesc') },
    { id: 'largeParty', label: t('planner.form.guestCount.largeParty'), desc: t('planner.form.guestCount.largePartyDesc') },
  ];

  // 场地选项
  const venues = [
    { id: 'home', label: t('planner.form.venue.home'), desc: t('planner.form.venue.homeDesc') },
    { id: 'outdoor', label: t('planner.form.venue.outdoor'), desc: t('planner.form.venue.outdoorDesc') },
    { id: 'restaurant', label: t('planner.form.venue.restaurant'), desc: t('planner.form.venue.restaurantDesc') },
    { id: 'hall', label: t('planner.form.venue.hall'), desc: t('planner.form.venue.hallDesc') },
  ];

  // 预算选项
  const budgets = [
    { id: 'budget', label: t('planner.form.budget.budget'), desc: t('planner.form.budget.budgetDesc') },
    { id: 'standard', label: t('planner.form.budget.standard'), desc: t('planner.form.budget.standardDesc') },
    { id: 'premium', label: t('planner.form.budget.premium'), desc: t('planner.form.budget.premiumDesc') },
  ];

  // 主题选项
  const themes = [
    { 
      id: 'garden', 
      title: t('planner.form.theme.garden.title'), 
      subtitle: t('planner.form.theme.garden.subtitle'),
      badges: [t('planner.form.theme.garden.badge1'), t('planner.form.theme.garden.badge2')],
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'superhero', 
      title: t('planner.form.theme.superhero.title'), 
      subtitle: t('planner.form.theme.superhero.subtitle'),
      badges: [t('planner.form.theme.superhero.badge1'), t('planner.form.theme.superhero.badge2')],
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'princess', 
      title: t('planner.form.theme.princess.title'), 
      subtitle: t('planner.form.theme.princess.subtitle'),
      badges: [t('planner.form.theme.princess.badge1'), t('planner.form.theme.princess.badge2')],
      gradient: 'from-pink-500 to-rose-600'
    },
    { 
      id: 'ocean', 
      title: t('planner.form.theme.ocean.title'), 
      subtitle: t('planner.form.theme.ocean.subtitle'),
      badges: [t('planner.form.theme.ocean.badge1'), t('planner.form.theme.ocean.badge2')],
      gradient: 'from-cyan-500 to-blue-600'
    },
  ];

  // 氛围选项
  const atmospheres = [
    { id: 'lively', label: t('planner.form.atmosphere.lively'), desc: t('planner.form.atmosphere.livelyDesc') },
    { id: 'elegant', label: t('planner.form.atmosphere.elegant'), desc: t('planner.form.atmosphere.elegantDesc') },
    { id: 'casual', label: t('planner.form.atmosphere.casual'), desc: t('planner.form.atmosphere.casualDesc') },
    { id: 'formal', label: t('planner.form.atmosphere.formal'), desc: t('planner.form.atmosphere.formalDesc') },
    { id: 'creative', label: t('planner.form.atmosphere.creative'), desc: t('planner.form.atmosphere.creativeDesc') },
    { id: 'intimate', label: t('planner.form.atmosphere.intimate'), desc: t('planner.form.atmosphere.intimateDesc') },
  ];
=======
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
>>>>>>> parent of f6e9e17 (修复生成页面体验效果)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 全局加载遮罩 */}
<<<<<<< HEAD
      {isLoading && (
=======
      {isCurrentlyLoading && (
>>>>>>> parent of f6e9e17 (修复生成页面体验效果)
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-sm mx-4 border">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{t('planner.form.generating')}</p>
                <p className="text-sm text-gray-600 mt-1">{t('planner.form.generatingDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD
=======
      
      {/* Step 1: Party Type */}
      <Card className={isCurrentlyLoading ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
            {t('planner.form.partyType.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'child', label: t('planner.form.partyType.child'), desc: t('planner.form.partyType.descriptions.child'), icon: 'Baby' },
              { value: 'adult', label: t('planner.form.partyType.adult'), desc: t('planner.form.partyType.descriptions.adult'), icon: 'User' },
              { value: 'elderly', label: t('planner.form.partyType.elderly'), desc: t('planner.form.partyType.descriptions.elderly'), icon: 'Users' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.partyType === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handlePartyTypeSelect(option.value as any)}
                disabled={isCurrentlyLoading}
              >
                <Icon name={option.icon as keyof typeof icons} size={20} color="currentColor" />
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
>>>>>>> parent of f6e9e17 (修复生成页面体验效果)

      {/* 1. 派对类型选择 */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h2 className="text-lg">{t('planner.form.partyType.title')}</h2>
              <p className="text-sm text-muted-foreground font-normal">{t('planner.form.partyType.subtitle')}</p>
            </div>
          </CardTitle>
        </CardHeader>
<<<<<<< HEAD
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {partyTypes.map((type) => {
            const IconComponent = icons[type.icon as keyof typeof icons];
            return (
              <button
                key={type.id}
                onClick={() => updateFormData({ partyType: type.id as any })}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  formData.partyType === type.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.partyType === type.id ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      formData.partyType === type.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
=======
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'small', label: t('planner.form.guestCount.small'), desc: t('planner.form.guestCount.descriptions.small'), icon: 'Users' },
              { value: 'medium', label: t('planner.form.guestCount.medium'), desc: t('planner.form.guestCount.descriptions.medium'), icon: 'Users' },
              { value: 'large', label: t('planner.form.guestCount.large'), desc: t('planner.form.guestCount.descriptions.large'), icon: 'Users' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.guestCount === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleGuestCountSelect(option.value as any)}
                disabled={isCurrentlyLoading}
              >
                <Icon name={option.icon as keyof typeof icons} size={20} color="currentColor" />
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Venue */}
      <Card className={isCurrentlyLoading ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
            {t('planner.form.venue.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {[
              { value: 'indoor', label: t('planner.form.venue.indoor'), desc: t('planner.form.venue.descriptions.indoor'), icon: 'Home' },
              { value: 'outdoor', label: t('planner.form.venue.outdoor'), desc: t('planner.form.venue.descriptions.outdoor'), icon: 'Trees' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.venue === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleVenueSelect(option.value as any)}
                disabled={isCurrentlyLoading}
              >
                <Icon name={option.icon as keyof typeof icons} size={20} color="currentColor" />
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Budget */}
      <Card className={isCurrentlyLoading ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</span>
            {t('planner.form.budget.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'low', label: t('planner.form.budget.low'), desc: t('planner.form.budget.descriptions.low'), icon: 'DollarSign' },
              { value: 'medium', label: t('planner.form.budget.medium'), desc: t('planner.form.budget.descriptions.medium'), icon: 'DollarSign' },
              { value: 'high', label: t('planner.form.budget.high'), desc: t('planner.form.budget.descriptions.high'), icon: 'DollarSign' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.budget === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleBudgetSelect(option.value as any)}
                disabled={isCurrentlyLoading}
              >
                <Icon name={option.icon as keyof typeof icons} size={20} color="currentColor" />
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Theme */}
      <Card className={isCurrentlyLoading ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">5</span>
            {t('planner.form.theme.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {themeOptions.map((theme) => (
                <Button
                  key={theme.id}
                  variant={state.formData.theme === t(`planner.form.theme.${theme.id}`) ? "default" : "outline"}
                  className="h-auto p-3 md:p-4 flex items-start gap-3 text-left justify-start"
                  onClick={() => handleThemeSelect(theme.id)}
                  disabled={isCurrentlyLoading}
                >
                  <Icon name={theme.icon as keyof typeof icons} size={18} color="currentColor" className="mt-0.5 flex-shrink-0" />
>>>>>>> parent of f6e9e17 (修复生成页面体验效果)
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{type.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{type.subtitle}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {type.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* 2. 聚会规模选择 */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h2 className="text-lg">{t('planner.form.guestCount.title')}</h2>
              <p className="text-sm text-muted-foreground font-normal">{t('planner.form.guestCount.subtitle')}</p>
            </div>
          </CardTitle>
        </CardHeader>
<<<<<<< HEAD
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guestCounts.map((option) => (
            <button
              key={option.id}
              onClick={() => updateFormData({ guestCount: option.id as any })}
              className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                formData.guestCount === option.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold text-sm mb-1">{option.label}</h3>
              <p className="text-xs text-muted-foreground">{option.desc}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* 3. 场地选择 */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h2 className="text-lg">{t('planner.form.venue.title')}</h2>
              <p className="text-sm text-muted-foreground font-normal">{t('planner.form.venue.subtitle')}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => updateFormData({ venue: venue.id as any })}
              className={`p-3 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                formData.venue === venue.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold text-sm mb-1">{venue.label}</h3>
              <p className="text-xs text-muted-foreground">{venue.desc}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* 4. 预算选择 */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">4</span>
            </div>
            <div>
              <h2 className="text-lg">{t('planner.form.budget.title')}</h2>
              <p className="text-sm text-muted-foreground font-normal">{t('planner.form.budget.subtitle')}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {budgets.map((budget) => (
            <button
              key={budget.id}
              onClick={() => updateFormData({ budget: budget.id as any })}
              className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                formData.budget === budget.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold text-sm mb-1">{budget.label}</h3>
              <p className="text-xs text-muted-foreground">{budget.desc}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* 5. 主题选择 */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">5</span>
            </div>
            <div>
              <h2 className="text-lg">{t('planner.form.theme.title')}</h2>
              <p className="text-sm text-muted-foreground font-normal">{t('planner.form.theme.subtitle')}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 预设主题 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  updateFormData({ theme: theme.title });
                  setShowCustomTheme(false);
                }}
                className={`relative p-4 rounded-lg border-2 text-left transition-all hover:shadow-md overflow-hidden ${
                  formData.theme === theme.title
                    ? 'border-primary shadow-sm'
                    : 'border-border hover:border-primary/50'
                }`}
=======
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {atmosphereOptions.map((option) => (
              <Button
                key={option}
                variant={state.formData.atmosphere === option ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleAtmosphereSelect(option)}
                disabled={isCurrentlyLoading}
>>>>>>> parent of f6e9e17 (修复生成页面体验效果)
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`}></div>
                <div className="relative">
                  <h3 className="font-semibold text-sm">{theme.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{theme.subtitle}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {theme.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 自定义主题 */}
          <div className="space-y-3">
            <button
              onClick={() => setShowCustomTheme(!showCustomTheme)}
              className={`w-full p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                showCustomTheme && !themes.some(t => t.title === formData.theme)
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold text-sm">{t('planner.form.theme.customTheme')}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t('planner.form.theme.customThemeDesc')}</p>
            </button>

            {showCustomTheme && (
              <div className="space-y-2">
                <Label htmlFor="customTheme" className="text-sm font-medium">
                  {t('planner.form.theme.customThemeLabel')}
                </Label>
                <Input
                  id="customTheme"
                  value={customTheme}
                  onChange={(e) => {
                    setCustomTheme(e.target.value);
                    updateFormData({ theme: e.target.value });
                  }}
                  placeholder={t('planner.form.theme.customThemePlaceholder')}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {t('planner.form.theme.customThemeHelp')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 6. 派对氛围选择 */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">6</span>
            </div>
            <div>
              <h2 className="text-lg">{t('planner.form.atmosphere.title')}</h2>
              <p className="text-sm text-muted-foreground font-normal">{t('planner.form.atmosphere.subtitle')}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {atmospheres.map((atmosphere) => (
            <button
              key={atmosphere.id}
              onClick={() => updateFormData({ atmosphere: atmosphere.id as any })}
              className={`p-3 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                formData.atmosphere === atmosphere.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold text-sm mb-1">{atmosphere.label}</h3>
              <p className="text-xs text-muted-foreground">{atmosphere.desc}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* 错误提示 */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="py-4">
            <p className="text-destructive text-sm text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 生成按钮 */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
<<<<<<< HEAD
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {formData.partyType && formData.guestCount && formData.venue && formData.budget && formData.theme && formData.atmosphere
                ? t('planner.form.readyToGenerate')
                : t('planner.form.completeAllSteps')
              }
=======
        <CardContent className="pt-4 pb-4">
          <Button
            onClick={handleGenerateClick}
            disabled={!isFormComplete() || isCurrentlyLoading}
            className={`w-full h-11 md:h-12 text-base font-medium relative transition-all duration-200 ${
              isCurrentlyLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            size="lg"
          >
            {isCurrentlyLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('planner.form.generating')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('planner.form.generateButton')}
              </>
            )}
          </Button>
          
          {state.error && (
            <p className="text-destructive text-sm mt-3 text-center">{state.error}</p>
          )}
          
          {/* 表单完整性提示 */}
          {!isFormComplete() && !isCurrentlyLoading && (
            <p className="text-muted-foreground text-sm mt-3 text-center">
              {t('planner.form.completeAllSteps')}
>>>>>>> parent of f6e9e17 (修复生成页面体验效果)
            </p>
            <Button 
              onClick={handleGenerateClick}
              disabled={isLoading || !formData.partyType || !formData.guestCount || !formData.venue || !formData.budget || !formData.theme || !formData.atmosphere}
              size="lg"
              className="w-full md:w-auto min-w-48"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('planner.form.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {result ? t('planner.form.regenerateButton') : t('planner.form.generateButton')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 