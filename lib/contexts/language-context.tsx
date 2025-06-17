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

// 加载翻译文件的异步函数（客户端专用）
const loadClientTranslations = async (language: Language): Promise<Translations> => {
  if (translationsCache[language]) {
    return translationsCache[language]!;
  }

  try {
    // 使用动态 import() 而不是 require()
    const translationModule = language === 'zh' 
      ? await import('../../messages/zh.json')
      : await import('../../messages/en.json');
    
    const translations = translationModule.default as any; // 暂时绕过类型检查
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
  if (!obj || typeof obj !== 'object') {
    return path;
  }
  
  const result = path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key];
    }
    return undefined;
  }, obj);
  
  // 如果结果是字符串，直接返回
  if (typeof result === 'string') {
    return result;
  }
  
  // 如果结果是对象或其他类型，返回原始键名作为fallback
  if (result === undefined || result === null) {
    console.warn(`Translation key not found: ${path}`);
    return path;
  }
  
  // 如果是对象，说明键路径不完整
  if (typeof result === 'object') {
    console.warn(`Translation key points to object: ${path}`, result);
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
  const [isHydrated, setIsHydrated] = useState(false);

  // 处理客户端水合
  useEffect(() => {
    setIsHydrated(true);
    
    // 确保初始翻译数据在客户端可用
    if (!translationsCache[initialLanguage]) {
      translationsCache[initialLanguage] = initialTranslations;
    }
    
    // 检查localStorage中是否有保存的语言设置
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && savedLanguage !== initialLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
        // 如果有不同的语言设置，异步加载
        loadClientTranslations(savedLanguage).then((loadedTranslations) => {
          setTranslations(loadedTranslations);
          setLanguageState(savedLanguage);
        }).catch(() => {
          // 如果加载失败，保持使用初始翻译
          console.warn('Failed to load saved language, using initial language');
        });
      }
    } catch (error) {
      // localStorage访问失败，保持使用初始语言
      console.warn('Failed to access localStorage, using initial language');
    }
  }, [initialLanguage, initialTranslations]);

  // 设置语言并保存到localStorage（客户端操作）
  const setLanguage = async (lang: Language) => {
    if (lang === language) return;
    
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

  // 翻译函数 - 添加额外的安全检查
  const t = (key: string): string => {
    // 先尝试从当前翻译获取
    if (translations && isHydrated) {
      const result = getNestedValue(translations, key);
      if (result !== key) {
        return result;
      }
    }
    
    // 如果当前翻译失败，尝试从初始翻译获取
    if (initialTranslations) {
      const fallbackResult = getNestedValue(initialTranslations, key);
      if (fallbackResult !== key) {
        return fallbackResult;
      }
    }
    
    // 最后的fallback - 返回键名
    console.warn(`Translation failed for key: ${key}, language: ${language}, isHydrated: ${isHydrated}`);
    return key;
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