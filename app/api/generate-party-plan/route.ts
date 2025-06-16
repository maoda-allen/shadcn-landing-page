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

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API路由开始处理请求...');
    console.log('🔑 API密钥状态:', API_KEY ? '已配置' : '未配置');
    console.log('🌐 BASE_URL:', BASE_URL);
    
    const body = await request.json();
    console.log('📦 请求体内容:', JSON.stringify(body, null, 2));
    
    const { partyType, guestCount, venue, budget, theme, atmosphere, language = 'en' } = body;

    console.log('🚀 收到请求参数:', { partyType, guestCount, venue, budget, theme, atmosphere, language });
    
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

    // 根据语言生成不同的提示词
    const prompt = language === 'en' ? getEnglishPrompt(partyType, guestCount, venue, budget, theme, atmosphere) : getChinesePrompt(partyType, guestCount, venue, budget, theme, atmosphere);

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

function getEnglishPrompt(partyType: string, guestCount: string, venue: string, budget: string, theme: string, atmosphere: string) {
  return `Hello! I am a professional birthday party planning consultant with 15 years of event planning experience. I specialize in providing personalized birthday celebration planning services for families, businesses, and individuals, dedicated to creating unforgettable wonderful moments.

Based on the requirements you provided, I will create a detailed birthday party planning proposal for you:

📋 **Requirements Analysis**
- Party Type: ${getPartyTypeTextEn(partyType)}
- Number of Guests: ${getGuestCountTextEn(guestCount)}
- Venue Choice: ${getVenueTextEn(venue)}
- Budget Range: ${getBudgetTextEn(budget)}
- Theme Style: ${theme}
- Desired Atmosphere: ${getAtmosphereTextEn(atmosphere)}

**IMPORTANT REQUIREMENT: Please return STRICTLY in the following JSON format with NO additional text or explanations, return the JSON object directly:**

{
  "venue": [
    "Venue suggestion 1: Specific venue setup plan with detailed budget breakdown $30-75, including layout design and decoration techniques",
    "Venue suggestion 2: Alternative venue choice with specific layout design and functional area division",
    "Venue suggestion 3: Third venue option with decoration tips and budget-friendly setup ideas",
    "Venue suggestion 4: Fourth venue recommendation with practical arrangement points and cost-effective solutions"
  ],
  "activities": [
    "Activity suggestion 1: Design an interactive game that can mobilize full participation enthusiasm, including specific gameplay rules, required props list, and execution steps",
    "Activity suggestion 2: Arrange a warm and touching emotional exchange session with detailed execution methods and timing guidance",
    "Activity suggestion 3: Third activity plan specifically suitable for ${getPartyTypeTextEn(partyType)}, with participant engagement strategies",
    "Activity suggestion 4: Fourth activity recommendation with time scheduling and diverse participation methods for different personality types"
  ],
  "decorations": [
    "Decoration suggestion 1: ${theme} theme color coordination plan with budget $45-120, including specific item shopping list and DIY instructions",
    "Decoration suggestion 2: Creative decoration scheme with DIY production methods, materials list, and cost-saving tips",
    "Decoration suggestion 3: Atmosphere creation plan including lighting arrangement, background setup, and visual impact techniques",
    "Decoration suggestion 4: Detail decoration recommendations including table settings, space decoration elements, and finishing touches"
  ],
  "catering": [
    "Catering suggestion 1: Main course plan suitable for ${getGuestCountTextEn(guestCount)} with budget $60-180, including procurement advice and preparation methods",
    "Catering suggestion 2: Exquisite desserts and birthday cake options with flavor choices, presentation methods, and dietary considerations",
    "Catering suggestion 3: Beverage pairing plan including alcoholic and non-alcoholic options, quantity calculations, and serving suggestions",
    "Catering suggestion 4: Snacks and appetizer recommendations balancing health and taste, with portion planning and presentation ideas"
  ],
  "music": [
    "Music suggestion 1: Opening music arrangement (first 30 minutes) with playlist recommendations, sound equipment advice, and volume control tips",
    "Music suggestion 2: Activity peak music (middle 1 hour) including interactive music selections and background music for different activities",
    "Music suggestion 3: Dining period music (30-45 minutes) with relaxing and pleasant background music that enhances conversation",
    "Music suggestion 4: Closing music arrangement (final 15 minutes) including warm farewell music and transition timing"
  ],
  "schedule": [
    "Time arrangement 1: Welcome opening (first 30 minutes) - Guest arrival, check-in, opening music, simple ice-breaking activities",
    "Time arrangement 2: Main activities (1-1.5 hours) - Birthday celebration ceremony, interactive games, photo sessions, highlight moments",
    "Time arrangement 3: Dining time (45 minutes-1 hour) - Enjoy food, relaxed conversation, background music, social mingling",
    "Time arrangement 4: Free activities (30 minutes) - Free interaction, mini games, preparation for farewell, memory sharing",
    "Time arrangement 5: Closing session (15 minutes) - Thank you speech, group photos, farewell ceremony, guest departure"
  ]
}

**Professional Planning Requirements:**
1. Each suggestion must include specific budget references and actionable execution guidance
2. Design 2-3 exciting interactive sessions with detailed participation strategies
3. Incorporate warm emotional elements with clear implementation methods
4. Consider venue layout and crowd flow with practical arrangement tips
5. Provide comprehensive shopping lists and DIY instructions where applicable
6. Music arrangements must be segmented by time with equipment recommendations
7. All suggestions should be tailored to ${getAtmosphereTextEn(atmosphere)} atmosphere requirements

**Quality Standards:**
- Every suggestion must be specific, practical, and immediately actionable
- Include detailed budget breakdowns and cost-saving alternatives
- Provide step-by-step execution methods for complex elements
- Consider different guest preferences and participation levels
- Ensure seamless flow between different party segments

The goal is to create an unforgettable experience for the birthday person and every guest, while maintaining reasonable budget, simple execution, and excellent results. Please ensure each recommendation is detailed, practical, and includes comprehensive planning guidance.`;
}

function getChinesePrompt(partyType: string, guestCount: string, venue: string, budget: string, theme: string, atmosphere: string) {
  return `您好！我是一位专业的生日派对策划顾问，拥有15年的活动策划经验。我专门为家庭、企业和个人提供个性化的生日庆典策划服务，致力于创造难忘的美好时光。

根据您提供的需求信息，我将为您制定一份详细的生日派对策划方案：

📋 **需求分析**
- 派对类型：${getPartyTypeText(partyType)}
- 参与人数：${getGuestCountText(guestCount)}
- 场地选择：${getVenueText(venue)}
- 预算范围：${getBudgetText(budget)}
- 主题风格：${theme}
- 期望氛围：${getAtmosphereText(atmosphere)}

**重要要求：请严格按照以下JSON格式返回，不要添加任何其他文字说明，直接返回JSON对象：**

{
  "venue": [
    "场地建议1：具体的场地布置方案，包含预算200-500元的详细说明",
    "场地建议2：另一个场地选择方案，包含具体的布局设计",
    "场地建议3：第三个场地方案，包含装饰技巧",
    "场地建议4：第四个场地建议，包含实用的布置要点"
  ],
  "activities": [
    "活动建议1：设计一个能调动全场参与热情的互动游戏，包含具体玩法和道具清单",
    "活动建议2：安排一个温馨感人的情感交流环节，包含执行步骤",
    "活动建议3：第三个活动方案，适合${getPartyTypeText(partyType)}的特色活动",
    "活动建议4：第四个活动建议，包含时间安排和参与方式"
  ],
  "decorations": [
    "装饰建议1：${theme}主题的色彩搭配方案，预算300-800元，包含具体物品清单",
    "装饰建议2：创意装饰方案，包含DIY制作方法和材料清单",
    "装饰建议3：氛围营造方案，包含灯光和背景布置",
    "装饰建议4：细节装饰建议，包含桌面和空间装饰要点"
  ],
  "catering": [
    "餐饮建议1：适合${getGuestCountText(guestCount)}的主食方案，预算400-1200元，包含采购和制作建议",
    "餐饮建议2：精美甜点和生日蛋糕方案，包含口味选择和呈现方式",
    "餐饮建议3：饮品搭配方案，包含酒精和非酒精选择",
    "餐饮建议4：小食和零食建议，包含健康和美味的平衡"
  ],
  "music": [
    "音乐建议1：开场音乐安排（前30分钟），包含歌单推荐和音响设备建议",
    "音乐建议2：活动高潮音乐（中间1小时），包含互动音乐和背景音乐",
    "音乐建议3：用餐时段音乐（30-45分钟），包含轻松愉快的背景音乐",
    "音乐建议4：结束音乐安排（最后15分钟），包含温馨的告别音乐"
  ],
  "schedule": [
    "时间安排1：开场欢迎（前30分钟）- 宾客到达、签到、开场音乐、简单互动",
    "时间安排2：主要活动（1-1.5小时）- 生日庆祝仪式、互动游戏、拍照留念",
    "时间安排3：用餐时间（45分钟-1小时）- 享用美食、轻松聊天、背景音乐",
    "时间安排4：自由活动（30分钟）- 自由交流、小游戏、准备告别",
    "时间安排5：结束环节（15分钟）- 感谢致辞、合影留念、告别送别"
  ]
}

请确保每个建议都具体实用，包含预算参考和执行指导，适合${getAtmosphereText(atmosphere)}的氛围要求。`;
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