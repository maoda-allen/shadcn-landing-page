"use client";

import { useParty } from '@/lib/contexts/party-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { Loader2, MapPin, Users, Calendar, Palette, Music, Utensils, Clock, Sparkles, FileText, Download } from 'lucide-react';

export function PartyResultDisplay() {
  const { state, resetForm } = useParty();
  const { formData, result, isLoading, error } = state;

  // 显示当前选择的预览
  const renderCurrentSelection = () => {
    const selections = [];
    
    if (formData.partyType) {
      const typeMap = { adult: '成人生日', child: '儿童生日', elderly: '长辈生日' };
      selections.push({ 
        label: '派对类型', 
        value: typeMap[formData.partyType as keyof typeof typeMap],
        icon: Users
      });
    }
    
    if (formData.guestCount) {
      const countMap = { small: '10人以内', medium: '10-30人', large: '30人以上' };
      selections.push({ 
        label: '参与人数', 
        value: countMap[formData.guestCount as keyof typeof countMap],
        icon: Users
      });
    }
    
    if (formData.venue) {
      const venueMap = { indoor: '室内场地', outdoor: '户外场地' };
      selections.push({ 
        label: '场地类型', 
        value: venueMap[formData.venue as keyof typeof venueMap],
        icon: MapPin
      });
    }
    
    if (formData.budget) {
      const budgetMap = { low: '经济型', medium: '中档型', high: '豪华型' };
      selections.push({ 
        label: '预算范围', 
        value: budgetMap[formData.budget as keyof typeof budgetMap],
        icon: Calendar
      });
    }
    
    if (formData.theme) {
      selections.push({ 
        label: '派对主题', 
        value: formData.theme,
        icon: Palette
      });
    }
    
    if (formData.atmosphere) {
      const atmosphereMap = {
        relaxed: '轻松休闲',
        fun: '欢乐搞笑',
        romantic: '浪漫温馨',
        elegant: '优雅高贵',
        energetic: '活力动感',
        peaceful: '自然宁静'
      };
      selections.push({ 
        label: '派对氛围', 
        value: atmosphereMap[formData.atmosphere as keyof typeof atmosphereMap],
        icon: Music
      });
    }

    return selections;
  };

  const currentSelections = renderCurrentSelection();

  // 空状态展示
  const renderEmptyState = () => (
    <div className="h-full">
      <Card className="h-full border-2 border-dashed border-muted-foreground/25 bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center h-full py-12 px-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-center">您的专属派对方案</h3>
          <p className="text-muted-foreground text-center mb-6 leading-relaxed">
            完成左侧选择后，我们将为您生成个性化的生日派对策划方案
          </p>
          <div className="w-full max-w-sm space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <span>场地布置与装饰建议</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <span>活动流程与时间安排</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <span>餐饮与音乐推荐</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 加载状态
  if (isLoading) {
    return (
      <div className="sticky top-8">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse"></div>
              <Loader2 className="w-8 h-8 text-primary animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-semibold mb-2">正在生成您的专属方案</h3>
            <p className="text-muted-foreground text-center">
              AI正在根据您的选择定制完美的生日派对策划...
            </p>
            <div className="mt-6 flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="sticky top-8">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">生成失败</h3>
            <p className="text-destructive mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              重新尝试
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 结果展示
  if (result) {
    return (
      <div className="sticky top-8 space-y-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg">您的专属派对方案</h2>
                <p className="text-sm text-muted-foreground font-normal">个性化定制完成</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 场地布置 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">场地布置</h3>
              </div>
              <div className="space-y-2 pl-8">
                {result.venueSetup.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* 活动安排 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">活动安排</h3>
              </div>
              <div className="space-y-2 pl-8">
                {result.activities.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* 装饰方案 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Palette className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">装饰方案</h3>
              </div>
              <div className="space-y-2 pl-8">
                {result.decorations.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* 餐饮建议 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Utensils className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">餐饮建议</h3>
              </div>
              <div className="space-y-2 pl-8">
                {result.catering.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* 音乐氛围 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Music className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">音乐氛围</h3>
              </div>
              <div className="space-y-2 pl-8">
                {result.music.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* 时间安排 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Clock className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">时间安排</h3>
              </div>
              <div className="space-y-2 pl-8">
                {result.timeline.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={resetForm} variant="outline" className="flex-1" size="sm">
                重新策划
              </Button>
              <Button 
                onClick={() => {
                  const content = `我的生日派对方案\n\n${JSON.stringify(result, null, 2)}`;
                  navigator.clipboard.writeText(content);
                }} 
                className="flex-1"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                保存方案
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 显示当前选择预览或空状态
  if (currentSelections.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="sticky top-8">
      <Card className="border-muted-foreground/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg">当前选择</h2>
              <p className="text-sm text-muted-foreground font-normal">
                {6 - currentSelections.length > 0 ? `还需选择 ${6 - currentSelections.length} 项` : '选择完成'}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentSelections.map((selection, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <selection.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{selection.label}</div>
                  <div className="text-sm font-medium truncate">{selection.value}</div>
                </div>
              </div>
            ))}
            
            {currentSelections.length < 6 && (
              <div className="pt-2 text-center">
                <Badge variant="secondary" className="text-xs">
                  进度: {currentSelections.length}/6
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 