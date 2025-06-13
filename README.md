# 生日派对创意策划平台

一个专业的生日派对策划工具，帮助用户轻松策划完美的生日庆典。

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

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

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

## 🚀 部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 📝 待实现功能

- [ ] 接入真实的AI API
- [ ] 用户账户系统
- [ ] 方案保存和分享
- [ ] 更多主题模板
- [ ] 供应商推荐
- [ ] 价格估算功能

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## �� 许可证

MIT License
