// 开发环境日志工具，支持国际化
interface LogMessages {
  zh: { [key: string]: string };
  en: { [key: string]: string };
}

const logMessages: LogMessages = {
  zh: {
    'context.loading.changed': '🔄 Context isLoading 状态变化',
    'context.loading.set.true': '🔄 设置loading为true',
    'context.loading.set.false': '🏁 设置loading为false',
    'context.result.set': '✅ 设置结果并将loading设为false',
    'party.plan.generation.failed': '生成派对方案失败',
    'localStorage.save.failed': '无法保存到localStorage',
    'localStorage.clear.failed': '无法清除localStorage',
    'localStorage.restore.failed': '无法从localStorage恢复数据',
    'translation.key.not.found': '翻译键未找到',
    'translation.key.points.to.object': '翻译键指向对象而非字符串',
    'language.load.failed': '加载语言翻译失败',
    'language.init.failed': '初始化语言失败',
    'language.set.failed': '设置语言失败',
    'export.failed': '导出失败'
  },
  en: {
    'context.loading.changed': '🔄 Context isLoading state changed',
    'context.loading.set.true': '🔄 Setting loading to true',
    'context.loading.set.false': '🏁 Setting loading to false',
    'context.result.set': '✅ Setting result and loading to false',
    'party.plan.generation.failed': 'Party plan generation failed',
    'localStorage.save.failed': 'Unable to save to localStorage',
    'localStorage.clear.failed': 'Unable to clear localStorage',
    'localStorage.restore.failed': 'Unable to restore data from localStorage',
    'translation.key.not.found': 'Translation key not found',
    'translation.key.points.to.object': 'Translation key points to object, not string',
    'language.load.failed': 'Failed to load translations for language',
    'language.init.failed': 'Failed to initialize language',
    'language.set.failed': 'Failed to set language',
    'export.failed': 'Export failed'
  }
};

class DevLogger {
  private getLanguage(): 'zh' | 'en' {
    if (typeof window === 'undefined') return 'zh';
    return (localStorage.getItem('language') as 'zh' | 'en') || 'zh';
  }

  private getMessage(key: string, ...args: any[]): string {
    const language = this.getLanguage();
    const message = logMessages[language][key] || logMessages.zh[key] || key;
    
    // 简单的参数替换
    if (args.length > 0) {
      return `${message}: ${args.join(', ')}`;
    }
    return message;
  }

  log(key: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.getMessage(key, ...args));
    }
  }

  warn(key: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(this.getMessage(key, ...args));
    }
  }

  error(key: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.error(this.getMessage(key, ...args));
    }
  }

  info(key: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.info(this.getMessage(key, ...args));
    }
  }
}

export const devLogger = new DevLogger(); 