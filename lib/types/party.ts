export interface PartyPlanRequest {
  partyType: 'adult' | 'child' | 'elderly' | '';
  guestCount: 'small' | 'medium' | 'large' | '';
  venue: 'indoor' | 'outdoor' | '';
  budget: 'low' | 'medium' | 'high' | '';
  theme: string;
  atmosphere: 'relaxed' | 'fun' | 'romantic' | 'elegant' | 'energetic' | 'peaceful' | '';
}

// 新增：表单数据类型
export interface PartyFormData {
  partyType: 'adult' | 'child' | 'elderly';
  guestCount: 'small' | 'medium' | 'large';
  venue: 'indoor' | 'outdoor';
  budget: 'low' | 'medium' | 'high';
  theme: string;
  atmosphere: string;
}

export interface PartyPlanResponse {
  id: string;
  venueSetup: string[];
  activities: string[];
  decorations: string[];
  catering: string[];
  music: string[];
  timeline: string[];
}

// 新增：API返回的派对方案类型
export interface PartyPlan {
  venue: string[];
  activities: string[];
  decorations: string[];
  catering: string[];
  music: string[];
  schedule: string[];
}

export interface PartyTheme {
  id: string;
  name: string;
  description: string;
  suitable: string[];
  icon: string;
}

export const PARTY_THEMES: PartyTheme[] = [
  {
    id: 'modern',
    name: '简约现代',
    description: '极简风格，高端大气',
    suitable: ['成人'],
    icon: 'Square'
  },
  {
    id: 'retro',
    name: '复古派对',
    description: '80年代怀旧风格，经典音乐和装饰',
    suitable: ['成人'],
    icon: 'Music'
  },
  {
    id: 'garden',
    name: '花园聚会',
    description: '自然清新，鲜花装饰',
    suitable: ['成人', '长辈'],
    icon: 'Flower'
  },
  {
    id: 'superhero',
    name: '超级英雄',
    description: '漫威、DC英雄主题，动作游戏',
    suitable: ['儿童', '青少年'],
    icon: 'Zap'
  },
  {
    id: 'princess',
    name: '公主主题',
    description: '梦幻城堡，粉色装饰',
    suitable: ['儿童'],
    icon: 'Crown'
  },
  {
    id: 'ocean',
    name: '海洋探险',
    description: '海洋生物，蓝色主题',
    suitable: ['儿童'],
    icon: 'Waves'
  }
];

export const ATMOSPHERE_OPTIONS = [
  { value: 'lively', label: '热闹欢快', description: '音乐、游戏、互动' },
  { value: 'elegant', label: '优雅温馨', description: '轻音乐、聊天、品茶' },
  { value: 'casual', label: '轻松随意', description: '自由活动、简单聚餐' },
  { value: 'formal', label: '正式庄重', description: '仪式感、致辞、合影' },
  { value: 'creative', label: '创意互动', description: 'DIY活动、主题游戏' },
  { value: 'intimate', label: '温馨私密', description: '小范围、深度交流' }
]; 