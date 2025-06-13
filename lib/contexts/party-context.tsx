"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PartyPlanRequest, PartyPlanResponse } from '@/lib/types/party';

interface PartyState {
  formData: PartyPlanRequest;
  result: PartyPlanResponse | null;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
}

type PartyAction = 
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<PartyPlanRequest> }
  | { type: 'SET_RESULT'; payload: PartyPlanResponse }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_FROM_STORAGE'; payload: PartyPlanRequest };

const initialState: PartyState = {
  formData: {
    partyType: '',
    guestCount: '',
    venue: '',
    budget: '',
    theme: '',
    atmosphere: ''
  },
  result: null,
  isLoading: false,
  error: null,
  currentStep: 1
};

function partyReducer(state: PartyState, action: PartyAction): PartyState {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
        isLoading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'RESET_FORM':
      return {
        ...initialState
      };
    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        formData: action.payload
      };
    default:
      return state;
  }
}

interface PartyContextType {
  state: PartyState;
  updateFormData: (data: Partial<PartyPlanRequest>) => void;
  generatePartyPlan: () => Promise<void>;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export function PartyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(partyReducer, initialState);

  // 从localStorage加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('partyFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedData });
      } catch (error) {
        console.error('Failed to load party data from localStorage:', error);
      }
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('partyFormData', JSON.stringify(state.formData));
  }, [state.formData]);

  const updateFormData = (data: Partial<PartyPlanRequest>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  };

  const generatePartyPlan = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // 这里将来会调用真实的API
      // 现在使用模拟数据
      const mockResult = await generateMockPartyPlan(state.formData);
      dispatch({ type: 'SET_RESULT', payload: mockResult });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '生成派对方案失败，请重试' });
    }
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
    localStorage.removeItem('partyFormData');
  };

  return (
    <PartyContext.Provider value={{
      state,
      updateFormData,
      generatePartyPlan,
      setCurrentStep,
      resetForm
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

// 模拟API调用的函数
async function generateMockPartyPlan(formData: PartyPlanRequest): Promise<PartyPlanResponse> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  const partyTypeMap = {
    'adult': '成人',
    'child': '儿童',
    'elderly': '长辈'
  };

  const venueMap = {
    'indoor': '室内',
    'outdoor': '户外'
  };

  const budgetMap = {
    'low': '经济型',
    'medium': '中档',
    'high': '豪华型'
  };

  const guestCountMap = {
    'small': '10人以内',
    'medium': '10-30人',
    'large': '30人以上'
  };

  return {
    id: Date.now().toString(),
    venueSetup: [
      `${venueMap[formData.venue as keyof typeof venueMap]}场地布置方案`,
      `适合${guestCountMap[formData.guestCount as keyof typeof guestCountMap]}的空间规划`,
      `${budgetMap[formData.budget as keyof typeof budgetMap]}装饰方案`,
      `${formData.theme}主题背景设计`
    ],
    activities: [
      `${partyTypeMap[formData.partyType as keyof typeof partyTypeMap]}专属游戏活动`,
      '生日祝福环节',
      '合影留念时间',
      '音乐舞蹈活动'
    ],
    decorations: [
      `${formData.theme}主题装饰`,
      '生日横幅和气球',
      '主题色彩搭配',
      '灯光氛围营造'
    ],
    catering: [
      '定制生日蛋糕',
      '主题小食拼盘',
      '饮品搭配方案',
      '餐具和餐桌布置'
    ],
    music: [
      `${formData.atmosphere}氛围音乐`,
      '生日歌曲播放',
      '背景音乐推荐',
      '互动音乐游戏'
    ],
    timeline: [
      '13:00 - 客人到达，签到',
      '13:30 - 开场活动',
      '14:30 - 生日蛋糕环节',
      '15:00 - 游戏互动时间',
      '16:00 - 合影留念',
      '16:30 - 派对结束'
    ]
  };
} 