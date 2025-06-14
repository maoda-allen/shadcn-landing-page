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
}

// 添加API密钥状态检查
async function validateAPIKey(client: OpenAI): Promise<boolean> {
  try {
    console.log('🔍 验证API密钥有效性...');
    const testResponse = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 1,
    }, {
      headers: {
        "HTTP-Referer": "http://localhost:3010",
        "X-Title": "Birthday Party Planner",
      }
    });
    console.log('✅ API密钥验证成功');
    return true;
  } catch (error: any) {
    console.error('❌ API密钥验证失败:', error.status, error.message);
    return false;
  }
}

const client = API_KEY ? new OpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partyType, guestCount, venue, budget, theme, atmosphere } = body;

    console.log('🚀 收到请求参数:', { partyType, guestCount, venue, budget, theme, atmosphere });
    
    // 检查API密钥是否配置
    if (!API_KEY || !client) {
      console.log('⚠️ API密钥未配置，使用备用方案...');
      return NextResponse.json({
        success: true,
        data: getMockPartyPlan(partyType, guestCount, venue, budget, theme, atmosphere),
        source: 'fallback',
        message: 'API密钥未配置，已使用高质量备用方案',
        debug: {
          error: 'OPENROUTER_API_KEY环境变量未设置',
          suggestion: '请在.env.local文件中设置您的API密钥'
        }
      });
    }

    console.log('🔑 使用环境变量中的API密钥');
    console.log('🌐 API基础URL:', BASE_URL);

    // 首先验证API密钥
    const isValidKey = await validateAPIKey(client);
    if (!isValidKey) {
      console.log('🔄 API密钥无效，返回备用方案...');
      return NextResponse.json({
        success: true,
        data: getMockPartyPlan(partyType, guestCount, venue, budget, theme, atmosphere),
        source: 'fallback',
        message: 'API密钥已失效，已使用高质量备用方案',
        debug: {
          error: 'API密钥认证失败',
          suggestion: '请更新API密钥或检查账户余额'
        }
      });
    }

    // 优化后的安全提示词
    const prompt = `您好！我是一位专业的生日派对策划顾问，拥有15年的活动策划经验。我专门为家庭、企业和个人提供个性化的生日庆典策划服务，致力于创造难忘的美好时光。

根据您提供的需求信息，我将为您制定一份详细的生日派对策划方案：

📋 **需求分析**
- 派对类型：${getPartyTypeText(partyType)}
- 参与人数：${getGuestCountText(guestCount)}
- 场地选择：${getVenueText(venue)}
- 预算范围：${getBudgetText(budget)}
- 主题风格：${theme}
- 期望氛围：${getAtmosphereText(atmosphere)}

我将从以下6个专业维度为您提供具体可行的建议，每项建议都包含详细的预算参考和执行指导：

**策划要求：**
1. 提供具体可操作的建议，包含明确的预算参考（例如：装饰材料200-500元）
2. 设计2-3个精彩的互动环节，营造活跃的派对氛围
3. 融入温馨的情感元素，创造美好的回忆时刻
4. 考虑场地布局和人员流动，确保活动顺利进行
5. 使用亲切自然的语言，提供贴心的建议
6. 音乐安排要按时间段规划，配合不同的活动节奏

**方案包含以下内容：**
- **场地布置**：功能区域划分、布局设计、装饰预算和布置技巧
- **活动安排**：互动游戏设计、各年龄段参与方案、活动流程安排
- **装饰方案**：主题色彩搭配、装饰物品清单、预算分配建议
- **餐饮建议**：食物搭配方案、预算参考、采购建议和呈现方式
- **音乐氛围**：按时间段的音乐类型安排、播放设备建议
- **时间安排**：详细的活动时间表、重点环节标注、注意事项

**特别关注：**
- 设计能够调动全场参与热情的互动环节
- 安排温馨感人的情感交流时刻
- 为每个重要环节提供具体的执行方法和物品清单
- 考虑不同性格特点的宾客，设计多样化的参与方式

目标是让生日主角和每一位宾客都能度过一个温馨难忘的美好时光，同时确保预算合理、执行简便、效果出色。

请以JSON格式返回详细建议，每项建议都要具体实用，包含预算参考，便于实际操作：
{
  "venue": ["场地建议1（含预算和布局）", "场地建议2", "场地建议3", "场地建议4"],
  "activities": ["活动建议1（含互动设计）", "活动建议2（含情感元素）", "活动建议3", "活动建议4"],
  "decorations": ["装饰建议1（含具体预算）", "装饰建议2", "装饰建议3", "装饰建议4"],
  "catering": ["餐饮建议1（含价格参考）", "餐饮建议2", "餐饮建议3", "餐饮建议4"],
  "music": ["音乐建议1（含时间安排）", "音乐建议2", "音乐建议3", "音乐建议4"],
  "schedule": ["时间安排1（含重点标注）", "时间安排2（含注意事项）", "时间安排3", "时间安排4", "时间安排5"]
}`;

    console.log('开始调用OpenRouter AI...');
    console.log('请求URL:', 'https://openrouter.ai/api/v1/chat/completions');

    try {
      // 先测试一个简单的请求验证新密钥
      console.log('使用新密钥发送测试请求...');
      
      const testCompletion = await client.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: "请简单回复：你好"
          }
        ],
        temperature: 0.7,
        max_tokens: 50,
      }, {
        headers: {
          "HTTP-Referer": "http://localhost:3010",
          "X-Title": "Birthday Party Planner",
        }
      });

      console.log('✅ 新密钥测试成功！现在发送正式的复杂提示词请求...');

      // 如果测试成功，发送正式的复杂请求
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
      }, {
        headers: {
          "HTTP-Referer": "http://localhost:3010",
          "X-Title": "Birthday Party Planner",
        }
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
        if (jsonMatch) {
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
        partyPlan = parseResponseToStructure(responseText || '');
        console.log('✅ 备用解析完成，数据结构:', Object.keys(partyPlan));
      }

      console.log('🎊 AI生成成功，返回高质量响应...');
      return NextResponse.json({
        success: true,
        data: partyPlan,
        source: 'ai',
        message: '专业策划师AI方案生成成功'
      });

    } catch (apiError: any) {
      console.error('OpenRouter API调用失败:', apiError);
      console.error('错误状态码:', apiError.status);
      console.error('错误消息:', apiError.message);
      console.error('错误详情:', apiError.error);
      
      // 检查是否是认证错误
      if (apiError.status === 401) {
        console.log('❌ 认证失败 - 新API密钥可能也有问题');
        console.log('建议：');
        console.log('1. 检查新API密钥是否正确复制');
        console.log('2. 访问 https://openrouter.ai/keys 验证密钥状态');
        console.log('3. 确认账户余额充足');
      }
      
      console.log('使用模拟数据作为备用方案...');
      
      // 返回模拟数据作为备用方案
      const mockData = {
        venue: [
          `入口迎宾区设置签到台和拍照背景墙（预算300-500元），引导宾客有序进入主题${theme}的温馨空间，营造专属仪式感`,
          `主活动区域采用圆桌布局，便于互动交流，预留中央表演空间（桌椅租赁500-800元），确保动线流畅`,
          `设置专门的礼品展示区和生日蛋糕台，营造仪式感（装饰用品200-400元），增强视觉焦点`,
          `${venue === 'outdoor' ? '户外场地需准备遮阳棚或暖气设备，考虑天气变化' : '室内场地确保通风和温度适宜，营造舒适环境'}（设备租赁400-600元）`
        ],
        activities: [
          `开场破冰游戏"生日知多少"，让宾客分享与寿星的美好回忆，营造温馨氛围（道具费用50-100元）【情绪触达点】`,
          `高潮引爆时刻：集体生日祝福视频播放+惊喜礼物揭晓，全场一起倒数点蜡烛（制作费用200-300元）【瞬间引爆】`,
          `情绪触达环节：设置"时光胶囊"，每位宾客写下祝福语投入胶囊，约定明年生日开启（材料费用100-150元）【深度连接】`,
          `互动抽奖环节，准备精美小礼品，让每位宾客都有参与感和收获感（礼品预算300-500元）【全员参与】`
        ],
        decorations: [
          `主题色彩以${theme}风格为主，气球拉花布置全场（装饰用品预算400-600元），营造沉浸式视觉体验`,
          `制作个性化生日横幅和照片墙，展示寿星成长历程（制作费用200-350元），增强情感共鸣`,
          `餐桌装饰使用鲜花和蜡烛，营造${atmosphere === 'elegant' ? '优雅' : '温馨'}氛围（鲜花预算300-500元），提升仪式感`,
          `准备主题拍照道具箱，包含有趣的帽子、眼镜、标语牌等（道具费用150-250元），创造互动乐趣`
        ],
        catering: [
          `生日蛋糕选择多层设计，融入${theme}主题元素（蛋糕预算${budget === 'high' ? '800-1200' : budget === 'medium' ? '500-800' : '300-500'}元），成为视觉焦点`,
          `准备精致茶点和小食，包含甜品台和咸味小食（餐饮预算800-1200元），满足不同口味需求`,
          `特色饮品调制，准备无酒精鸡尾酒和特色果汁（饮品预算200-400元），增加仪式感和新鲜感`,
          `考虑宾客饮食习惯，准备素食和无糖选项，体现贴心服务（额外预算100-200元），确保每位宾客都能享用`
        ],
        music: [
          `16:00-17:00 入场时段：播放轻松愉快的背景音乐，如爵士乐和轻音乐，配合${atmosphere}氛围，营造温馨迎宾感`,
          `17:00-18:30 互动时段：选择节奏明快的流行音乐，营造活跃氛围，适合${guestCount}规模聚会，推动互动参与`,
          `18:30-19:00 高潮时段：播放生日歌和寿星喜爱的经典歌曲，配合仪式进行，营造情绪高潮【引爆时刻】`,
          `19:00-20:00 温馨时段：选择抒情音乐和怀旧金曲，适合聊天和回忆分享，延续美好氛围【情绪触达】`
        ],
        schedule: [
          `16:00-16:30 宾客签到入场，拍照留念，享用迎宾茶点（重点：营造温馨第一印象）【开场氛围营造】`,
          `16:30-17:30 破冰互动游戏，宾客自我介绍和分享环节（高潮标注：集体游戏引爆气氛）【瞬间引爆时刻1】`,
          `17:30-18:00 生日祝福视频播放，情绪触达高峰时刻（情绪触达点：感动回忆分享）【深度情感连接1】`,
          `18:00-18:30 生日蛋糕仪式，许愿吹蜡烛，全场合唱生日歌（高潮标注：仪式感巅峰）【瞬间引爆时刻2】`,
          `18:30-20:00 自由交流时间，抽奖活动，时光胶囊封存仪式（情绪触达点：未来约定）【深度情感连接2】`
        ]
      };

      return NextResponse.json({
        success: true,
        data: mockData,
        source: 'fallback',
        message: 'AI服务暂时不可用，已使用高质量备用方案',
        debug: {
          error: apiError.message,
          status: apiError.status,
          suggestion: '新API密钥可能需要验证或账户充值'
        }
      });
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
function parseResponseToStructure(text: string) {
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

  // 确保每个部分都有内容
  Object.keys(sections).forEach(key => {
    if (sections[key as keyof typeof sections].length === 0) {
      sections[key as keyof typeof sections] = [`${key}相关建议正在为您定制中...`];
    }
  });

  console.log('✅ 备用文本解析完成，各部分内容数量:', 
    Object.keys(sections).map(key => `${key}: ${sections[key as keyof typeof sections].length}`).join(', ')
  );

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

function getMockPartyPlan(partyType: string, guestCount: string, venue: string, budget: string, theme: string, atmosphere: string) {
  return {
    venue: [
      `入口迎宾区设置签到台和拍照背景墙（预算300-500元），引导宾客有序进入主题${theme}的温馨空间，营造专属仪式感`,
      `主活动区域采用圆桌布局，便于互动交流，预留中央表演空间（桌椅租赁500-800元），确保动线流畅`,
      `设置专门的礼品展示区和生日蛋糕台，营造仪式感（装饰用品200-400元），增强视觉焦点`,
      `${venue === 'outdoor' ? '户外场地需准备遮阳棚或暖气设备，考虑天气变化' : '室内场地确保通风和温度适宜，营造舒适环境'}（设备租赁400-600元）`
    ],
    activities: [
      `开场破冰游戏"生日知多少"，让宾客分享与寿星的美好回忆，营造温馨氛围（道具费用50-100元）【情绪触达点】`,
      `高潮引爆时刻：集体生日祝福视频播放+惊喜礼物揭晓，全场一起倒数点蜡烛（制作费用200-300元）【瞬间引爆】`,
      `情绪触达环节：设置"时光胶囊"，每位宾客写下祝福语投入胶囊，约定明年生日开启（材料费用100-150元）【深度连接】`,
      `互动抽奖环节，准备精美小礼品，让每位宾客都有参与感和收获感（礼品预算300-500元）【全员参与】`
    ],
    decorations: [
      `主题色彩以${theme}风格为主，气球拉花布置全场（装饰用品预算400-600元），营造沉浸式视觉体验`,
      `制作个性化生日横幅和照片墙，展示寿星成长历程（制作费用200-350元），增强情感共鸣`,
      `餐桌装饰使用鲜花和蜡烛，营造${atmosphere === 'elegant' ? '优雅' : '温馨'}氛围（鲜花预算300-500元），提升仪式感`,
      `准备主题拍照道具箱，包含有趣的帽子、眼镜、标语牌等（道具费用150-250元），创造互动乐趣`
    ],
    catering: [
      `生日蛋糕选择多层设计，融入${theme}主题元素（蛋糕预算${budget === 'high' ? '800-1200' : budget === 'medium' ? '500-800' : '300-500'}元），成为视觉焦点`,
      `准备精致茶点和小食，包含甜品台和咸味小食（餐饮预算800-1200元），满足不同口味需求`,
      `特色饮品调制，准备无酒精鸡尾酒和特色果汁（饮品预算200-400元），增加仪式感和新鲜感`,
      `考虑宾客饮食习惯，准备素食和无糖选项，体现贴心服务（额外预算100-200元），确保每位宾客都能享用`
    ],
    music: [
      `16:00-17:00 入场时段：播放轻松愉快的背景音乐，如爵士乐和轻音乐，配合${atmosphere}氛围，营造温馨迎宾感`,
      `17:00-18:30 互动时段：选择节奏明快的流行音乐，营造活跃氛围，适合${guestCount}规模聚会，推动互动参与`,
      `18:30-19:00 高潮时段：播放生日歌和寿星喜爱的经典歌曲，配合仪式进行，营造情绪高潮【引爆时刻】`,
      `19:00-20:00 温馨时段：选择抒情音乐和怀旧金曲，适合聊天和回忆分享，延续美好氛围【情绪触达】`
    ],
    schedule: [
      `16:00-16:30 宾客签到入场，拍照留念，享用迎宾茶点（重点：营造温馨第一印象）【开场氛围营造】`,
      `16:30-17:30 破冰互动游戏，宾客自我介绍和分享环节（高潮标注：集体游戏引爆气氛）【瞬间引爆时刻1】`,
      `17:30-18:00 生日祝福视频播放，情绪触达高峰时刻（情绪触达点：感动回忆分享）【深度情感连接1】`,
      `18:00-18:30 生日蛋糕仪式，许愿吹蜡烛，全场合唱生日歌（高潮标注：仪式感巅峰）【瞬间引爆时刻2】`,
      `18:30-20:00 自由交流时间，抽奖活动，时光胶囊封存仪式（情绪触达点：未来约定）【深度情感连接2】`
    ]
  };
} 