export interface Translations {
  nav: {
    brand: string;
    features: string;
    partyIdeas: string;
    pricing: string;
    faq: string;
    startPlanning: string;
    language: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    titleEnd: string;
    description: string;
    startPlanning: string;
    learnMore: string;
    imageAlt: string;
  };
  features: {
    subtitle: string;
    title: string;
    description: string;
    partyTypes: {
      title: string;
      description: string;
    };
    smartPlanning: {
      title: string;
      description: string;
    };
    venueSetup: {
      title: string;
      description: string;
    };
    themes: {
      title: string;
      description: string;
    };
    atmosphere: {
      title: string;
      description: string;
    };
    catering: {
      title: string;
      description: string;
    };
  };
  services: {
    subtitle: string;
    title: string;
    description: string;
    children: {
      title: string;
      description: string;
    };
    adult: {
      title: string;
      description: string;
    };
    elderly: {
      title: string;
      description: string;
    };
    theme: {
      title: string;
      description: string;
    };
    recommended: string;
  };
  pricing: {
    subtitle: string;
    title: string;
    description: string;
    free: {
      title: string;
      description: string;
      buttonText: string;
      benefits: {
        dailyLimit: string;
        dataRetention: string;
        noExport: string;
        basicPlan: string;
      };
    };
    premium: {
      title: string;
      description: string;
      buttonText: string;
      benefits: {
        unlimited: string;
        permanentStorage: string;
        exportSupport: string;
        detailedPlan: string;
      };
    };
    recommended: string;
    perMonth: string;
  };
  faq: {
    subtitle: string;
    title: string;
    questions: {
      isFree: {
        question: string;
        answer: string;
      };
      allAges: {
        question: string;
        answer: string;
      };
      customTheme: {
        question: string;
        answer: string;
      };
      saveExport: {
        question: string;
        answer: string;
      };
      planDifference: {
        question: string;
        answer: string;
      };
    };
  };
  planner: {
    pageTitle: string;
    pageDescription: string;
    aiPlanning: string;
    quickComplete: string;
    personalized: string;
    stepGuide: string;
    form: {
      title: string;
      subtitle: string;
      partyType: {
        title: string;
        adult: string;
        child: string;
        elderly: string;
        teen: string;
        descriptions: {
          child: string;
          adult: string;
          elderly: string;
        };
      };
      guestCount: {
        title: string;
        small: string;
        medium: string;
        large: string;
        descriptions: {
          small: string;
          medium: string;
          large: string;
        };
      };
      venue: {
        title: string;
        indoor: string;
        outdoor: string;
        descriptions: {
          indoor: string;
          outdoor: string;
        };
      };
      budget: {
        title: string;
        low: string;
        medium: string;
        high: string;
        descriptions: {
          low: string;
          medium: string;
          high: string;
        };
      };
      theme: {
        title: string;
        placeholder: string;
        modern: string;
        retro: string;
        garden: string;
        superhero: string;
        princess: string;
        ocean: string;
        customTheme: string;
        customThemeName: string;
        confirm: string;
        cancel: string;
        descriptions: {
          modern: string;
          retro: string;
          garden: string;
          superhero: string;
          princess: string;
          ocean: string;
        };
      };
      atmosphere: {
        title: string;
        lively: string;
        elegant: string;
        casual: string;
        formal: string;
        creative: string;
        intimate: string;
        descriptions: {
          lively: string;
          elegant: string;
          casual: string;
          formal: string;
          creative: string;
          intimate: string;
        };
      };
      generateButton: string;
      regenerateButton: string;
      generating: string;
      completeAllSteps: string;
      errors: {
        incompleteForm: string;
        unknownError: string;
      };
    };
    result: {
      title: string;
      subtitle: string;
      professionalScore: string;
      venue: string;
      activities: string;
      decorations: string;
      catering: string;
      music: string;
      schedule: string;
      budgetTip: string;
      executionTip: string;
      professionalEvaluation: string;
      creativity: string;
      planning: string;
      budget: string;
      details: string;
      feasibility: string;
      totalScore: string;
      replan: string;
      exportPlan: string;
      currentSelection: string;
      badges: {
        budgetReference: string;
        climaxMoment: string;
        emotionalTouch: string;
        shoppingList: string;
        immersiveExperience: string;
        priceReference: string;
        ceremonialSense: string;
        timeSegmented: string;
        emotionalRhythm: string;
        climaxMarked: string;
        touchMoment: string;
      };
      tips: {
        budgetReminder: string;
        preparationAdvice: string;
      };
      executionDetails: {
        oneWeekBefore: string;
        dayOfParty: string;
        professionalTip: string;
        oneWeekTasks: {
          confirmVenue: string;
          buyDecorations: string;
          prepareProps: string;
        };
        dayOfTasks: {
          setupEarly: string;
          testEquipment: string;
          rehearseHighlights: string;
        };
        tipText: string;
      };
      evaluationLevels: {
        excellent: string;
        good: string;
        fair: string;
        needsImprovement: string;
      };
      emptyState: {
        title: string;
        description: string;
        feature1: string;
        feature2: string;
        feature3: string;
      };
      loading: {
        title: string;
        description: string;
      };
      error: {
        title: string;
        retry: string;
      };
      exportDetails: {
        subtitle: string;
        generatedTime: string;
        planNumber: string;
        brandFooter: string;
        tagline: string;
      };
    };
  };
  language: {
    chinese: string;
    english: string;
  };
  sponsors: {
    title: string;
    partners: {
      crown: string;
      gift: string;
      cake: string;
      music: string;
      camera: string;
      sparkles: string;
      utensils: string;
    };
  };
  testimonials: {
    subtitle: string;
    title: string;
    description: string;
    reviews: {
      [key: string]: {
        name: string;
        role: string;
        comment: string;
      };
    };
  };
  benefits: {
    subtitle: string;
    title: string;
    description: string;
    personalized: {
      title: string;
      description: string;
    };
    professional: {
      title: string;
      description: string;
    };
    budget: {
      title: string;
      description: string;
    };
    creative: {
      title: string;
      description: string;
    };
  };
  partyIdeas: {
    subtitle: string;
    title: string;
    description: string;
    themes: {
      [key: string]: {
        title: string;
        subtitle: string;
        tags: string[];
        features: {
          age: string;
          venue: string;
        };
      };
    };
  };
  community: {
    title: string;
    titleHighlight: string;
    description: string;
    features: {
      shareSuccess: string;
      getInspiration: string;
      consultAdvice: string;
    };
    joinButton: string;
    comingSoon: string;
  };
  footer: {
    brand: string;
    contact: {
      title: string;
      emailSupport: string;
    };
    platforms: {
      title: string;
      wechatMini: string;
      mobileApp: string;
      webVersion: string;
      comingSoon: string;
    };
    help: {
      title: string;
      contactUs: string;
      feedback: string;
    };
    social: {
      title: string;
      wechatPublic: string;
      douyin: string;
      xiaohongshu: string;
      comingSoon: string;
    };
    copyright: string;
    team: string;
  };
}

// 翻译键的类型定义
export type TranslationKey = keyof Translations | string;

// 嵌套键的类型定义
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationPath = NestedKeyOf<Translations>; 