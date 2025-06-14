# 🎉 生日派对策划平台 / Birthday Party Planner

一个专业的生日派对策划工具，支持中英文双语，帮助用户轻松策划完美的生日庆典。

A professional birthday party planning tool with bilingual support (Chinese/English) to help users easily plan perfect birthday celebrations.

## 🎉 项目特色

- **个性化策划**: 根据年龄、人数、场地、预算等因素生成专属方案
- **多样化主题**: 提供丰富的派对主题选择，支持自定义主题
- **全年龄段覆盖**: 儿童生日、成人生日、长辈生日专业方案
- **响应式设计**: 完美适配手机和电脑端
- **SEO优化**: 围绕"birthday party ideas"关键词优化

## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **状态管理**: React Context + useReducer
- **数据存储**: localStorage
- **图标**: Lucide React

## 🚀 快速开始

### 安装依赖
```bash
npm install
# 或 / or
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或 / or
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或 / or
yarn build
```

## 📱 主要功能

### 主页面
- Hero区域展示核心价值
- 功能特色介绍
- 服务项目展示
- 创意案例展示
- 用户评价和FAQ

### 派对策划工具 (`/birthday-party-planner`)
1. **派对类型选择**: 儿童/成人/长辈生日
2. **规模确定**: 小型/中型/大型聚会
3. **场地选择**: 室内/户外场地
4. **预算设置**: 经济型/中档型/豪华型
5. **主题选择**: 预设主题 + 自定义主题
6. **氛围确定**: 6种不同派对氛围
7. **方案生成**: AI生成完整策划方案

### 生成的方案包含
- 场地布置建议
- 活动安排
- 装饰方案
- 餐饮建议
- 音乐氛围
- 时间安排

## 🎨 设计特点

- **紫色主题**: 使用HSL(292°)色相的紫色系配色
- **卡片式布局**: 现代化的卡片设计
- **渐变效果**: 精美的渐变背景和按钮
- **微动画**: 悬停效果和过渡动画
- **深色模式**: 支持明暗主题切换

## 📊 SEO优化

- 围绕"birthday party ideas"核心关键词
- 结构化的H1、H2标签层级
- 语义化的HTML结构
- 优化的meta标签和OpenGraph
- 移动端友好的响应式设计

## 🔧 项目结构

```
├── app/                          # Next.js App Router
│   ├── birthday-party-planner/   # 派对策划页面
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 主页
├── components/                   # 组件目录
│   ├── layout/sections/         # 页面区块组件
│   ├── party/                   # 派对策划相关组件
│   └── ui/                      # 基础UI组件
├── lib/                         # 工具库
│   ├── contexts/                # React Context
│   └── types/                   # TypeScript类型定义
└── public/                      # 静态资源
```

## 🌐 国际化实现 / Internationalization Implementation

### 翻译文件结构 / Translation File Structure
```json
{
  "nav": {
    "brand": "生日派对策划",
    "features": "功能特色"
  },
  "planner": {
    "form": {
      "title": "创建您的专属派对方案",
      "errors": {
        "incompleteForm": "请完成所有选择后再生成方案"
      }
    }
  }
}
```

### 使用翻译 / Using Translations
```tsx
import { useLanguage } from '@/lib/contexts/language-context';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.brand')}</h1>
      <button onClick={() => setLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

## 🔧 开发工具 / Development Tools

### 开发日志系统 / Development Logger
```tsx
import { devLogger } from '@/lib/utils/dev-logger';

// 支持国际化的日志消息
devLogger.log('context.loading.changed', state.isLoading);
devLogger.error('export.failed', error);
```

### Toast通知系统 / Toast Notification System
```tsx
import { toast } from '@/lib/utils/toast';

// 不同类型的通知
toast.success('操作成功');
toast.error('操作失败');
toast.warning('警告信息');
toast.info('提示信息');
```

## 🎯 核心功能 / Core Features

### 派对策划流程 / Party Planning Process
1. **选择派对类型**: 成人/儿童/长辈生日
2. **确定规模**: 小型/中型/大型聚会
3. **选择场地**: 室内/户外场地
4. **设置预算**: 经济型/中档型/豪华型
5. **选择主题**: 预设主题或自定义主题
6. **确定氛围**: 热闹/优雅/轻松等不同氛围

### AI智能生成 / AI-Powered Generation
- **个性化方案**: 根据用户选择生成定制化派对方案
- **专业评分**: 多维度评估方案质量
- **执行指导**: 详细的准备和执行建议
- **方案导出**: 支持导出完整的策划方案

## 🔒 类型安全 / Type Safety

项目使用完整的TypeScript类型定义，确保：
- 翻译键的类型安全
- 组件props的类型检查
- API响应的类型验证
- 状态管理的类型保障

## 📱 响应式设计 / Responsive Design

- **移动优先**: 优先考虑移动设备体验
- **断点适配**: 支持各种屏幕尺寸
- **触摸友好**: 优化触摸交互体验
- **性能优化**: 图片懒加载和代码分割

## 🚀 性能优化 / Performance Optimization

- **代码分割**: 按需加载组件和翻译文件
- **图片优化**: Next.js Image组件优化
- **缓存策略**: 翻译文件和API响应缓存
- **Bundle分析**: 定期分析和优化包大小

## 🤝 贡献指南 / Contributing

欢迎提交Issue和Pull Request来改进项目！

Welcome to submit Issues and Pull Requests to improve the project!

## 📄 许可证 / License

MIT License - 详见 LICENSE 文件

## 📞 联系我们 / Contact

- 邮箱 / Email: support@birthday-party-planner.com
- 网站 / Website: https://birthday-party-planner.com

---

**让每个生日都独一无二 / Make Every Birthday Unique** 🎂
