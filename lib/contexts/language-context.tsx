"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// 支持的语言类型
export type Language = 'zh' | 'en';

// 语言上下文类型
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// 创建上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译数据
const translations = {
  zh: require('../../messages/zh.json'),
  en: require('../../messages/en.json'),
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
    console.warn(`Translation key not found: ${path}`);
    return path;
  }
  
  // 如果是对象，说明键路径不完整
  if (typeof result === 'object') {
    console.warn(`Translation key points to object, not string: ${path}`, result);
    return path;
  }
  
  // 其他情况转换为字符串
  return String(result);
}

// 语言提供者组件
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  // 从localStorage加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // 设置语言并保存到localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // 翻译函数
  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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