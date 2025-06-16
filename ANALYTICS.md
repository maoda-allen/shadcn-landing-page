# Google Analytics 配置说明

## 概述
本项目已集成 Google Analytics (GA4) 用于追踪用户行为和应用使用情况。

## 配置信息
- **Measurement ID**: `G-TYW6BEQR0Z`
- **实现方式**: Next.js Script 组件 + 自定义事件追踪

## 追踪的事件

### 1. 派对策划相关事件
- **party_plan_generated**: 成功生成派对方案
  - 参数: party_type, theme
- **party_plan_exported**: 导出派对方案
  - 参数: format (png)
- **theme_selected**: 选择主题
  - 参数: theme, party_type

### 2. 表单交互事件
- **form_field_changed**: 表单字段变更
  - 参数: field_name, field_value

### 3. 设置相关事件
- **language_changed**: 语言切换
  - 参数: language (zh/en)

### 4. 功能使用事件
- **feature_used**: 功能使用
  - 参数: feature_name, feature_details

### 5. 错误追踪事件
- **error_occurred**: 错误发生
  - 参数: error_type, error_message

### 6. 导航事件
- **navigation_click**: 导航点击
  - 参数: link_name, destination

## 技术实现

### 主要文件
1. `app/layout.tsx` - 集成 GA 脚本
2. `lib/utils/analytics.ts` - 分析工具函数
3. `lib/contexts/party-context.tsx` - 派对策划追踪
4. `lib/contexts/language-context.tsx` - 语言切换追踪
5. `components/party/party-result-display.tsx` - 导出功能追踪

### 使用方法
```typescript
import { analytics } from '@/lib/utils/analytics';

// 追踪自定义事件
analytics.featureUsed('feature_name', 'details');

// 追踪派对生成
analytics.partyPlanGenerated('birthday', 'superhero');

// 追踪错误
analytics.errorOccurred('api_error', 'Failed to connect');
```

## 隐私和合规
- 只追踪匿名使用数据
- 不收集个人身份信息
- 符合 GDPR 要求
- 用户可以通过浏览器设置禁用追踪

## 在 Google Analytics 中查看数据
1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择对应的 Property (G-TYW6BEQR0Z)
3. 查看实时报告或行为报告
4. 使用自定义事件名称进行筛选

## 开发环境
在开发环境中，事件也会被发送到 GA。如果需要禁用开发环境追踪，可以在 `analytics.ts` 中添加环境检查：

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) return; // 跳过开发环境追踪
``` 