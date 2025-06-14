"use client";

import React, { createContext, useContext, useReducer } from 'react';
import { PartyFormData, PartyPlan } from '../types/party';

interface PartyState {
  formData: Partial<PartyFormData>;
  result: PartyPlan | null;
  isLoading: boolean;
  error: string | null;
}

type PartyAction = 
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<PartyFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: PartyPlan }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_FORM' };

const initialState: PartyState = {
  formData: {},
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
    default:
      return state;
  }
}

interface PartyContextType {
  state: PartyState;
  updateFormData: (data: Partial<PartyFormData>) => void;
  generatePartyPlan: () => Promise<void>;
  resetForm: () => void;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export function PartyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(partyReducer, initialState);

  const updateFormData = (data: Partial<PartyFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  };

  const generatePartyPlan = async () => {
    // 检查表单是否完整
    const { partyType, guestCount, venue, budget, theme, atmosphere } = state.formData;
    if (!partyType || !guestCount || !venue || !budget || !theme || !atmosphere) {
      dispatch({ type: 'SET_ERROR', payload: '请完成所有选择后再生成方案' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await fetch('/api/generate-party-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成方案失败');
      }

      if (data.success && data.data) {
        dispatch({ type: 'SET_RESULT', payload: data.data });
        
        // 保存到 localStorage
        try {
          localStorage.setItem('partyPlan', JSON.stringify({
            formData: state.formData,
            result: data.data,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.warn('无法保存到 localStorage:', error);
        }
      } else {
        throw new Error('API 返回数据格式错误');
      }
    } catch (error) {
      console.error('生成派对方案失败:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : '生成方案时出现未知错误，请稍后重试' 
      });
    }
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    // 清除 localStorage
    try {
      localStorage.removeItem('partyPlan');
    } catch (error) {
      console.warn('无法清除 localStorage:', error);
    }
  };

  // 组件挂载时尝试从 localStorage 恢复数据
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('partyPlan');
      if (saved) {
        const { formData, result, timestamp } = JSON.parse(saved);
        // 检查数据是否过期（7天）
        const isExpired = Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000;
        
        if (!isExpired && formData && result) {
          dispatch({ type: 'UPDATE_FORM_DATA', payload: formData });
          dispatch({ type: 'SET_RESULT', payload: result });
        } else if (isExpired) {
          localStorage.removeItem('partyPlan');
        }
      }
    } catch (error) {
      console.warn('无法从 localStorage 恢复数据:', error);
    }
  }, []);

  return (
    <PartyContext.Provider value={{
      state,
      updateFormData,
      generatePartyPlan,
      resetForm,
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