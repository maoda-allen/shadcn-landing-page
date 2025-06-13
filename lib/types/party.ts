export interface PartyPlanRequest {
  partyType: 'adult' | 'child' | 'elderly' | '';
  guestCount: 'small' | 'medium' | 'large' | '';
  venue: 'indoor' | 'outdoor' | '';
  budget: 'low' | 'medium' | 'high' | '';
  theme: string;
  atmosphere: 'relaxed' | 'fun' | 'romantic' | 'elegant' | 'energetic' | 'peaceful' | '';
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

export interface PartyTheme {
  id: string;
  name: string;
  description: string;
  suitable: string[];
  icon: string;
}

export const PARTY_THEMES: PartyTheme[] = [
  {
    id: 'retro',
    name: '复古派对',
    description: '80年代怀旧风格，经典音乐和装饰',
    suitable: ['成人'],
    icon: 'Music'
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
  },
  {
    id: 'garden',
    name: '花园聚会',
    description: '自然清新，鲜花装饰',
    suitable: ['成人', '长辈'],
    icon: 'Flower'
  },
  {
    id: 'modern',
    name: '简约现代',
    description: '极简风格，高端大气',
    suitable: ['成人'],
    icon: 'Square'
  }
];

export const ATMOSPHERE_OPTIONS = [
  { value: 'relaxed', label: '轻松休闲', description: '舒适自在的氛围' },
  { value: 'fun', label: '欢乐搞笑', description: '充满笑声和欢乐' },
  { value: 'romantic', label: '浪漫温馨', description: '温馨浪漫的感觉' },
  { value: 'elegant', label: '优雅高贵', description: '精致优雅的格调' },
  { value: 'energetic', label: '活力动感', description: '充满活力和激情' },
  { value: 'peaceful', label: '自然宁静', description: '平和宁静的环境' }
]; 