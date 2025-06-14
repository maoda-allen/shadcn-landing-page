import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "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",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partyType, guestCount, venue, budget, theme, atmosphere } = body;

    console.log('收到请求参数:', { partyType, guestCount, venue, budget, theme, atmosphere });

    // 直接返回模拟数据，跳过API调用
    console.log('直接返回模拟数据...');
    
    const mockData = {
      venue: [
        `入口迎宾区设置签到台和拍照背景墙（预算300-500元），引导宾客有序进入主题${theme}的温馨空间`,
        `主活动区域采用圆桌布局，便于互动交流，预留中央表演空间（桌椅租赁500-800元）`,
        `设置专门的礼品展示区和生日蛋糕台，营造仪式感（装饰用品200-400元）`,
        `${venue === 'outdoor' ? '户外场地需准备遮阳棚或暖气设备' : '室内场地确保通风和温度适宜'}，确保宾客舒适度（设备租赁400-600元）`
      ],
      activities: [
        `开场破冰游戏"生日知多少"，让宾客分享与寿星的美好回忆，营造温馨氛围（道具费用50-100元）`,
        `高潮引爆时刻：集体生日祝福视频播放+惊喜礼物揭晓，全场一起倒数点蜡烛（制作费用200-300元）`,
        `情绪触达环节：设置"时光胶囊"，每位宾客写下祝福语投入胶囊，约定明年生日开启（材料费用100-150元）`,
        `互动抽奖环节，准备精美小礼品，让每位宾客都有参与感和收获感（礼品预算300-500元）`
      ],
      decorations: [
        `主题色彩以${theme}风格为主，气球拉花布置全场（装饰用品预算400-600元）`,
        `制作个性化生日横幅和照片墙，展示寿星成长历程（制作费用200-350元）`,
        `餐桌装饰使用鲜花和蜡烛，营造${atmosphere === 'elegant' ? '优雅' : '温馨'}氛围（鲜花预算300-500元）`,
        `准备主题拍照道具箱，包含有趣的帽子、眼镜、标语牌等（道具费用150-250元）`
      ],
      catering: [
        `生日蛋糕选择多层设计，融入${theme}主题元素（蛋糕预算${budget === 'high' ? '800-1200' : budget === 'medium' ? '500-800' : '300-500'}元）`,
        `准备精致茶点和小食，包含甜品台和咸味小食（餐饮预算800-1200元）`,
        `特色饮品调制，准备无酒精鸡尾酒和特色果汁（饮品预算200-400元）`,
        `考虑宾客饮食习惯，准备素食和无糖选项，体现贴心服务（额外预算100-200元）`
      ],
      music: [
        `16:00-17:00 入场时段：播放轻松愉快的背景音乐，如爵士乐和轻音乐，配合${atmosphere}氛围`,
        `17:00-18:30 互动时段：选择节奏明快的流行音乐，营造活跃氛围，适合${guestCount}规模聚会`,
        `18:30-19:00 高潮时段：播放生日歌和寿星喜爱的经典歌曲，配合仪式进行`,
        `19:00-20:00 温馨时段：选择抒情音乐和怀旧金曲，适合聊天和回忆分享`
      ],
      schedule: [
        `16:00-16:30 宾客签到入场，拍照留念，享用迎宾茶点（重点：营造温馨第一印象）`,
        `16:30-17:30 破冰互动游戏，宾客自我介绍和分享环节（高潮标注：集体游戏引爆气氛）`,
        `17:30-18:00 生日祝福视频播放，情绪触达高峰时刻（情绪触达点：感动回忆分享）`,
        `18:00-18:30 生日蛋糕仪式，许愿吹蜡烛，全场合唱生日歌（高潮标注：仪式感巅峰）`,
        `18:30-20:00 自由交流时间，抽奖活动，时光胶囊封存仪式（情绪触达点：未来约定）`
      ]
    };

    console.log('模拟数据准备完成，返回响应...');
    
    return NextResponse.json({
      success: true,
      data: mockData,
      isMockData: true,
      message: '当前使用模拟数据，AI功能正在调试中'
    });

  } catch (error) {
    console.error('API调用失败:', error);
    console.error('错误详情:', error instanceof Error ? error.message : '未知错误');
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    
    return NextResponse.json(
      { 
        success: false, 
        error: '生成派对方案时出现错误，请稍后重试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// 辅助函数：将文本响应转换为结构化数据
function parseResponseToStructure(text: string) {
  const sections = {
    venue: [] as string[],
    activities: [] as string[],
    decorations: [] as string[],
    catering: [] as string[],
    music: [] as string[],
    schedule: [] as string[]
  };

  // 简单的文本解析逻辑
  const lines = text.split('\n').filter(line => line.trim());
  let currentSection = '';
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.includes('场地布置') || trimmed.includes('venue')) {
      currentSection = 'venue';
    } else if (trimmed.includes('活动安排') || trimmed.includes('activities')) {
      currentSection = 'activities';
    } else if (trimmed.includes('装饰方案') || trimmed.includes('decorations')) {
      currentSection = 'decorations';
    } else if (trimmed.includes('餐饮建议') || trimmed.includes('catering')) {
      currentSection = 'catering';
    } else if (trimmed.includes('音乐氛围') || trimmed.includes('music')) {
      currentSection = 'music';
    } else if (trimmed.includes('时间安排') || trimmed.includes('schedule')) {
      currentSection = 'schedule';
    } else if (currentSection && (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.match(/^\d+\./))) {
      const content = trimmed.replace(/^[-•*\d.]\s*/, '').trim();
      if (content && sections[currentSection as keyof typeof sections].length < 5) {
        sections[currentSection as keyof typeof sections].push(content);
      }
    }
  });

  // 确保每个部分至少有一些内容
  Object.keys(sections).forEach(key => {
    if (sections[key as keyof typeof sections].length === 0) {
      sections[key as keyof typeof sections] = ['正在为您定制专属建议...'];
    }
  });

  return sections;
}

// 辅助函数：清理文本中的格式化符号
function cleanText(text: string): string {
  return text
    .replace(/^\*+\s*/, '') // 去掉开头的星号
    .replace(/\*+\s*$/, '') // 去掉结尾的星号
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 去掉粗体标记 **text**
    .replace(/^\-+\s*/, '') // 去掉开头的横线
    .replace(/^•\s*/, '')   // 去掉开头的圆点
    .replace(/^\d+\.\s*/, '') // 去掉开头的数字序号
    .replace(/：\*\*\s*/, '：') // 去掉冒号后的星号
    .replace(/\*\*\s*/, '') // 去掉其他星号
    .trim();
}

// 辅助函数：转换选项为中文描述
function getPartyTypeText(type: string): string {
  const types = {
    'child': '儿童生日派对（3-12岁）',
    'adult': '成人生日聚会（18-50岁）',
    'elderly': '长辈生日庆典（50岁以上）'
  };
  return types[type as keyof typeof types] || type;
}

function getGuestCountText(count: string): string {
  const counts = {
    'small': '小型聚会（10人以内）',
    'medium': '中型聚会（10-30人）',
    'large': '大型聚会（30人以上）'
  };
  return counts[count as keyof typeof counts] || count;
}

function getVenueText(venue: string): string {
  const venues = {
    'indoor': '室内场地（家中、餐厅、会所等）',
    'outdoor': '户外场地（公园、花园、海滩等）'
  };
  return venues[venue as keyof typeof venues] || venue;
}

function getBudgetText(budget: string): string {
  const budgets = {
    'low': '经济型（500-1500元）',
    'medium': '中档型（1500-5000元）',
    'high': '豪华型（5000元以上）'
  };
  return budgets[budget as keyof typeof budgets] || budget;
}

function getAtmosphereText(atmosphere: string): string {
  const atmospheres = {
    'lively': '热闹欢快（音乐、游戏、互动）',
    'elegant': '优雅温馨（轻音乐、聊天、品茶）',
    'casual': '轻松随意（自由活动、简单聚餐）',
    'formal': '正式庄重（仪式感、致辞、合影）',
    'creative': '创意互动（DIY活动、主题游戏）',
    'intimate': '温馨私密（小范围、深度交流）'
  };
  return atmospheres[atmosphere as keyof typeof atmospheres] || atmosphere;
} 