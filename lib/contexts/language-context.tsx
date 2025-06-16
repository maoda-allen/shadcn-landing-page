"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Translations, TranslationPath } from '../types/translations';
import { devLogger } from '../utils/dev-logger';
import { analytics } from '../utils/analytics';

// 支持的语言类型
export type Language = 'zh' | 'en';

// 语言上下文类型
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

// 创建上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译数据缓存
let translationsCache: { [key in Language]?: Translations } = {};

// 加载翻译文件的异步函数（客户端专用）
const loadClientTranslations = async (language: Language): Promise<Translations> => {
  if (translationsCache[language]) {
    return translationsCache[language]!;
  }

  try {
    // 使用动态 import() 而不是 require()
    const module = language === 'zh' 
      ? await import('../../messages/zh.json')
      : await import('../../messages/en.json');
    
    const translations = module.default as any; // 暂时绕过类型检查
    translationsCache[language] = translations;
    return translations;
  } catch (error) {
    devLogger.error('language.load.failed', language, error);
    // 动态 import() 失败的 fallback
    const fallbackModule = await import('../../messages/zh.json');
    const fallback = fallbackModule.default as any; // 暂时绕过类型检查
    translationsCache[language] = fallback;
    return fallback;
  }
};

// 获取嵌套对象的值
function getNestedValue(obj: any, path: string): string {
  const result = path.split('.').reduce((current, key) => current?.[key], obj);
  
  // 如果结果是字符串，直接返回
  if (typeof result === 'string') {
    return result;
  }
  
  // 如果结果是对象或其他类型，返回原始键名作为fallback
  if (result === undefined || result === null) {
    devLogger.warn('translation.key.not.found', path);
    return path;
  }
  
  // 如果是对象，说明键路径不完整
  if (typeof result === 'object') {
    devLogger.warn('translation.key.points.to.object', path, result);
    return path;
  }
  
  // 其他情况转换为字符串
  return String(result);
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage: Language;
  initialTranslations: Translations;
}

// 语言提供者组件
export function LanguageProvider({ 
  children, 
  initialLanguage, 
  initialTranslations 
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<Translations>(initialTranslations);

  // 组件加载时，用服务器提供的数据填充缓存
  useEffect(() => {
    if (!translationsCache[initialLanguage]) {
      translationsCache[initialLanguage] = initialTranslations;
    }
  }, [initialLanguage, initialTranslations]);


  // 设置语言并保存到localStorage（客户端操作）
  const setLanguage = async (lang: Language) => {
    if (lang === language) return;
    
    // 追踪语言切换事件
    analytics.languageChanged(lang);
    
    setIsLoading(true);
    try {
      const loadedTranslations = await loadClientTranslations(lang);
      setTranslations(loadedTranslations);
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    } catch (error) {
      devLogger.error('language.set.failed', lang, error);
    } finally {
      setIsLoading(false);
    }
  };

  // 翻译函数
  const t = (key: string): string => {
    if (!translations) {
      return key;
    }
    return getNestedValue(translations, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 使用语言上下文的Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 