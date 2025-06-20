export interface PartyPlanRequest {
  partyType: 'adult' | 'child' | 'elderly' | 'teen' | '';
  guestCount: 'small' | 'medium' | 'large' | '';
  venue: 'home' | 'outdoor' | 'restaurant' | 'hall' | '';
  budget: 'budget' | 'standard' | 'premium' | '';
  theme: string;
  atmosphere: 'lively' | 'elegant' | 'casual' | 'formal' | 'creative' | 'intimate' | '';
}

// 新增：表单数据类型
export interface PartyFormData {
  partyType: 'adult' | 'child' | 'elderly' | 'teen';
  ageGroup: '0-3' | '4-17' | '18-59' | '60+' | '';
  gender: 'male' | 'female' | 'other' | '';
  dynamicTags: string[];
  guestCount: 'small' | 'medium' | 'large';
  venue: 'home' | 'outdoor' | 'restaurant' | 'hall';
  budget: 'budget' | 'standard' | 'premium';
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

// 动态标签定义 - 与API保持一致的详细文化内涵描述
export interface DynamicTag {
  id: string;
  label: string;
  description?: string;
  gender?: 'male' | 'female' | 'all';
}

export const DYNAMIC_TAGS: Record<string, DynamicTag[]> = {
  '0-3': [
    { 
      id: 'first-birthday', 
      label: 'First Birthday', 
      description: 'Baby\'s first major birthday milestone, American parents often hold parties and take "Smash Cake" photos for commemoration', 
      gender: 'all' 
    },
    { 
      id: 'second-birthday', 
      label: 'Second Birthday', 
      description: 'Baby enters language and social sensitive period, starts participating in simple game parties', 
      gender: 'all' 
    },
    { 
      id: 'third-birthday', 
      label: 'Third Birthday', 
      description: 'Enhanced expression ability, many parents first hold themed parties (animated characters, color themes, etc.)', 
      gender: 'all' 
    }
  ],
  '4-17': [
    { 
      id: 'starting-school', 
      label: 'Starting School', 
      description: '5th birthday - growth milestone before entering elementary school, parents express encouragement and blessings', 
      gender: 'all' 
    },
    { 
      id: 'big-kid', 
      label: 'Big Kid', 
      description: '7th birthday - "little adult" stage, children\'s self-awareness strengthens, a transition period parents love to celebrate', 
      gender: 'all' 
    },
    { 
      id: 'double-digits', 
      label: 'Double Digits', 
      description: '10th birthday - age first enters "double digits", American kids particularly care about it, often seen as important turning point', 
      gender: 'all' 
    },
    { 
      id: 'teenager', 
      label: 'Teenager', 
      description: '13th birthday - officially becoming a teenager, symbol of growth, very important to both American parents and children', 
      gender: 'all' 
    },
    { 
      id: 'quinceanera', 
      label: 'Quinceañera', 
      description: '15th birthday - important coming-of-age ceremony for Latina girls, usually involves grand ball ceremony', 
      gender: 'female' 
    },
    { 
      id: 'sweet-sixteen', 
      label: 'Sweet Sixteen', 
      description: '16th birthday - especially for girls, extremely formal youth celebration in American culture', 
      gender: 'all' 
    }
  ],
  '18-59': [
    { 
      id: 'adult', 
      label: 'Adult', 
      description: '18th birthday - legal adulthood, symbolizing independence, responsibility and social identity change', 
      gender: 'all' 
    },
    { 
      id: 'drinking-age', 
      label: 'Drinking Age', 
      description: '21st birthday - legal drinking age, one of the most anticipated birthdays for American young people, friend gatherings extremely common', 
      gender: 'all' 
    },
    { 
      id: 'big-30', 
      label: 'Big 3-0', 
      description: '30th birthday - farewell to "twenties", entering mature life stage, often celebrated with "Flirty Thirty" humor', 
      gender: 'all' 
    },
    { 
      id: 'over-the-hill', 
      label: 'Over the Hill', 
      description: '40th birthday - "life beyond the hill" humorous saying, often featuring quirky or satirical style parties', 
      gender: 'all' 
    },
    { 
      id: 'golden-50', 
      label: 'Golden 50', 
      description: '50th birthday - golden middle-age milestone, family and friends hold large celebrations summarizing life stages', 
      gender: 'all' 
    }
  ],
  '60+': [
    { 
      id: 'senior-start', 
      label: 'Senior Start', 
      description: '60th birthday - officially entering "senior stage", warm family celebrations are common', 
      gender: 'all' 
    },
    { 
      id: 'retirement', 
      label: 'Retirement', 
      description: '65th birthday - retirement age for most people, milestone from work life to life living', 
      gender: 'all' 
    },
    { 
      id: 'celebrating-life', 
      label: 'Celebrating Life', 
      description: '70th birthday - emphasizing health, family, memories, important milestone when elders willingly review their lives', 
      gender: 'all' 
    },
    { 
      id: 'big-80', 
      label: 'Big 8-0', 
      description: '80th birthday - symbol of longevity, usually a birthday banquet celebration planned by the whole family', 
      gender: 'all' 
    },
    { 
      id: 'legacy-birthday', 
      label: 'Legacy Birthday', 
      description: '90+ birthday - advanced age, celebrating elder\'s wisdom and family heritage, with extremely high emotional value', 
      gender: 'all' 
    }
  ]
}; 