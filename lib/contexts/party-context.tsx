"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PartyFormData, PartyPlan } from '../types/party';
import { devLogger } from '../utils/dev-logger';
import { analytics } from '../utils/analytics';

interface PartyState {
  formData: PartyFormData;
  result: PartyPlan | null;
  isLoading: boolean;
  error: string | null;
}

type PartyAction = 
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<PartyFormData> }
  | { type: 'SET_FORM_DATA'; payload: PartyFormData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: PartyPlan }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FORM' }
  | { type: 'CLEAR_DATA' };

const initialState: PartyState = {
  formData: {
    partyType: '' as any,
    guestCount: '' as any,
    venue: '' as any,
    budget: '' as any,
    theme: '',
    atmosphere: '' as any,
  },
  result: null,
  isLoading: false,
  error: null,
};

function partyReducer(state: PartyState, action: PartyAction): PartyState {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        error: null,
      };
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'RESET_FORM':
      return initialState;
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
}

interface PartyContextType {
  state: PartyState;
  updateFormData: (data: Partial<PartyFormData>) => void;
  generatePartyPlan: () => Promise<void>;
  resetForm: () => void;
  clearData: () => void;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export function PartyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(partyReducer, initialState);

  const updateFormData = (data: Partial<PartyFormData>) => {
    // 追踪表单字段变更
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        analytics.formFieldChanged(key, String(value));
        
        // 特别追踪主题选择
        if (key === 'theme') {
          analytics.themeSelected(String(value), state.formData.partyType || 'unknown');
        }
      }
    });
    
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  };

  const generatePartyPlan = async () => {
    // 防止重复调用
    if (state.isLoading) {
      return;
    }

    // Check if form is complete BEFORE setting loading
    const { partyType, guestCount, venue, budget, theme, atmosphere } = state.formData;
    if (!partyType || !guestCount || !venue || !budget || !theme || !atmosphere) {
      // 获取当前语言设置来显示正确的错误消息
      const currentLanguage = localStorage.getItem('language') || 'en';
      
      // 加载翻译文件
      const translations = currentLanguage === 'zh' 
        ? require('../../messages/zh.json')
        : require('../../messages/en.json');
      
      const errorMessage = translations.planner.form.errors.incompleteForm;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      // 注意：这里不设置loading状态，因为验证失败不应该显示loading
      return;
    }

    // 验证通过，开始设置loading状态
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    // 滚动到结果区域（在移动设备上特别有用）
    setTimeout(() => {
      const resultElement = document.querySelector('[data-result-area]');
      if (resultElement) {
        resultElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);

    try {
      // 获取当前语言设置
      const currentLanguage = localStorage.getItem('language') || 'en';
      
      const response = await fetch('/api/generate-party-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...state.formData,
          language: currentLanguage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      if (data.success && data.plan) {
        dispatch({ type: 'SET_RESULT', payload: data.plan });
        
        // 追踪成功生成派对方案
        analytics.partyPlanGenerated(
          state.formData.partyType || 'unknown',
          state.formData.theme || 'unknown'
        );
        
        // Save to localStorage
        try {
          const saveData = {
            formData: state.formData,
            result: data.plan,
            timestamp: Date.now()
          };
          localStorage.setItem('partyPlanData', JSON.stringify(saveData));
        } catch (error) {
          devLogger.warn('Unable to save to localStorage:', error);
        }
      } else {
        throw new Error('API returned invalid data format');
      }
    } catch (error) {
      devLogger.error('party.plan.generation.failed', error);
      
      // 追踪错误
      const apiErrorMessage = error instanceof Error ? error.message : 'Unknown error';
      analytics.errorOccurred('party_generation_failed', apiErrorMessage);
      
      // 获取当前语言设置来显示正确的错误消息
      const currentLanguage = localStorage.getItem('language') || 'en';
      
      // 加载翻译文件
      const translations = currentLanguage === 'zh' 
        ? require('../../messages/zh.json')
        : require('../../messages/en.json');
      
      let errorMessage: string;
      if (error instanceof Error && error.message !== 'API returned invalid data format' && error.message !== 'Failed to generate plan') {
        errorMessage = error.message;
      } else {
        errorMessage = translations.planner.form.errors.unknownError;
      }
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: errorMessage
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearData = () => {
    dispatch({ type: 'CLEAR_DATA' });
    // Clear localStorage
    try {
      localStorage.removeItem('partyPlanData');
    } catch (error) {
      devLogger.warn('Unable to clear localStorage:', error);
    }
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    // Clear localStorage
    try {
      localStorage.removeItem('partyPlanData');
    } catch (error) {
      devLogger.warn('Unable to clear localStorage:', error);
    }
  };

  // Try to restore data from localStorage when component mounts
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('partyPlanData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Check if data is expired (7 days)
        const isExpired = Date.now() - parsedData.timestamp > 7 * 24 * 60 * 60 * 1000;
        
        if (!isExpired && parsedData.formData && parsedData.result) {
          dispatch({ type: 'SET_FORM_DATA', payload: parsedData.formData });
          dispatch({ type: 'SET_RESULT', payload: parsedData.result });
        } else if (isExpired) {
          localStorage.removeItem('partyPlanData');
        }
      }
    } catch (error) {
      devLogger.warn('Unable to restore data from localStorage:', error);
    }
  }, []);

  return (
    <PartyContext.Provider value={{ 
      state, 
      updateFormData, 
      generatePartyPlan, 
      resetForm,
      clearData
    }}>
      {children}
    </PartyContext.Provider>
  );
}

export function useParty() {
  const context = useContext(PartyContext);
  if (context === undefined) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return context;
} 