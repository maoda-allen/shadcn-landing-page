import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 只从环境变量获取API密钥，不再硬编码
const API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// 验证API密钥是否存在和格式是否正确
if (!API_KEY) {
  console.error('❌ 未设置OPENROUTER_API_KEY环境变量');
  console.error('请在.env.local文件中设置您的API密钥');
} else if (!API_KEY.startsWith('sk-or-v1-')) {
  console.error('❌ API密钥格式错误，应以sk-or-v1-开头');
  // 安全修复：不再输出API密钥的任何部分
  console.error('当前密钥格式不正确，请检查是否以sk-or-v1-开头');
} else {
  console.log('✅ API密钥配置正确');
}

const client = API_KEY ? new OpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
}) : null;

// 新增：动态标签映射 - 使用更详细的文化内涵描述
const DYNAMIC_TAGS_MAP: Record<string, Record<string, { label: string; description: string; gender: string }>> = {
  '0-3': {
    'first-birthday': { 
      label: 'First Birthday', 
      description: 'Baby\'s first major birthday milestone, American parents often hold parties and take "Smash Cake" photos for commemoration', 
      gender: 'all' 
    },
    'second-birthday': { 
      label: 'Second Birthday', 
      description: 'Baby enters language and social sensitive period, starts participating in simple game parties', 
      gender: 'all' 
    },
    'third-birthday': { 
      label: 'Third Birthday', 
      description: 'Enhanced expression ability, many parents first hold themed parties (animated characters, color themes, etc.)', 
      gender: 'all' 
    }
  },
  '4-17': {
    'starting-school': { 
      label: 'Starting School', 
      description: '5th birthday - growth milestone before entering elementary school, parents express encouragement and blessings', 
      gender: 'all' 
    },
    'big-kid': { 
      label: 'Big Kid', 
      description: '7th birthday - "little adult" stage, children\'s self-awareness strengthens, a transition period parents love to celebrate', 
      gender: 'all' 
    },
    'double-digits': { 
      label: 'Double Digits', 
      description: '10th birthday - age first enters "double digits", American kids particularly care about it, often seen as important turning point', 
      gender: 'all' 
    },
    'teenager': { 
      label: 'Teenager', 
      description: '13th birthday - officially becoming a teenager, symbol of growth, very important to both American parents and children', 
      gender: 'all' 
    },
    'quinceanera': { 
      label: 'Quinceañera', 
      description: '15th birthday - important coming-of-age ceremony for Latina girls, usually involves grand ball ceremony', 
      gender: 'female' 
    },
    'sweet-sixteen': { 
      label: 'Sweet Sixteen', 
      description: '16th birthday - especially for girls, extremely formal youth celebration in American culture', 
      gender: 'all' 
    }
  },
  '18-59': {
    'adult': { 
      label: 'Adult', 
      description: '18th birthday - legal adulthood, symbolizing independence, responsibility and social identity change', 
      gender: 'all' 
    },
    'drinking-age': { 
      label: 'Drinking Age', 
      description: '21st birthday - legal drinking age, one of the most anticipated birthdays for American young people, friend gatherings extremely common', 
      gender: 'all' 
    },
    'big-30': { 
      label: 'Big 3-0', 
      description: '30th birthday - farewell to "twenties", entering mature life stage, often celebrated with "Flirty Thirty" humor', 
      gender: 'all' 
    },
    'over-the-hill': { 
      label: 'Over the Hill', 
      description: '40th birthday - "life beyond the hill" humorous saying, often featuring quirky or satirical style parties', 
      gender: 'all' 
    },
    'golden-50': { 
      label: 'Golden 50', 
      description: '50th birthday - golden middle-age milestone, family and friends hold large celebrations summarizing life stages', 
      gender: 'all' 
    }
  },
  '60+': {
    'senior-start': { 
      label: 'Senior Start', 
      description: '60th birthday - officially entering "senior stage", warm family celebrations are common', 
      gender: 'all' 
    },
    'retirement': { 
      label: 'Retirement', 
      description: '65th birthday - retirement age for most people, milestone from work life to life living', 
      gender: 'all' 
    },
    'celebrating-life': { 
      label: 'Celebrating Life', 
      description: '70th birthday - emphasizing health, family, memories, important milestone when elders willingly review their lives', 
      gender: 'all' 
    },
    'big-80': { 
      label: 'Big 8-0', 
      description: '80th birthday - symbol of longevity, usually a birthday banquet celebration planned by the whole family', 
      gender: 'all' 
    },
    'legacy-birthday': { 
      label: 'Legacy Birthday', 
      description: '90+ birthday - advanced age, celebrating elder\'s wisdom and family heritage, with extremely high emotional value', 
      gender: 'all' 
    }
  }
};

// 中文动态标签映射 - 使用更详细的文化内涵描述
const DYNAMIC_TAGS_MAP_ZH: Record<string, Record<string, { label: string; description: string; gender: string }>> = {
  '0-3': {
    'first-birthday': { 
      label: '第一个生日', 
      description: '宝宝人生第一个重要生日，美国家长常举办派对并拍"Smash Cake"照片纪念', 
      gender: 'all' 
    },
    'second-birthday': { 
      label: '第二个生日', 
      description: '宝宝进入语言与社交敏感期，开始参与简单的游戏派对', 
      gender: 'all' 
    },
    'third-birthday': { 
      label: '第三个生日', 
      description: '表达能力增强，很多父母会首次举办主题化派对（如动画角色、色彩主题等）', 
      gender: 'all' 
    }
  },
  '4-17': {
    'starting-school': { 
      label: '入学年龄', 
      description: '进入小学前的成长节点，家长会借此表达鼓励与祝福', 
      gender: 'all' 
    },
    'big-kid': { 
      label: '大孩子', 
      description: '"小大人"阶段，孩子自我意识增强，是家长喜欢庆祝的转变期', 
      gender: 'all' 
    },
    'double-digits': { 
      label: '双位数', 
      description: '年龄首次进入"两位数"，美国孩子特别在意，常被视为重要转折点', 
      gender: 'all' 
    },
    'teenager': { 
      label: '青少年', 
      description: '正式成为Teenager，是成长的象征，美国家长和孩子都非常重视', 
      gender: 'all' 
    },
    'quinceanera': { 
      label: '成人礼', 
      description: '拉丁裔女孩的重要成人礼，通常会举行隆重的舞会仪式', 
      gender: 'female' 
    },
    'sweet-sixteen': { 
      label: '甜蜜十六岁', 
      description: '尤其对女孩而言，是美国文化中极其具有仪式感的青春庆典', 
      gender: 'all' 
    }
  },
  '18-59': {
    'adult': { 
      label: '成年人', 
      description: '法定成年，象征独立、责任与社会身份的变化', 
      gender: 'all' 
    },
    'drinking-age': { 
      label: '饮酒年龄', 
      description: '合法饮酒年龄，美国年轻人最期待的生日之一，朋友聚会极为常见', 
      gender: 'all' 
    },
    'big-30': { 
      label: '三十而立', 
      description: '告别"二十代"，进入成熟生活阶段，常用"Flirty Thirty"调侃庆祝', 
      gender: 'all' 
    },
    'over-the-hill': { 
      label: '不惑之年', 
      description: '"山那边的人生"幽默说法，常举办搞怪或诙谐风格派对', 
      gender: 'all' 
    },
    'golden-50': { 
      label: '金色五十', 
      description: '人生的黄金中年节点，家人朋友会举办大型庆祝总结人生阶段', 
      gender: 'all' 
    }
  },
  '60+': {
    'senior-start': { 
      label: '花甲之年', 
      description: '正式跨入"敬老阶段"，家庭温馨庆祝常见', 
      gender: 'all' 
    },
    'retirement': { 
      label: '退休庆典', 
      description: '多数人退休的年龄，是从工作人生转向生活人生的节点', 
      gender: 'all' 
    },
    'celebrating-life': { 
      label: '庆祝人生', 
      description: '强调健康、家庭、回忆，是长辈愿意回顾人生的重要节点', 
      gender: 'all' 
    },
    'big-80': { 
      label: '八十大寿', 
      description: '高寿的象征，通常为全家人共同策划的寿宴庆典', 
      gender: 'all' 
    },
    'legacy-birthday': { 
      label: '传承生日', 
      description: '高龄高寿，庆祝长老的智慧与家族传承，具有极高情感价值', 
      gender: 'all' 
    }
  }
};

// 动态标签描述函数 - 优化以突出文化意义
function getDynamicTagsDescription(ageGroup: string, dynamicTags: string[], language: string = 'en'): string {
  if (!dynamicTags || dynamicTags.length === 0) {
    return language === 'en' ? 'No specific milestones selected' : '未选择特殊里程碑';
  }

  const tagMap = language === 'en' ? DYNAMIC_TAGS_MAP : DYNAMIC_TAGS_MAP_ZH;
  const descriptions = dynamicTags.map(tagId => {
    const tagInfo = tagMap[ageGroup]?.[tagId];
    if (tagInfo) {
      // 突出显示里程碑的文化意义
      return `**${tagInfo.label}** (${tagInfo.description})`;
    }
    return tagId;
  });

  const prefix = language === 'en' ? 'Special Cultural Milestones: ' : '特殊文化里程碑：';
  return prefix + descriptions.join(' | ');
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API路由开始处理请求...');
    console.log('🔑 API密钥状态:', API_KEY ? '已配置' : '未配置');
    console.log('🌐 BASE_URL:', BASE_URL);
    
    const body = await request.json();
    console.log('📦 请求体内容:', JSON.stringify(body, null, 2));
    
    const { 
      partyType, 
      ageGroup, 
      gender, 
      dynamicTags, 
      guestCount, 
      venue, 
      budget, 
      theme, 
      atmosphere, 
      language = 'en' 
    } = body;

    console.log('🚀 收到请求参数:', { 
      partyType, 
      ageGroup, 
      gender, 
      dynamicTags, 
      guestCount, 
      venue, 
      budget, 
      theme, 
      atmosphere, 
      language 
    });
    
    // 验证必需参数
    if (!partyType || !guestCount || !venue || !budget || !theme || !atmosphere) {
      console.log('❌ 请求参数不完整:', { partyType, guestCount, venue, budget, theme, atmosphere });
      return NextResponse.json(
        { 
          success: false, 
          error: language === 'en' ? 'Missing required parameters' : '缺少必需参数',
          details: '请求参数不完整'
        },
        { status: 400 }
      );
    }
    
    // 检查API密钥是否配置
    if (!API_KEY || !client) {
      console.log('❌ API密钥未配置');
      return NextResponse.json(
        { 
          success: false, 
          error: language === 'en' ? 'API key not configured. Please set OPENROUTER_API_KEY in .env.local file.' : 'API密钥未配置，请在.env.local文件中设置OPENROUTER_API_KEY。',
          details: 'OPENROUTER_API_KEY环境变量未设置'
        },
        { status: 500 }
      );
    }

    console.log('🔑 使用环境变量中的API密钥');
    console.log('🌐 API基础URL:', BASE_URL);

    // 根据语言生成不同的提示词，现在包含所有详细信息
    const prompt = language === 'en' 
      ? getEnglishPrompt(partyType, ageGroup, gender, dynamicTags, guestCount, venue, budget, theme, atmosphere) 
      : getChinesePrompt(partyType, ageGroup, gender, dynamicTags, guestCount, venue, budget, theme, atmosphere);

    console.log('开始调用OpenRouter AI...');
    console.log('请求URL:', 'https://openrouter.ai/api/v1/chat/completions');

    try {
      // 发送正式的生成请求
      console.log('📝 发送派对方案生成请求...');
      
      const completion = await client.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      console.log('🎉 AI调用成功，开始处理响应...');
      const responseText = completion.choices[0].message.content;
      console.log('原始响应长度:', responseText?.length);
      console.log('原始响应前500字符:', responseText?.substring(0, 500));
      
      // 尝试解析JSON响应
      let partyPlan: any;
      try {
        // 改进的JSON提取逻辑，处理Markdown格式
        let jsonString = responseText || '';
        
        // 移除可能的markdown标记
        jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
        
        // 尝试提取JSON部分
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch && jsonMatch[0]) {
          jsonString = jsonMatch[0];
        }
        
        console.log('清理后的JSON字符串长度:', jsonString.length);
        console.log('清理后的JSON字符串前200字符:', jsonString.substring(0, 200));
        
        partyPlan = JSON.parse(jsonString);
        console.log('✅ JSON解析成功，数据结构:', Object.keys(partyPlan));
        
        // 验证数据结构完整性
        const requiredKeys = ['venue', 'activities', 'decorations', 'catering', 'music', 'schedule'];
        const missingKeys = requiredKeys.filter(key => !partyPlan[key] || !Array.isArray(partyPlan[key]));
        
        if (missingKeys.length > 0) {
          console.log('⚠️ 缺少必要字段:', missingKeys);
          throw new Error(`缺少必要字段: ${missingKeys.join(', ')}`);
        }
        
        // 清理每个建议中的格式化符号
        Object.keys(partyPlan).forEach(key => {
          if (Array.isArray(partyPlan[key])) {
            partyPlan[key] = partyPlan[key].map((item: string) => cleanText(item));
          }
        });
        console.log('✅ 数据清理完成');
        
      } catch (parseError) {
        console.error('❌ JSON解析失败:', parseError);
        console.log('🔄 使用备用解析方法...');
        partyPlan = parseResponseToStructure(responseText || '', language);
        console.log('✅ 备用解析完成，数据结构:', Object.keys(partyPlan));
      }

      console.log('🎊 AI生成成功，返回高质量响应...');
      return NextResponse.json({
        success: true,
        plan: partyPlan,
        source: 'ai',
        message: language === 'en' ? 'Professional planner AI plan generated successfully' : '专业策划师AI方案生成成功'
      });

    } catch (apiError: any) {
      console.error('OpenRouter API调用失败:', apiError);
      console.error('错误状态码:', apiError.status);
      console.error('错误消息:', apiError.message);
      console.error('错误详情:', apiError.error);
      
      // 检查是否是认证错误
      if (apiError.status === 401) {
        console.log('❌ 认证失败 - API密钥可能有问题');
        return NextResponse.json(
          { 
            success: false, 
            error: language === 'en' ? 'API authentication failed. Please check your API key.' : 'API认证失败，请检查您的API密钥。',
            details: 'API密钥无效或已过期'
          },
          { status: 401 }
        );
      }
      
      if (apiError.status === 402) {
        console.log('❌ 余额不足');
        return NextResponse.json(
          { 
            success: false, 
            error: language === 'en' ? 'Insufficient account balance. Please recharge your account.' : '账户余额不足，请充值您的账户。',
            details: '账户余额不足'
          },
          { status: 402 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: language === 'en' ? 'AI service call failed. Please try again later.' : 'AI服务调用失败，请稍后重试。',
          details: apiError.message || '未知API错误'
        },
        { status: 500 }
      );
    }

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
function parseResponseToStructure(text: string, language: string = 'en') {
  console.log('🔄 开始备用解析，原始文本长度:', text.length);
  
  const sections = {
    venue: [] as string[],
    activities: [] as string[],
    decorations: [] as string[],
    catering: [] as string[],
    music: [] as string[],
    schedule: [] as string[]
  };

  // 清理文本，移除markdown标记
  let cleanedText = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*$/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1'); // 移除粗体标记

  // 尝试从JSON字符串中提取数据
  try {
    // 查找JSON对象
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      console.log('🔍 在备用解析中找到JSON结构');
      
      // 尝试解析JSON
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        // 验证并提取数据
        Object.keys(sections).forEach(key => {
          if (parsed[key] && Array.isArray(parsed[key])) {
            sections[key as keyof typeof sections] = parsed[key].map((item: string) => 
              cleanText(item).substring(0, 500) // 限制长度避免过长
            );
          }
        });
        
        console.log('✅ 备用解析成功提取JSON数据');
        return sections;
      }
    }
  } catch (e) {
    console.log('⚠️ 备用解析中JSON提取失败，使用文本解析');
  }

  // 如果JSON解析失败，使用文本解析
  const lines = cleanedText.split('\n').filter(line => line.trim());
  let currentSection = '';
  let currentItems: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // 检测章节标题
    if (trimmed.includes('venue') || trimmed.includes('场地')) {
      if (currentSection && currentItems.length > 0) {
        sections[currentSection as keyof typeof sections] = currentItems.slice(0, 4);
      }
      currentSection = 'venue';
      currentItems = [];
    } else if (trimmed.includes('activities') || trimmed.includes('活动')) {
      if (currentSection && currentItems.length > 0) {
        sections[currentSection as keyof typeof sections] = currentItems.slice(0, 4);
      }
      currentSection = 'activities';
      currentItems = [];
    } else if (trimmed.includes('decorations') || trimmed.includes('装饰')) {
      if (currentSection && currentItems.length > 0) {
        sections[currentSection as keyof typeof sections] = currentItems.slice(0, 4);
      }
      currentSection = 'decorations';
      currentItems = [];
    } else if (trimmed.includes('catering') || trimmed.includes('餐饮')) {
      if (currentSection && currentItems.length > 0) {
        sections[currentSection as keyof typeof sections] = currentItems.slice(0, 4);
      }
      currentSection = 'catering';
      currentItems = [];
    } else if (trimmed.includes('music') || trimmed.includes('音乐')) {
      if (currentSection && currentItems.length > 0) {
        sections[currentSection as keyof typeof sections] = currentItems.slice(0, 4);
      }
      currentSection = 'music';
      currentItems = [];
    } else if (trimmed.includes('schedule') || trimmed.includes('时间')) {
      if (currentSection && currentItems.length > 0) {
        sections[currentSection as keyof typeof sections] = currentItems.slice(0, 4);
      }
      currentSection = 'schedule';
      currentItems = [];
    } else if (currentSection && trimmed.length > 10) {
      // 提取有意义的内容行
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        // 移除引号
        const content = trimmed.slice(1, -1);
        if (content.length > 10) {
          currentItems.push(cleanText(content));
        }
      } else if (trimmed.includes('：') || trimmed.includes('预算') || trimmed.includes('建议')) {
        currentItems.push(cleanText(trimmed));
      }
    }
  });
  
  // 处理最后一个章节
  if (currentSection && currentItems.length > 0) {
    sections[currentSection as keyof typeof sections] = currentItems.slice(0, 4);
  }

  // 确保每个部分都有实用的内容，而不是占位符
  Object.keys(sections).forEach(key => {
    if (sections[key as keyof typeof sections].length === 0) {
      // 根据不同类别提供实用的默认建议
      sections[key as keyof typeof sections] = getDefaultSuggestions(key, language);
    }
  });

  console.log('✅ 备用文本解析完成，各部分内容数量:', 
    Object.keys(sections).map(key => `${key}: ${sections[key as keyof typeof sections].length}`).join(', ')
  );

  return sections;
}

// 新增：提供实用的默认建议而不是占位符
function getDefaultSuggestions(category: string, language: string = 'en'): string[] {
  if (language === 'en') {
    const defaultsEn: Record<string, string[]> = {
      venue: [
        "Indoor setup: Create cozy atmosphere with warm lighting and comfortable seating arrangement",
        "Outdoor setup: Set up weather protection with tents or umbrellas, ensure power access",
        "Space planning: Designate areas for dining, activities, and photo opportunities",
        "Decoration zones: Create focal points with balloon arches and themed backdrops"
      ],
      activities: [
        "Interactive games: Organize team-building activities suitable for all ages",
        "Photo session: Set up a themed photo booth with props and good lighting",
        "Music and dancing: Create playlist for different energy levels throughout the event",
        "Memory sharing: Encourage guests to share favorite memories or wishes"
      ],
      decorations: [
        "Color scheme: Choose 2-3 coordinating colors that match the theme ($50-150)",
        "Balloons and banners: Create visual impact with balloon arrangements ($30-80)",
        "Table settings: Use themed tableware and centerpieces ($40-120)",
        "Lighting: Add string lights or candles for ambiance ($25-75)"
      ],
      catering: [
        "Main dishes: Prepare crowd-pleasing options that are easy to serve ($100-300)",
        "Birthday cake: Order or make a themed cake as the centerpiece ($50-150)",
        "Beverages: Offer variety of drinks including non-alcoholic options ($30-100)",
        "Snacks and appetizers: Provide light bites for mingling time ($40-120)"
      ],
      music: [
        "Welcome music: Play upbeat background music as guests arrive (30 minutes)",
        "Activity music: Use energetic songs for games and interactive moments (1 hour)",
        "Dining music: Switch to softer background music during meals (45 minutes)",
        "Celebration music: Play special birthday songs for cake cutting and toasts"
      ],
      schedule: [
        "Arrival and welcome (30 minutes): Greet guests, light refreshments, background music",
        "Main celebration (1-1.5 hours): Birthday ceremony, games, photo opportunities",
        "Dining time (45-60 minutes): Enjoy food, casual conversation, relaxed atmosphere",
        "Free socializing (30 minutes): Open mingling, additional activities, gift opening",
        "Farewell (15 minutes): Thank guests, group photos, goodbye wishes"
      ]
    };
    return defaultsEn[category] || ["Suggestions are being prepared for you..."];
  }

  const defaultsZh: Record<string, string[]> = {
    venue: [
      "室内布置：营造温馨氛围，合理安排座椅和活动区域，预算200-500元",
      "户外布置：准备遮阳遮雨设施，确保电源供应，考虑天气变化",
      "空间规划：划分用餐区、活动区和拍照区，确保人员流动顺畅",
      "装饰重点：设置主题背景墙和气球拱门，营造节日氛围"
    ],
    activities: [
      "互动游戏：组织适合所有年龄段的团体游戏，准备小礼品作为奖励",
      "拍照留念：设置主题拍照区，准备道具和良好的灯光效果",
      "音乐舞蹈：准备不同节奏的音乐播放列表，营造活跃氛围",
      "回忆分享：鼓励宾客分享美好回忆或祝福，增进情感交流"
    ],
    decorations: [
      "色彩搭配：选择2-3种协调的主题色彩，预算300-800元",
      "气球横幅：制作气球造型和生日横幅，营造节日气氛，预算150-400元",
      "餐桌布置：使用主题餐具和桌面装饰，预算200-600元",
      "灯光氛围：添加彩灯或蜡烛营造温馨氛围，预算100-300元"
    ],
    catering: [
      "主食安排：准备受欢迎且易于分享的食物，预算400-1200元",
      "生日蛋糕：订制或制作主题生日蛋糕作为焦点，预算200-600元",
      "饮品搭配：提供多样化饮品选择，包括无酒精选项，预算150-400元",
      "小食点心：准备精美小食供宾客交流时享用，预算200-500元"
    ],
    music: [
      "迎宾音乐：播放轻松愉快的背景音乐迎接宾客（前30分钟）",
      "活动音乐：使用节奏感强的音乐配合游戏和互动环节（1小时）",
      "用餐音乐：切换到柔和的背景音乐营造用餐氛围（45分钟）",
      "庆祝音乐：准备生日歌和祝福音乐用于切蛋糕和祝酒环节"
    ],
    schedule: [
      "迎宾时间（30分钟）：宾客到达、签到、轻松交流、背景音乐",
      "主要庆祝（1-1.5小时）：生日仪式、互动游戏、拍照留念",
      "用餐时间（45-60分钟）：享用美食、轻松聊天、温馨氛围",
      "自由交流（30分钟）：自由活动、额外游戏、礼物环节",
      "告别环节（15分钟）：感谢致辞、合影留念、温馨告别"
    ]
  };
  
  return defaultsZh[category] || ["相关建议正在为您准备中..."];
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

function getEnglishPrompt(partyType: string, ageGroup: string, gender: string, dynamicTags: string[], guestCount: string, venue: string, budget: string, theme: string, atmosphere: string) {
  const milestoneInfo = getDynamicTagsDescription(ageGroup, dynamicTags, 'en');
  const hasMilestones = dynamicTags && dynamicTags.length > 0;
  
  return `Hello! I am a professional birthday party planning consultant with 15 years of event planning experience, specializing in culturally-sensitive celebrations that honor life's important milestones. I understand the deep emotional and cultural significance of each birthday celebration, especially those marking special life transitions.

Based on the requirements you provided, I will create a detailed birthday party planning proposal for you:

📋 **Cultural Context & Requirements Analysis**
- Party Type: ${getPartyTypeTextEn(partyType)}
- Age Group: ${ageGroup}
- Gender: ${gender}
- **Cultural Milestone Context**: ${milestoneInfo}
- Number of Guests: ${getGuestCountTextEn(guestCount)}
- Venue Choice: ${getVenueTextEn(venue)}
- Budget Range: ${getBudgetTextEn(budget)}
- Theme Style: ${theme}
- Desired Atmosphere: ${getAtmosphereTextEn(atmosphere)}

${hasMilestones ? `**🎯 SPECIAL CULTURAL MILESTONE FOCUS**: 
This celebration honors a significant life transition with deep cultural meaning. Every suggestion must reflect the emotional weight, traditions, and ceremonial importance of this milestone. Consider:
- How family and community traditionally celebrate this transition
- The symbolic meaning and what it represents for the individual's life journey
- Cultural traditions and expectations associated with this milestone
- Ways to create lasting memories that honor this life stage
- Incorporating elements that acknowledge the significance of this moment**` : ''}

**IMPORTANT REQUIREMENT: Please return STRICTLY in the following JSON format with NO additional text or explanations, return the JSON object directly:**

{
  "venue": [
    "Venue suggestion 1: ${hasMilestones ? 'Milestone-appropriate venue setup honoring the cultural significance, ' : ''}Specific venue setup plan with detailed budget breakdown $30-75, including layout design and decoration techniques",
    "Venue suggestion 2: ${hasMilestones ? 'Space design that reflects the ceremonial importance, ' : ''}Alternative venue choice with specific layout design and functional area division",
    "Venue suggestion 3: ${hasMilestones ? 'Venue arrangement emphasizing the life transition theme, ' : ''}Third venue option with decoration tips and budget-friendly setup ideas",
    "Venue suggestion 4: ${hasMilestones ? 'Setting that honors family traditions and milestone meaning, ' : ''}Fourth venue recommendation with practical arrangement points and cost-effective solutions"
  ],
  "activities": [
    "Activity suggestion 1: ${hasMilestones ? 'Milestone-honoring ceremony or ritual activity recognizing the life transition, ' : ''}Design an interactive game that can mobilize full participation enthusiasm, including specific gameplay rules, required props list, and execution steps",
    "Activity suggestion 2: ${hasMilestones ? 'Memory-sharing session that celebrates the journey and looks forward to the future, ' : ''}Arrange a warm and touching emotional exchange session with detailed execution methods and timing guidance",
    "Activity suggestion 3: ${hasMilestones ? 'Traditional or symbolic activity that acknowledges the cultural significance, ' : ''}Third activity plan specifically suitable for ${getPartyTypeTextEn(partyType)}, with participant engagement strategies",
    "Activity suggestion 4: ${hasMilestones ? 'Community-building activity that involves family/friends in honoring this milestone, ' : ''}Fourth activity recommendation with time scheduling and diverse participation methods for different personality types"
  ],
  "decorations": [
    "Decoration suggestion 1: ${theme} theme with ${hasMilestones ? 'milestone-symbolic elements and meaningful color schemes, ' : ''}color coordination plan with budget $45-120, including specific item shopping list and DIY instructions",
    "Decoration suggestion 2: ${hasMilestones ? 'Decorative elements that tell the story of this life journey and transition, ' : ''}Creative decoration scheme with DIY production methods, materials list, and cost-saving tips",
    "Decoration suggestion 3: ${hasMilestones ? 'Display areas showcasing memories and celebrating growth/achievements, ' : ''}Atmosphere creation plan including lighting arrangement, background setup, and visual impact techniques",
    "Decoration suggestion 4: ${hasMilestones ? 'Cultural and traditional decorative touches that honor the milestone meaning, ' : ''}Detail decoration recommendations including table settings, space decoration elements, and finishing touches"
  ],
  "catering": [
    "Catering suggestion 1: ${hasMilestones ? 'Menu honoring cultural traditions and milestone preferences, ' : ''}Main course plan suitable for ${getGuestCountTextEn(guestCount)} with budget $60-180, including procurement advice and preparation methods",
    "Catering suggestion 2: ${hasMilestones ? 'Ceremonial cake design that symbolizes the life transition and cultural meaning, ' : ''}Exquisite desserts and birthday cake options with flavor choices, presentation methods, and dietary considerations",
    "Catering suggestion 3: ${hasMilestones ? 'Traditional beverages or special drinks that honor the milestone celebration, ' : ''}Beverage pairing plan including alcoholic and non-alcoholic options, quantity calculations, and serving suggestions",
    "Catering suggestion 4: ${hasMilestones ? 'Meaningful food choices that reflect family traditions and cultural significance, ' : ''}Snacks and appetizer recommendations balancing health and taste, with portion planning and presentation ideas"
  ],
  "music": [
    "Music suggestion 1: ${hasMilestones ? 'Opening with culturally meaningful music that sets the ceremonial tone, ' : ''}Opening music arrangement (first 30 minutes) with playlist recommendations, sound equipment advice, and volume control tips",
    "Music suggestion 2: ${hasMilestones ? 'Milestone celebration music that captures the emotional significance and joy, ' : ''}Activity peak music (middle 1 hour) including interactive music selections and background music for different activities",
    "Music suggestion 3: ${hasMilestones ? 'Reflective music during intimate moments that honor the life journey, ' : ''}Dining period music (30-45 minutes) with relaxing and pleasant background music that enhances conversation",
    "Music suggestion 4: ${hasMilestones ? 'Closing music that leaves guests with lasting memories of this special milestone, ' : ''}Closing music arrangement (final 15 minutes) including warm farewell music and transition timing"
  ],
  "schedule": [
    "Time arrangement 1: ${hasMilestones ? 'Ceremonial welcome honoring the milestone significance (30 min), ' : ''}Welcome opening (first 30 minutes) - Guest arrival, check-in, opening music, simple ice-breaking activities",
    "Time arrangement 2: ${hasMilestones ? 'Main milestone ceremony celebrating the life transition (1-1.5 hours), ' : ''}Main activities (1-1.5 hours) - Birthday celebration ceremony, interactive games, photo sessions, highlight moments",
    "Time arrangement 3: ${hasMilestones ? 'Celebratory feast honoring family traditions and cultural meaning (45-60 min), ' : ''}Dining time (45 minutes-1 hour) - Enjoy food, relaxed conversation, background music, social mingling",
    "Time arrangement 4: ${hasMilestones ? 'Reflection and blessing time for milestone wishes and family bonds (30 min), ' : ''}Free activities (30 minutes) - Free interaction, mini games, preparation for farewell, memory sharing",
    "Time arrangement 5: ${hasMilestones ? 'Meaningful farewell with milestone blessings and future hopes (15 min), ' : ''}Closing session (15 minutes) - Thank you speech, group photos, farewell ceremony, guest departure"
  ]
}

**Enhanced Cultural Planning Requirements:**
1. ${hasMilestones ? 'Every suggestion must honor the deep cultural and personal significance of this life milestone' : 'Each suggestion must include specific budget references and actionable execution guidance'}
2. ${hasMilestones ? 'Incorporate traditional elements and ceremonial aspects appropriate to this life transition' : 'Design 2-3 exciting interactive sessions with detailed participation strategies'}
3. ${hasMilestones ? 'Create meaningful moments that will become treasured memories for this important life stage' : 'Incorporate warm emotional elements with clear implementation methods'}
4. Consider venue layout and crowd flow with practical arrangement tips
5. Provide comprehensive shopping lists and DIY instructions where applicable
6. Music arrangements must be segmented by time with equipment recommendations
7. All suggestions should be tailored to ${getAtmosphereTextEn(atmosphere)} atmosphere requirements

**Quality Standards:**
- Every suggestion must be specific, practical, and immediately actionable
- Include detailed budget breakdowns and cost-saving alternatives
- ${hasMilestones ? 'Reflect deep understanding of the cultural milestone\'s emotional and ceremonial importance' : 'Provide step-by-step execution methods for complex elements'}
- Consider different guest preferences and participation levels
- Ensure seamless flow between different party segments

${hasMilestones ? 'The goal is to create a celebration that honors this significant life transition while creating an unforgettable experience that the birthday person and every guest will treasure as a meaningful milestone in their lives.' : 'The goal is to create an unforgettable experience for the birthday person and every guest, while maintaining reasonable budget, simple execution, and excellent results.'} Please ensure each recommendation is detailed, practical, and includes comprehensive planning guidance.`;
}

function getChinesePrompt(partyType: string, ageGroup: string, gender: string, dynamicTags: string[], guestCount: string, venue: string, budget: string, theme: string, atmosphere: string) {
  const milestoneInfo = getDynamicTagsDescription(ageGroup, dynamicTags, 'zh');
  const hasMilestones = dynamicTags && dynamicTags.length > 0;

  return `您好！我是一位专业的生日派对策划顾问，拥有15年的活动策划经验，专门从事具有文化敏感性的庆典活动，深入理解人生重要里程碑的深层意义。我理解每一个生日庆典的深刻情感和文化意义，特别是那些标志着重要人生转折的特殊时刻。

根据您提供的需求信息，我将为您制定一份详细的生日派对策划方案：

📋 **文化背景与需求分析**
- 派对类型：${getPartyTypeText(partyType)}
- 年龄段：${ageGroup}
- 性别：${gender}
- **文化里程碑背景**：${milestoneInfo}
- 参与人数：${getGuestCountText(guestCount)}
- 场地选择：${getVenueText(venue)}
- 预算范围：${getBudgetText(budget)}
- 主题风格：${theme}
- 期望氛围：${getAtmosphereText(atmosphere)}

${hasMilestones ? `**🎯 特殊文化里程碑重点关注**：
此次庆典致敬一个具有深刻文化意义的重要人生转折。每个建议都必须体现这个里程碑的情感重量、传统内涵和仪式重要性。需要考虑：
- 家庭和社区如何传统地庆祝这种转变
- 象征意义以及它对个人人生旅程的代表
- 与此里程碑相关的文化传统和期待
- 创造持久回忆以致敬这个人生阶段的方式
- 融入承认这一时刻重要性的元素**` : ''}

**重要要求：请严格按照以下JSON格式返回，不要添加任何其他文字说明，直接返回JSON对象：**

{
  "venue": [
    "场地建议1：${hasMilestones ? '符合里程碑意义的场地布置，体现文化重要性，' : ''}具体场地布置方案，预算200-500元，包含详细布局设计和装饰要点",
    "场地建议2：${hasMilestones ? '反映仪式重要性的空间设计，' : ''}场地选择方案，包含功能区域划分和人员流动设计",
    "场地建议3：${hasMilestones ? '强调人生转折主题的场地安排，' : ''}第三个场地方案，包含装饰技巧和成本控制建议",
    "场地建议4：${hasMilestones ? '致敬家庭传统和里程碑意义的环境设置，' : ''}第四个场地建议，包含实用布置要点和氛围营造方法"
  ],
  "activities": [
    "活动建议1：${hasMilestones ? '致敬里程碑的仪式活动，承认人生转折，' : ''}互动游戏设计，包含具体玩法规则、所需道具清单和执行步骤",
    "活动建议2：${hasMilestones ? '庆祝人生旅程并展望未来的回忆分享环节，' : ''}温馨情感交流环节，包含详细执行方法和时间引导",
    "活动建议3：${hasMilestones ? '承认文化重要性的传统或象征性活动，' : ''}第三个活动方案，特别适合${getPartyTypeText(partyType)}，包含参与策略",
    "活动建议4：${hasMilestones ? '涉及家人朋友共同致敬此里程碑的社区建设活动，' : ''}第四个活动建议，包含时间安排和多样化参与方式"
  ],
  "decorations": [
    "装饰建议1：${theme}主题${hasMilestones ? '融合里程碑象征元素和意义深远的色彩方案，' : '色彩搭配方案，'}预算300-800元，包含具体物品采购清单和DIY制作指导",
    "装饰建议2：${hasMilestones ? '讲述人生旅程故事和转折的装饰元素，' : ''}创意装饰方案，包含DIY制作方法、材料清单和节约成本技巧",
    "装饰建议3：${hasMilestones ? '展示回忆和庆祝成长/成就的展示区域，' : ''}氛围营造方案，包含灯光布置、背景设计和视觉冲击技巧",
    "装饰建议4：${hasMilestones ? '致敬里程碑意义的文化和传统装饰点缀，' : ''}细节装饰建议，包含桌面布置、空间装饰元素和收尾点缀"
  ],
  "catering": [
    "餐饮建议1：${hasMilestones ? '致敬文化传统和里程碑偏好的菜单，' : ''}适合${getGuestCountText(guestCount)}的主食方案，预算400-1200元，包含采购建议和制作方法",
    "餐饮建议2：${hasMilestones ? '象征人生转折和文化意义的仪式蛋糕设计，' : ''}精美甜点和生日蛋糕方案，包含口味选择、呈现方式和饮食考量",
    "餐饮建议3：${hasMilestones ? '致敬里程碑庆典的传统饮品或特色饮料，' : ''}饮品搭配方案，包含酒精和非酒精选择、分量计算和服务建议",
    "餐饮建议4：${hasMilestones ? '体现家庭传统和文化重要性的意义深远的食物选择，' : ''}小食和开胃菜建议，平衡健康与美味，包含分量规划和呈现创意"
  ],
  "music": [
    "音乐建议1：${hasMilestones ? '以具有文化意义的音乐开场，营造仪式氛围，' : ''}开场音乐安排（前30分钟），歌单推荐、音响设备建议和音量控制技巧",
    "音乐建议2：${hasMilestones ? '捕捉情感意义和喜悦的里程碑庆祝音乐，' : ''}活动高潮音乐（中间1小时），互动音乐选择和不同活动的背景音乐",
    "音乐建议3：${hasMilestones ? '致敬人生旅程的亲密时刻反思音乐，' : ''}用餐时段音乐（30-45分钟），轻松愉快背景音乐，促进交流对话",
    "音乐建议4：${hasMilestones ? '让宾客留下这个特殊里程碑持久回忆的结束音乐，' : ''}结束音乐安排（最后15分钟），温馨告别音乐和过渡时机把控"
  ],
  "schedule": [
    "时间安排1：${hasMilestones ? '致敬里程碑意义的仪式性欢迎（30分钟），' : ''}开场欢迎（前30分钟）- 宾客到达、签到、开场音乐、简单破冰活动",
    "时间安排2：${hasMilestones ? '庆祝人生转折的主要里程碑仪式（1-1.5小时），' : ''}主要活动（1-1.5小时）- 生日庆祝仪式、互动游戏、拍照留念、高光时刻",
    "时间安排3：${hasMilestones ? '致敬家庭传统和文化意义的庆祝盛宴（45-60分钟），' : ''}用餐时间（45分钟-1小时）- 享用美食、轻松聊天、背景音乐、社交交流",
    "时间安排4：${hasMilestones ? '里程碑祝愿和家庭纽带的反思祝福时间（30分钟），' : ''}自由活动（30分钟）- 自由互动、小游戏、准备告别、回忆分享",
    "时间安排5：${hasMilestones ? '带着里程碑祝福和未来希望的意义深远告别（15分钟），' : ''}结束环节（15分钟）- 感谢致辞、集体合影、告别仪式、宾客离场"
  ]
}

**增强文化策划要求：**
1. ${hasMilestones ? '每个建议都必须致敬这个人生里程碑的深刻文化和个人重要性' : '每个建议必须包含具体预算参考和可执行的指导方案'}
2. ${hasMilestones ? '融入适合这个人生转折的传统元素和仪式性方面' : '设计2-3个精彩互动环节，包含详细参与策略'}
3. ${hasMilestones ? '创造将成为这个重要人生阶段珍贵回忆的意义深远时刻' : '融入温馨情感元素，提供清晰的实施方法和执行步骤'}
4. 考虑场地布局和人员流动，提供实用的安排技巧
5. 提供全面的采购清单和DIY制作指导（如适用）
6. 音乐安排必须按时间段划分，包含设备建议和技术要点
7. 所有建议都应符合${getAtmosphereText(atmosphere)}的氛围要求

**质量标准：**
- 每个建议都必须具体、实用、可立即执行
- 包含详细的预算分解和节约成本的替代方案
- ${hasMilestones ? '体现对文化里程碑情感和仪式重要性的深刻理解' : '为复杂元素提供分步执行方法和详细指导'}
- 考虑不同宾客的喜好和参与程度差异
- 确保派对各个环节之间的无缝衔接和流畅过渡

${hasMilestones ? '目标是创造一个致敬这个重要人生转折的庆典，同时创造一个难忘的体验，让生日当事人和每位宾客都将珍视为他们生活中一个有意义的里程碑。' : '目标是为生日当事人和每位宾客创造难忘的体验，同时保持合理预算、简单执行、出色效果。'}请确保每个建议都详细、实用，包含全面的策划指导。`;
}

function getPartyTypeTextEn(type: string): string {
  switch (type) {
    case 'child': return 'Children\'s Birthday Party (Ages 3-12)';
    case 'adult': return 'Adult Birthday Party (Ages 18-50)';
    case 'elderly': return 'Elder\'s Birthday Celebration (Ages 50+)';
    default: return 'Birthday Party';
  }
}

function getGuestCountTextEn(count: string): string {
  switch (count) {
    case 'small': return 'Small Party (Up to 10 people)';
    case 'medium': return 'Medium Party (10-30 people)';
    case 'large': return 'Large Party (30+ people)';
    default: return 'Party';
  }
}

function getVenueTextEn(venue: string): string {
  switch (venue) {
    case 'indoor': return 'Indoor Venue (Home, restaurant, club)';
    case 'outdoor': return 'Outdoor Venue (Park, garden, beach)';
    default: return 'Venue';
  }
}

function getBudgetTextEn(budget: string): string {
  switch (budget) {
    case 'low': return 'Budget-friendly ($75-225)';
    case 'medium': return 'Standard ($225-750)';
    case 'high': return 'Premium ($750+)';
    default: return 'Budget';
  }
}

function getAtmosphereTextEn(atmosphere: string): string {
  switch (atmosphere) {
    case 'lively': return 'Lively & Fun (Music, games, interaction)';
    case 'elegant': return 'Elegant (Light music, conversation)';
    case 'casual': return 'Casual (Relaxed, simple dining)';
    case 'formal': return 'Formal (Ceremonial, speeches)';
    case 'creative': return 'Creative (DIY activities, games)';
    case 'intimate': return 'Intimate (Small group, deep talks)';
    default: return 'Atmosphere';
  }
} 