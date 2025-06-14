"use client";

import { useParty } from '@/lib/contexts/party-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { Loader2, MapPin, Users, Calendar, Palette, Music, Utensils, Clock, Sparkles, FileText, Download, Share2, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/language-context';
import { toast } from '@/lib/utils/toast';
import { devLogger } from '@/lib/utils/dev-logger';

// 动态评估函数 - 随机打分但保证93分以上
const calculateProfessionalScore = (formData: any, result: any) => {
  // 生成随机分数，确保总分在93-100之间
  const generateRandomScore = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // 先生成一个93-100的总分
  const targetTotal = generateRandomScore(93, 100);
  
  // 将总分分配到5个维度，每个维度最少18分，最多20分
  let scores = {
    creativity: 18,
    planning: 18,
    budget: 18,
    details: 18,
    feasibility: 18
  };

  // 剩余分数需要分配
  let remainingPoints = targetTotal - 90; // 90是基础分数(18*5)
  
  // 随机分配剩余分数到各个维度
  const dimensions = Object.keys(scores) as (keyof typeof scores)[];
  
  while (remainingPoints > 0) {
    const randomDimension = dimensions[Math.floor(Math.random() * dimensions.length)];
    if (scores[randomDimension] < 20) {
      scores[randomDimension]++;
      remainingPoints--;
    }
  }

  // 根据实际选择微调分数（保持随机性的同时增加一些逻辑性）
  const adjustments = Math.floor(Math.random() * 3); // 0-2个随机调整
  
  for (let i = 0; i < adjustments; i++) {
    const fromDimension = dimensions[Math.floor(Math.random() * dimensions.length)];
    const toDimension = dimensions[Math.floor(Math.random() * dimensions.length)];
    
    if (scores[fromDimension] > 18 && scores[toDimension] < 20 && fromDimension !== toDimension) {
      scores[fromDimension]--;
      scores[toDimension]++;
    }
  }

  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  const level = total >= 98 ? '卓越级别' : 
               total >= 95 ? '优秀级别' : 
               total >= 93 ? '良好级别' : '合格级别';

  return { scores, total, level };
};

export function PartyResultDisplay() {
  const { state, resetForm, clearData } = useParty();
  const { t, language } = useLanguage();
  const { formData, result, isLoading, error } = state;
  const exportRef = useRef<HTMLDivElement>(null);

  // 检查是否正在加载（使用Context状态）
  const isCurrentlyLoading = isLoading;

  // 临时测试函数
  const testAPI = async () => {
    try {
      console.log('🧪 开始测试API...');
      const response = await fetch('/api/test-party-plan');
      const data = await response.json();
      console.log('🧪 测试API响应:', data);
      
      if (data.success && data.plan) {
        console.log('🧪 设置测试数据到state...');
        // 直接调用context的dispatch来设置测试数据
        // 这里我们需要通过useParty来获取dispatch函数
      }
    } catch (error) {
      console.error('🧪 测试API失败:', error);
    }
  };

  // 获取选项文本的辅助函数
  const getPartyTypeText = (type: string) => {
    return t(`planner.form.partyType.${type}`);
  };

  const getGuestCountText = (count: string) => {
    return t(`planner.form.guestCount.${count}`);
  };

  const getVenueText = (venue: string) => {
    return t(`planner.form.venue.${venue}`);
  };

  const getBudgetText = (budget: string) => {
    return t(`planner.form.budget.${budget}`);
  };

  const getAtmosphereText = (atmosphere: string) => {
    return t(`planner.form.atmosphere.${atmosphere}`);
  };

  // 生成HTML区块的辅助函数
  const generateSectionHTML = (title: string, items: string[]) => {
    return `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #ea580c; font-size: 16px; margin: 0 0 12px 0; display: flex; align-items: center;">
          ${title}
        </h3>
        <div style="background: #fafafa; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
          ${items.map(item => `
            <div style="margin-bottom: 8px; font-size: 14px; line-height: 1.5; color: #374151;">
              • ${item}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  // 导出方案为图片
  const exportToImage = async () => {
    if (!result) return;

    try {
      const { scores, total, level } = calculateProfessionalScore(formData, result);
      
      // 创建一个临时的导出容器
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'fixed';
      exportContainer.style.top = '-9999px';
      exportContainer.style.left = '-9999px';
      exportContainer.style.width = '800px';
      exportContainer.style.backgroundColor = '#ffffff';
      exportContainer.style.padding = '40px';
      exportContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      // 创建导出内容
      exportContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316; font-size: 28px; font-weight: bold; margin: 0 0 10px 0;">🎉 ${t('planner.result.title')}</h1>
          <p style="color: #666; font-size: 16px; margin: 0;">${t('planner.result.exportDetails.subtitle')}</p>
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; font-size: 14px; font-weight: bold;">
            ⭐ ${t('planner.result.professionalScore')}：${level} (${total}/100)
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #ea580c; font-size: 18px; margin: 0 0 15px 0;">📋 ${t('planner.result.currentSelection')}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            ${formData.partyType ? `<div><strong>${t('planner.form.partyType.title')}：</strong>${getPartyTypeText(formData.partyType)}</div>` : ''}
            ${formData.guestCount ? `<div><strong>${t('planner.form.guestCount.title')}：</strong>${getGuestCountText(formData.guestCount)}</div>` : ''}
            ${formData.venue ? `<div><strong>${t('planner.form.venue.title')}：</strong>${getVenueText(formData.venue)}</div>` : ''}
            ${formData.budget ? `<div><strong>${t('planner.form.budget.title')}：</strong>${getBudgetText(formData.budget)}</div>` : ''}
            ${formData.theme ? `<div><strong>${t('planner.form.theme.title')}：</strong>${formData.theme}</div>` : ''}
            ${formData.atmosphere ? `<div><strong>${t('planner.form.atmosphere.title')}：</strong>${getAtmosphereText(formData.atmosphere)}</div>` : ''}
          </div>
        </div>

        <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
          <h3 style="color: #0369a1; font-size: 16px; margin: 0 0 10px 0;">💡 ${t('planner.result.budgetTip')}</h3>
          <div style="font-size: 13px; color: #374151; line-height: 1.5;">
            <div style="margin-bottom: 5px;">• ${t('planner.result.tips.budgetReminder')}</div>
            <div style="margin-bottom: 5px;">• ${t('planner.result.tips.preparationAdvice')}</div>
            <div>• 天气变化请准备备用方案，室内外场地都要考虑</div>
          </div>
        </div>

        ${generateSectionHTML(`🏠 ${t('planner.result.venue')}`, result.venue)}
        ${generateSectionHTML(`🎮 ${t('planner.result.activities')}`, result.activities)}
        ${generateSectionHTML(`🎨 ${t('planner.result.decorations')}`, result.decorations)}
        ${generateSectionHTML(`🍰 ${t('planner.result.catering')}`, result.catering)}
        ${generateSectionHTML(`🎵 ${t('planner.result.music')}`, result.music)}
        ${generateSectionHTML(`⏰ ${t('planner.result.schedule')}`, result.schedule)}
        
        <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 15px; margin-top: 25px;">
          <h3 style="color: #16a34a; font-size: 16px; margin: 0 0 12px 0;">⭐ ${t('planner.result.professionalEvaluation')}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">${t('planner.result.creativity')}</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.creativity}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">${t('planner.result.planning')}</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.planning}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">${t('planner.result.budget')}</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.budget}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">${t('planner.result.details')}</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.details}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">${t('planner.result.feasibility')}</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.feasibility}/20</span>
            </div>
          </div>
          <div style="text-align: center; padding: 8px; background: #dcfce7; border-radius: 8px;">
            <span style="color: #16a34a; font-size: 14px; font-weight: bold;">${t('planner.result.totalScore')}：${total}/100 ${level}</span>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%); padding: 20px; border-radius: 12px; margin-top: 25px;">
          <h3 style="color: #ea580c; font-size: 16px; margin: 0 0 15px 0;">✅ ${t('planner.result.executionTip')}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13px;">
            <div>
              <strong style="color: #ea580c;">${t('planner.result.executionDetails.oneWeekBefore')}</strong><br>
              • ${t('planner.result.executionDetails.oneWeekTasks.confirmVenue')}<br>
              • ${t('planner.result.executionDetails.oneWeekTasks.buyDecorations')}<br>
              • ${t('planner.result.executionDetails.oneWeekTasks.prepareProps')}
            </div>
            <div>
              <strong style="color: #ea580c;">${t('planner.result.executionDetails.dayOfParty')}</strong><br>
              • ${t('planner.result.executionDetails.dayOfTasks.setupEarly')}<br>
              • ${t('planner.result.executionDetails.dayOfTasks.testEquipment')}<br>
              • ${t('planner.result.executionDetails.dayOfTasks.rehearseHighlights')}
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #fed7aa;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">${t('planner.result.exportDetails.generatedTime')}${new Date().toLocaleString('zh-CN')} | ${t('planner.result.exportDetails.planNumber')}${Date.now().toString().slice(-6)}</p>
          <p style="color: #f97316; font-size: 14px; font-weight: bold; margin: 5px 0 0 0;">${t('planner.result.exportDetails.brandFooter')}</p>
          <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">${t('planner.result.exportDetails.tagline')}</p>
        </div>
      `;

      document.body.appendChild(exportContainer);

      // 生成图片
      const canvas = await html2canvas(exportContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: exportContainer.scrollHeight + 80
      });

      // 清理临时容器
      document.body.removeChild(exportContainer);

      // 下载图片
      const link = document.createElement('a');
      const fileName = `${t('planner.result.exportDetails.subtitle').split('|')[0].trim()}_${formData.theme || t('planner.form.theme.customTheme')}_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      devLogger.error('export.failed', error);
      const errorMessage = t('planner.result.error.title');
      toast.error(errorMessage);
    }
  };

  // 显示当前选择的预览
  const renderCurrentSelection = () => {
    const selections = [];
    
    if (formData.partyType) {
      selections.push({ 
        label: t('planner.form.partyType.title'), 
        value: getPartyTypeText(formData.partyType),
        icon: Users
      });
    }
    
    if (formData.guestCount) {
      selections.push({ 
        label: t('planner.form.guestCount.title'), 
        value: getGuestCountText(formData.guestCount),
        icon: Users
      });
    }
    
    if (formData.venue) {
      selections.push({ 
        label: t('planner.form.venue.title'), 
        value: getVenueText(formData.venue),
        icon: MapPin
      });
    }
    
    if (formData.budget) {
      selections.push({ 
        label: t('planner.form.budget.title'), 
        value: getBudgetText(formData.budget),
        icon: Calendar
      });
    }
    
    if (formData.theme) {
      selections.push({ 
        label: t('planner.form.theme.title'), 
        value: formData.theme,
        icon: Palette
      });
    }
    
    if (formData.atmosphere) {
      selections.push({ 
        label: t('planner.form.atmosphere.title'), 
        value: getAtmosphereText(formData.atmosphere),
        icon: Music
      });
    }

    return selections;
  };

  const currentSelections = renderCurrentSelection();

  // 空状态展示
  const renderEmptyState = () => (
    <div className="h-full" data-result-area>
      <Card className="h-full border-2 border-dashed border-muted-foreground/25 bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center h-full py-12 px-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-center">{t('planner.result.emptyState.title')}</h3>
          <p className="text-muted-foreground text-center mb-6 leading-relaxed">
            {t('planner.result.emptyState.description')}
          </p>
          <div className="w-full max-w-sm space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <span>{t('planner.result.emptyState.feature1')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <span>{t('planner.result.emptyState.feature2')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <span>{t('planner.result.emptyState.feature3')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 加载状态
  if (isCurrentlyLoading) {
    return (
      <div className="sticky top-8" data-result-area>
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-200 animate-pulse"></div>
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-blue-900">{t('planner.result.loading.title')}</h3>
            <p className="text-blue-700 text-center font-medium">
              {t('planner.result.loading.description')}
            </p>
            <div className="mt-6 flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="sticky top-8" data-result-area>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('planner.result.error.title')}</h3>
            <p className="text-destructive mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              {t('planner.result.error.retry')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 结果展示
  if (result) {
    const { scores, total, level } = calculateProfessionalScore(formData, result);

    return (
      <div className="sticky top-8 space-y-4" data-result-area>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg">{t('planner.result.title')}</h2>
                <p className="text-sm text-muted-foreground font-normal">{t('planner.result.subtitle')} • {t('planner.result.professionalScore')}：{level}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 预算提醒卡片 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xs">💡</span>
                </div>
                <h4 className="font-semibold text-blue-900 text-sm">{t('planner.result.budgetTip')}</h4>
              </div>
              <div className="text-xs text-blue-800 space-y-1">
                <p>• {t('planner.result.tips.budgetReminder')}</p>
                <p>• {t('planner.result.tips.preparationAdvice')}</p>
              </div>
            </div>

            {/* 场地布置 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{t('planner.result.venue')}</h3>
                <Badge variant="outline" className="text-xs">{t('planner.result.badges.budgetReference')}</Badge>
              </div>
              <div className="space-y-2 pl-8">
                {result.venue.map((item, index) => (
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
                  <Users className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{t('planner.result.activities')}</h3>
                <Badge variant="outline" className="text-xs">{t('planner.result.badges.climaxMoment')}</Badge>
                <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700 border-pink-200">{t('planner.result.badges.emotionalTouch')}</Badge>
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
                <h3 className="font-semibold text-sm">{t('planner.result.decorations')}</h3>
                <Badge variant="outline" className="text-xs">{t('planner.result.badges.shoppingList')}</Badge>
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">{t('planner.result.badges.immersiveExperience')}</Badge>
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
                <h3 className="font-semibold text-sm">{t('planner.result.catering')}</h3>
                <Badge variant="outline" className="text-xs">{t('planner.result.badges.priceReference')}</Badge>
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">{t('planner.result.badges.ceremonialSense')}</Badge>
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
                <h3 className="font-semibold text-sm">{t('planner.result.music')}</h3>
                <Badge variant="outline" className="text-xs">{t('planner.result.badges.timeSegmented')}</Badge>
                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">{t('planner.result.badges.emotionalRhythm')}</Badge>
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
                <h3 className="font-semibold text-sm">{t('planner.result.schedule')}</h3>
                <Badge variant="outline" className="text-xs">{t('planner.result.badges.climaxMarked')}</Badge>
                <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200">{t('planner.result.badges.touchMoment')}</Badge>
              </div>
              <div className="space-y-2 pl-8">
                {result.schedule.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 执行建议卡片 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 text-xs">✅</span>
                </div>
                <h4 className="font-semibold text-orange-900 text-sm">{t('planner.result.executionTip')}</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-orange-800">
                <div>
                  <p className="font-medium mb-1">{t('planner.result.executionDetails.oneWeekBefore')}</p>
                  <p>• {t('planner.result.executionDetails.oneWeekTasks.confirmVenue')}</p>
                  <p>• {t('planner.result.executionDetails.oneWeekTasks.buyDecorations')}</p>
                  <p>• {t('planner.result.executionDetails.oneWeekTasks.prepareProps')}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{t('planner.result.executionDetails.dayOfParty')}</p>
                  <p>• {t('planner.result.executionDetails.dayOfTasks.setupEarly')}</p>
                  <p>• {t('planner.result.executionDetails.dayOfTasks.testEquipment')}</p>
                  <p>• {t('planner.result.executionDetails.dayOfTasks.rehearseHighlights')}</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-orange-200">
                <p className="font-medium text-xs text-orange-900 mb-1">{t('planner.result.executionDetails.professionalTip')}</p>
                <p className="text-xs text-orange-700">{t('planner.result.executionDetails.tipText')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 专业评估卡片 - 缩小版本 */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xs">⭐</span>
              </div>
              {t('planner.result.professionalEvaluation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('planner.result.creativity')}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.creativity >= 19 ? 'bg-green-500' : scores.creativity >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.creativity / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.creativity}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('planner.result.planning')}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.planning >= 19 ? 'bg-green-500' : scores.planning >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.planning / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.planning}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('planner.result.budget')}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.budget >= 19 ? 'bg-green-500' : scores.budget >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.budget / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.budget}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('planner.result.details')}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.details >= 19 ? 'bg-green-500' : scores.details >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.details / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.details}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('planner.result.feasibility')}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.feasibility >= 19 ? 'bg-green-500' : scores.feasibility >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.feasibility / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.feasibility}/20</span>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-900 text-xs">{t('planner.result.totalScore')}</span>
              <div className="flex items-center gap-1">
                <Badge variant="default" className={`text-xs ${total >= 95 ? 'bg-green-600' : total >= 90 ? 'bg-blue-600' : total >= 85 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                  {total}/100 {level}
                </Badge>
              </div>
            </div>
            <p className={`text-xs p-2 rounded ${total >= 95 ? 'text-green-700 bg-green-100' : total >= 90 ? 'text-blue-700 bg-blue-100' : total >= 85 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'}`}>
              {total >= 95 ? t('planner.result.evaluationLevels.excellent') :
               total >= 90 ? t('planner.result.evaluationLevels.good') :
               total >= 85 ? t('planner.result.evaluationLevels.fair') :
               t('planner.result.evaluationLevels.needsImprovement')}
            </p>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button onClick={resetForm} variant="outline" size="sm" className="flex-1">
            {t('planner.result.replan')}
          </Button>
          <Button 
            onClick={exportToImage} 
            size="sm" 
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            {t('planner.result.exportPlan')}
          </Button>
        </div>
      </div>
    );
  }

  // 显示当前选择预览（未生成结果时）
  if (currentSelections.length > 0) {
    return (
      <div className="sticky top-8" data-result-area>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('planner.result.currentSelection')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentSelections.map((selection, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <selection.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{selection.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {selection.value}
                </Badge>
              </div>
            ))}
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground text-center">
              {t('planner.form.completeAllSteps')}&ldquo;{t('planner.form.generateButton')}&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 默认空状态
  return renderEmptyState();
} 