"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PartyFormData, PartyPlan } from '../types/party';

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
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  };

  const generatePartyPlan = async () => {
    // Check if form is complete
    const { partyType, guestCount, venue, budget, theme, atmosphere } = state.formData;
    if (!partyType || !guestCount || !venue || !budget || !theme || !atmosphere) {
      dispatch({ type: 'SET_ERROR', payload: 'Please complete all selections before generating a plan' });
      return;
    }

    // 防止重复调用
    if (state.isLoading) {
      return;
    }

    console.log('🔄 Setting loading to true in Context');
    // 立即设置loading状态
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
      const currentLanguage = localStorage.getItem('language') || 'zh';
      
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
        console.log('✅ Setting result and loading to false');
        dispatch({ type: 'SET_RESULT', payload: data.plan });
        
        // Save to localStorage
        try {
          const saveData = {
            formData: state.formData,
            result: data.plan,
            timestamp: Date.now()
          };
          localStorage.setItem('partyPlanData', JSON.stringify(saveData));
        } catch (error) {
          console.warn('Unable to save to localStorage:', error);
        }
      } else {
        throw new Error('API returned invalid data format');
      }
    } catch (error) {
      console.error('生成派对方案失败:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'An unknown error occurred while generating the plan, please try again later'
      });
    } finally {
      console.log('🏁 Setting loading to false in Context');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearData = () => {
    dispatch({ type: 'CLEAR_DATA' });
    // Clear localStorage
    try {
      localStorage.removeItem('partyPlanData');
    } catch (error) {
      console.warn('Unable to clear localStorage:', error);
    }
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    // Clear localStorage
    try {
      localStorage.removeItem('partyPlanData');
    } catch (error) {
      console.warn('Unable to clear localStorage:', error);
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
      console.warn('Unable to restore data from localStorage:', error);
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