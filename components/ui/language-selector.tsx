"use client";

import { useLanguage, Language } from '@/lib/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'zh', name: 'Chinese', nativeName: '简体中文' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline-block text-xs">
          {currentLanguage?.nativeName}
        </span>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors ${
                language === lang.code ? 'bg-muted font-medium' : ''
              }`}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <span>{lang.name}（{lang.nativeName}）</span>
                {language === lang.code && (
                  <span className="text-primary">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 