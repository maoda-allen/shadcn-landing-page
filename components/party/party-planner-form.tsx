"use client";

import { useParty } from '@/lib/contexts/party-context';
import { PARTY_THEMES, ATMOSPHERE_OPTIONS } from '@/lib/types/party';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { useState } from 'react';

export function PartyPlannerForm() {
  const { state, updateFormData, generatePartyPlan } = useParty();
  const [customTheme, setCustomTheme] = useState('');
  const [showCustomTheme, setShowCustomTheme] = useState(false);

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
    const theme = PARTY_THEMES.find(t => t.id === themeId);
    updateFormData({ theme: theme?.name || themeId });
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

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Step 1: Party Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
            <h2>选择生日派对类型</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'child', label: '儿童生日', desc: '适合3-12岁儿童', icon: 'Baby' },
              { value: 'adult', label: '成人生日', desc: '适合18-50岁成人', icon: 'User' },
              { value: 'elderly', label: '长辈生日', desc: '适合50岁以上长辈', icon: 'Users' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.partyType === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handlePartyTypeSelect(option.value as any)}
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
            <h2>确定派对规模</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'small', label: '小型聚会', desc: '10人以内', icon: 'Users' },
              { value: 'medium', label: '中型聚会', desc: '10-30人', icon: 'Users' },
              { value: 'large', label: '大型聚会', desc: '30人以上', icon: 'Users' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.guestCount === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleGuestCountSelect(option.value as any)}
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
            <h2>选择派对场地</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {[
              { value: 'indoor', label: '室内场地', desc: '家中、餐厅、会所等', icon: 'Home' },
              { value: 'outdoor', label: '户外场地', desc: '公园、花园、海滩等', icon: 'Trees' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.venue === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleVenueSelect(option.value as any)}
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</span>
            <h2>设置预算范围</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: 'low', label: '经济型', desc: '500-1500元', icon: 'DollarSign' },
              { value: 'medium', label: '中档型', desc: '1500-5000元', icon: 'DollarSign' },
              { value: 'high', label: '豪华型', desc: '5000元以上', icon: 'DollarSign' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={state.formData.budget === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleBudgetSelect(option.value as any)}
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">5</span>
            <h2>选择创意主题</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {PARTY_THEMES.map((theme) => (
                <Button
                  key={theme.id}
                  variant={state.formData.theme === theme.name ? "default" : "outline"}
                  className="h-auto p-3 md:p-4 flex items-start gap-3 text-left justify-start"
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <Icon name={theme.icon as keyof typeof icons} size={18} color="currentColor" className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{theme.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{theme.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {theme.suitable.map((suit) => (
                        <Badge key={suit} variant="secondary" className="text-xs px-1.5 py-0.5">{suit}</Badge>
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
                >
                  自定义主题
                </Button>
              ) : (
                <div className="space-y-3">
                  <Label htmlFor="custom-theme" className="text-sm font-medium">自定义主题名称</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="custom-theme"
                      placeholder="输入您的创意主题..."
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCustomThemeSubmit} size="sm" className="flex-1 sm:flex-none">确定</Button>
                      <Button variant="outline" onClick={() => setShowCustomTheme(false)} size="sm" className="flex-1 sm:flex-none">取消</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 6: Atmosphere */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">6</span>
            <h2>确定派对氛围</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {ATMOSPHERE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={state.formData.atmosphere === option.value ? "default" : "outline"}
                className="h-auto p-3 md:p-4 flex flex-col items-center justify-center gap-2 text-center"
                onClick={() => handleAtmosphereSelect(option.value)}
              >
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-4 pb-4">
          <Button
            onClick={generatePartyPlan}
            disabled={!isFormComplete() || state.isLoading}
            className="w-full h-11 md:h-12 text-base font-medium"
            size="lg"
          >
            {state.isLoading ? '正在生成方案...' : '生成专属派对方案'}
          </Button>
          {state.error && (
            <p className="text-destructive text-sm mt-3 text-center">{state.error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 