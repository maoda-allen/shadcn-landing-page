"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Translations, TranslationPath } from '../types/translations';
import { devLogger } from '../utils/dev-logger';

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

// 加载翻译文件的异步函数
const loadTranslations = async (language: Language): Promise<Translations> => {
  if (translationsCache[language]) {
    return translationsCache[language]!;
  }

  try {
    const translations = language === 'zh' 
      ? require('../../messages/zh.json')
      : require('../../messages/en.json');
    
    translationsCache[language] = translations;
    return translations;
  } catch (error) {
    devLogger.error('language.load.failed', language, error);
    // 返回默认的中文翻译作为fallback
    const fallback = require('../../messages/zh.json');
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

// 语言提供者组件
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Translations | null>(null);

  // 从localStorage加载语言设置
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = localStorage.getItem('language') as Language;
        const targetLanguage = (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) 
          ? savedLanguage 
          : 'en';
        
        setLanguageState(targetLanguage);
        const loadedTranslations = await loadTranslations(targetLanguage);
        setTranslations(loadedTranslations);
      } catch (error) {
        devLogger.error('language.init.failed', error);
        // 使用默认英文
        const fallbackTranslations = await loadTranslations('en');
        setTranslations(fallbackTranslations);
        setLanguageState('en');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  // 设置语言并保存到localStorage
  const setLanguage = async (lang: Language) => {
    setIsLoading(true);
    try {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      
      const loadedTranslations = await loadTranslations(lang);
      setTranslations(loadedTranslations);
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