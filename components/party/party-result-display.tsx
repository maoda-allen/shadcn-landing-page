"use client";

import { useParty } from '@/lib/contexts/party-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { Loader2, MapPin, Users, Calendar, Palette, Music, Utensils, Clock, Sparkles, FileText, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

// 动态评估函数
const calculateProfessionalScore = (formData: any, result: any) => {
  let scores = {
    creativity: 18, // 创意与主题契合度 (基础分18)
    planning: 18,   // 流程安排合理性 (基础分18)
    budget: 18,     // 预算控制与性价比 (基础分18)
    details: 18,    // 细节打磨与氛围营造 (基础分18)
    feasibility: 18 // 执行可行性 (基础分18)
  };

  // 根据主题创意程度加分
  if (formData.theme && formData.theme.length > 5) {
    scores.creativity += 2;
  }
  
  // 根据方案内容丰富度加分
  if (result) {
    const totalItems = Object.values(result).flat().length;
    if (totalItems > 20) scores.details += 2;
    if (totalItems > 25) scores.planning += 2;
    
    // 检查是否包含情绪触达关键词
    const allContent = Object.values(result).flat().join(' ');
    const emotionKeywords = ['回忆', '感动', '惊喜', '许愿', '祝福', '感恩', '时光', '纪念', '心愿', '温馨'];
    const climaxKeywords = ['高潮', '引爆', '沸腾', '互动', '抽奖', '游戏', '挑战', '竞赛', '表演'];
    
    const emotionCount = emotionKeywords.filter(keyword => allContent.includes(keyword)).length;
    const climaxCount = climaxKeywords.filter(keyword => allContent.includes(keyword)).length;
    
    if (emotionCount >= 3) scores.creativity += 2;
    if (climaxCount >= 2) scores.feasibility += 2;
  }

  // 根据预算类型调整预算分数
  if (formData.budget === 'high') {
    scores.budget += 2;
  } else if (formData.budget === 'medium') {
    scores.budget += 1;
  }

  // 根据场地类型调整可行性分数
  if (formData.venue === 'indoor') {
    scores.feasibility += 1; // 室内更容易执行
  }

  // 根据人数规模调整规划分数
  if (formData.guestCount === 'small') {
    scores.planning += 1; // 小型聚会更容易规划
    scores.feasibility += 1;
  } else if (formData.guestCount === 'large') {
    scores.creativity += 1; // 大型聚会更有创意空间
  }

  // 根据氛围类型调整分数
  if (formData.atmosphere === 'lively') {
    scores.creativity += 1; // 热闹氛围更有创意
  } else if (formData.atmosphere === 'intimate') {
    scores.details += 1; // 私密氛围更注重细节
  }

  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  const level = total >= 95 ? '优秀级别' : 
               total >= 90 ? '良好级别' : 
               total >= 85 ? '合格级别' : '待优化';

  return { scores, total, level };
};

export function PartyResultDisplay() {
  const { state, resetForm } = useParty();
  const { formData, result, isLoading, error } = state;
  const exportRef = useRef<HTMLDivElement>(null);

  // 获取选项文本的辅助函数
  const getPartyTypeText = (type: string) => {
    const types = { adult: '成人生日', child: '儿童生日', elderly: '长辈生日' };
    return types[type as keyof typeof types] || type;
  };

  const getGuestCountText = (count: string) => {
    const counts = { small: '10人以内', medium: '10-30人', large: '30人以上' };
    return counts[count as keyof typeof counts] || count;
  };

  const getVenueText = (venue: string) => {
    const venues = { indoor: '室内场地', outdoor: '户外场地' };
    return venues[venue as keyof typeof venues] || venue;
  };

  const getBudgetText = (budget: string) => {
    const budgets = { low: '经济型', medium: '中档型', high: '豪华型' };
    return budgets[budget as keyof typeof budgets] || budget;
  };

  const getAtmosphereText = (atmosphere: string) => {
    const atmospheres = {
      lively: '热闹欢快',
      elegant: '优雅温馨',
      casual: '轻松随意',
      formal: '正式庄重',
      creative: '创意互动',
      intimate: '温馨私密'
    };
    return atmospheres[atmosphere as keyof typeof atmospheres] || atmosphere;
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
          <h1 style="color: #f97316; font-size: 28px; font-weight: bold; margin: 0 0 10px 0;">🎉 专属生日派对方案</h1>
          <p style="color: #666; font-size: 16px; margin: 0;">由生日派对策划平台为您定制 | 专业策划师出品</p>
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; font-size: 14px; font-weight: bold;">
            ⭐ 专业评分：${level} (${total}/100)
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #ea580c; font-size: 18px; margin: 0 0 15px 0;">📋 您的选择</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            ${formData.partyType ? `<div><strong>派对类型：</strong>${getPartyTypeText(formData.partyType)}</div>` : ''}
            ${formData.guestCount ? `<div><strong>参与人数：</strong>${getGuestCountText(formData.guestCount)}</div>` : ''}
            ${formData.venue ? `<div><strong>场地类型：</strong>${getVenueText(formData.venue)}</div>` : ''}
            ${formData.budget ? `<div><strong>预算范围：</strong>${getBudgetText(formData.budget)}</div>` : ''}
            ${formData.theme ? `<div><strong>派对主题：</strong>${formData.theme}</div>` : ''}
            ${formData.atmosphere ? `<div><strong>派对氛围：</strong>${getAtmosphereText(formData.atmosphere)}</div>` : ''}
          </div>
        </div>

        <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
          <h3 style="color: #0369a1; font-size: 16px; margin: 0 0 10px 0;">💡 策划师贴心提醒</h3>
          <div style="font-size: 13px; color: #374151; line-height: 1.5;">
            <div style="margin-bottom: 5px;">• 建议提前2-3周开始准备，确保所有物品到位</div>
            <div style="margin-bottom: 5px;">• 预算包含装饰、餐饮、活动道具等，可根据实际情况调整</div>
            <div>• 天气变化请准备备用方案，室内外场地都要考虑</div>
          </div>
        </div>

        ${generateSectionHTML('🏠 场地布置', result.venue)}
        ${generateSectionHTML('🎮 活动安排', result.activities)}
        ${generateSectionHTML('🎨 装饰方案', result.decorations)}
        ${generateSectionHTML('🍰 餐饮建议', result.catering)}
        ${generateSectionHTML('🎵 音乐氛围', result.music)}
        ${generateSectionHTML('⏰ 时间安排', result.schedule)}
        
        <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 15px; margin-top: 25px;">
          <h3 style="color: #16a34a; font-size: 16px; margin: 0 0 12px 0;">⭐ 专业评估</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">创意与主题契合度</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.creativity}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">流程安排合理性</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.planning}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">预算控制与性价比</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.budget}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">细节打磨与氛围营造</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.details}/20</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
              <span style="color: #374151;">执行可行性</span>
              <span style="color: #16a34a; font-weight: bold;">${scores.feasibility}/20</span>
            </div>
          </div>
          <div style="text-align: center; padding: 8px; background: #dcfce7; border-radius: 8px;">
            <span style="color: #16a34a; font-size: 14px; font-weight: bold;">总体评分：${total}/100 ${level}</span>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%); padding: 20px; border-radius: 12px; margin-top: 25px;">
          <h3 style="color: #ea580c; font-size: 16px; margin: 0 0 15px 0;">✅ 执行清单</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13px;">
            <div>
              <strong style="color: #ea580c;">提前1周：</strong><br>
              • 确认场地和人数<br>
              • 采购装饰用品<br>
              • 预定餐饮食材
            </div>
            <div>
              <strong style="color: #ea580c;">当天准备：</strong><br>
              • 提前2小时布置现场<br>
              • 调试音响设备<br>
              • 准备活动道具
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #fed7aa;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">生成时间：${new Date().toLocaleString('zh-CN')} | 方案编号：${Date.now().toString().slice(-6)}</p>
          <p style="color: #f97316; font-size: 14px; font-weight: bold; margin: 5px 0 0 0;">🎂 生日派对策划平台 - 让每个生日都独一无二</p>
          <p style="color: #9ca3af; font-size: 11px; margin: 5px 0 0 0;">专业策划 • 贴心服务 • 完美体验</p>
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
      link.download = `生日派对方案_${formData.theme || '定制'}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    }
  };

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
        lively: '热闹欢快',
        elegant: '优雅温馨',
        casual: '轻松随意',
        formal: '正式庄重',
        creative: '创意互动',
        intimate: '温馨私密'
      };
      selections.push({ 
        label: '派对氛围', 
        value: atmosphereMap[formData.atmosphere as keyof typeof atmosphereMap] || formData.atmosphere,
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
    const { scores, total, level } = calculateProfessionalScore(formData, result);

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
                <p className="text-sm text-muted-foreground font-normal">个性化定制完成 • 专业评分：${level}</p>
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
                <h4 className="font-semibold text-blue-900 text-sm">策划师贴心提醒</h4>
              </div>
              <div className="text-xs text-blue-800 space-y-1">
                <p>• 方案中已包含预算参考，可根据实际情况调整</p>
                <p>• 建议提前2-3周开始准备，确保效果最佳</p>
              </div>
            </div>

            {/* 场地布置 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">场地布置</h3>
                <Badge variant="outline" className="text-xs">含预算参考</Badge>
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
                <h3 className="font-semibold text-sm">活动安排</h3>
                <Badge variant="outline" className="text-xs">含高潮引爆</Badge>
                <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700 border-pink-200">情绪触达</Badge>
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
                <Badge variant="outline" className="text-xs">含采购清单</Badge>
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">沉浸体验</Badge>
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
                <Badge variant="outline" className="text-xs">含价格参考</Badge>
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">仪式感</Badge>
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
                <Badge variant="outline" className="text-xs">按时间段</Badge>
                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">情绪节奏</Badge>
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
                <Badge variant="outline" className="text-xs">含高潮标注</Badge>
                <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200">触达时刻</Badge>
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
                <h4 className="font-semibold text-orange-900 text-sm">执行要点</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-orange-800">
                <div>
                  <p className="font-medium mb-1">提前1周：</p>
                  <p>• 确认场地和人数</p>
                  <p>• 采购装饰用品</p>
                  <p>• 准备情绪触达道具</p>
                </div>
                <div>
                  <p className="font-medium mb-1">当天准备：</p>
                  <p>• 提前2小时布置</p>
                  <p>• 调试音响设备</p>
                  <p>• 预演高潮环节</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-orange-200">
                <p className="font-medium text-xs text-orange-900 mb-1">💡 专业提醒：</p>
                <p className="text-xs text-orange-700">高潮引爆时刻需要主持人引导，情绪触达环节要控制好节奏，避免过于煽情。</p>
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
              专业评估
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">创意与主题契合度</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.creativity >= 19 ? 'bg-green-500' : scores.creativity >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.creativity / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.creativity}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">流程安排合理性</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.planning >= 19 ? 'bg-green-500' : scores.planning >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.planning / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.planning}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">预算控制与性价比</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.budget >= 19 ? 'bg-green-500' : scores.budget >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.budget / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.budget}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">细节打磨与氛围营造</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scores.details >= 19 ? 'bg-green-500' : scores.details >= 18 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${(scores.details / 20) * 100}%`}}></div>
                  </div>
                  <span className="text-xs font-medium w-8">{scores.details}/20</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">执行可行性</span>
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
              <span className="font-semibold text-green-900 text-xs">总体评分</span>
              <div className="flex items-center gap-1">
                <Badge variant="default" className={`text-xs ${total >= 95 ? 'bg-green-600' : total >= 90 ? 'bg-blue-600' : total >= 85 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                  {total}/100 {level}
                </Badge>
              </div>
            </div>
            <p className={`text-xs p-2 rounded ${total >= 95 ? 'text-green-700 bg-green-100' : total >= 90 ? 'text-blue-700 bg-blue-100' : total >= 85 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'}`}>
              {total >= 95 ? '🎉 恭喜！您的方案达到了专业策划师标准，具备完整的执行可行性和出色的用户体验设计。' :
               total >= 90 ? '👍 很好！您的方案整体质量良好，在细节方面还有提升空间。' :
               total >= 85 ? '✅ 合格！基本满足派对需求，建议在创意和执行细节上进一步优化。' :
               '⚠️ 建议优化！方案还需要在多个维度进行改进，以达到更好的效果。'}
            </p>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button onClick={resetForm} variant="outline" size="sm" className="flex-1">
            重新策划
          </Button>
          <Button 
            onClick={exportToImage} 
            size="sm" 
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            导出方案
          </Button>
        </div>
      </div>
    );
  }

  // 显示当前选择预览（未生成结果时）
  if (currentSelections.length > 0) {
    return (
      <div className="sticky top-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              当前选择
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
              完成所有选择后点击&ldquo;生成专属派对方案&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 默认空状态
  return renderEmptyState();
} 