"use client";

import { useParty } from '@/lib/contexts/party-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Loader2, Sparkles } from 'lucide-react';
import { flushSync } from 'react-dom';

export function PartyPlannerForm() {
  const { state, updateFormData, generatePartyPlan } = useParty();
  const { t, language } = useLanguage();
  const { formData, result, isLoading, error } = state;
  const [customTheme, setCustomTheme] = useState('');
  const [showCustomTheme, setShowCustomTheme] = useState(false);
  
  // 本地loading状态作为备用，确保UI响应
  const [localLoading, setLocalLoading] = useState(false);

  // 使用Context中的loading状态或本地状态
  const isCurrentlyLoading = isLoading || localLoading;

  // 监听Context loading状态变化，同步本地状态
  useEffect(() => {
    if (isLoading !== localLoading) {
      setLocalLoading(isLoading);
    }
  }, [isLoading, localLoading]);

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
    const { partyType, guestCount, venue, budget, theme, atmosphere } = formData;
    return partyType && guestCount && venue && budget && theme && atmosphere;
  };

  // 生成按钮点击处理
  const handleGenerateClick = async () => {
    console.log('🎯 handleGenerateClick called');
    
    // 如果已有结果，需要用户确认重新生成
    if (result) {
      const confirmed = window.confirm(t('planner.form.confirmRegenerate'));
      
      if (!confirmed) {
        return; // 用户取消，不执行生成
      }
    }
    
    // 立即设置本地loading状态，确保UI立即响应
    console.log('🎯 Setting local loading to true');
    flushSync(() => {
      setLocalLoading(true);
    });
    
    // 短暂延迟确保UI更新完成
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      console.log('🎯 Calling generatePartyPlan');
      // 执行生成
      await generatePartyPlan();
    } catch (error) {
      console.error('🎯 Error in generatePartyPlan:', error);
    } finally {
      console.log('🎯 Setting local loading to false');
      setLocalLoading(false);
    }
  };

  const renderGenerateButton = () => {
    const hasResult = !!result;
    const buttonText = hasResult 
      ? t('planner.form.regenerateButton')
      : t('planner.form.generateButton');
    
    return (
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
            {buttonText}
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 调试信息 - 临时显示当前状态 */}
      <div className="fixed top-4 right-4 bg-yellow-100 p-2 rounded text-xs z-[10001] border">
        Context Loading: {isLoading ? 'YES' : 'NO'} | Local Loading: {localLoading ? 'YES' : 'NO'} | Currently Loading: {isCurrentlyLoading ? 'YES' : 'NO'}
      </div>
      
      {/* 全局加载遮罩 - 优化层级到最高 */}
      {isCurrentlyLoading && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          style={{ zIndex: 10000 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Loading overlay clicked, states:', { isLoading, localLoading, isCurrentlyLoading });
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl max-w-sm mx-4 border">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {t('planner.form.generating')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('planner.form.generatingDesc')}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Debug: Context({isLoading ? '✓' : '✗'}) Local({localLoading ? '✓' : '✗'})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                variant={formData.partyType === option.value ? "default" : "outline"}
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

      {/* Step 2: Guest Count */}
      <Card className={isCurrentlyLoading ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
            {t('planner.form.guestCount.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'small', label: t('planner.form.guestCount.small'), desc: t('planner.form.guestCount.descriptions.small'), icon: 'Users' },
              { value: 'medium', label: t('planner.form.guestCount.medium'), desc: t('planner.form.guestCount.descriptions.medium'), icon: 'Users' },
              { value: 'large', label: t('planner.form.guestCount.large'), desc: t('planner.form.guestCount.descriptions.large'), icon: 'Users' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={formData.guestCount === option.value ? "default" : "outline"}
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
                variant={formData.venue === option.value ? "default" : "outline"}
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
                variant={formData.budget === option.value ? "default" : "outline"}
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
                  variant={formData.theme === t(`planner.form.theme.${theme.id}`) ? "default" : "outline"}
                  className="h-auto p-3 md:p-4 flex items-start gap-3 text-left justify-start"
                  onClick={() => handleThemeSelect(theme.id)}
                  disabled={isCurrentlyLoading}
                >
                  <Icon name={theme.icon as keyof typeof icons} size={18} color="currentColor" className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{t(`planner.form.theme.${theme.id}`)}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{t(`planner.form.theme.descriptions.${theme.id}`)}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {theme.suitable.map((suit) => (
                        <Badge key={suit} variant="secondary" className="text-xs px-1.5 py-0.5">
                          {t(`planner.form.partyType.${suit === 'adult' ? 'adult' : suit === 'child' ? 'child' : suit === 'elderly' ? 'elderly' : suit === 'teen' ? 'teen' : suit}`)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="border-t pt-4">
              {!showCustomTheme ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCustomTheme(true)}
                  className="w-full"
                  size="sm"
                  disabled={isCurrentlyLoading}
                >
                  {t('planner.form.theme.customTheme')}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="custom-theme" className="text-sm font-medium">{t('planner.form.theme.customThemeName')}</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="custom-theme"
                      placeholder={t('planner.form.theme.placeholder')}
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      className="flex-1"
                      disabled={isCurrentlyLoading}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCustomThemeSubmit} size="sm" className="flex-1 sm:flex-none" disabled={isCurrentlyLoading}>{t('planner.form.theme.confirm')}</Button>
                      <Button variant="outline" onClick={() => setShowCustomTheme(false)} size="sm" className="flex-1 sm:flex-none" disabled={isCurrentlyLoading}>{t('planner.form.theme.cancel')}</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 6: Atmosphere */}
      <Card className={isCurrentlyLoading ? 'opacity-60 pointer-events-none' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">6</span>
            {t('planner.form.atmosphere.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {atmosphereOptions.map((option) => (
              <Button
                key={option}
                variant={formData.atmosphere === option ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleAtmosphereSelect(option)}
                disabled={isCurrentlyLoading}
              >
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{t(`planner.form.atmosphere.${option}`)}</div>
                  <div className="text-xs text-muted-foreground">{t(`planner.form.atmosphere.descriptions.${option}`)}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-4 pb-4">
          {renderGenerateButton()}
          
          {error && (
            <p className="text-destructive text-sm mt-3 text-center">{error}</p>
          )}
          
          {/* 表单完整性提示 */}
          {!isFormComplete() && !isCurrentlyLoading && (
            <p className="text-muted-foreground text-sm mt-3 text-center">
              {t('planner.form.completeAllSteps')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 