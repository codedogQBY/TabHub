# TabHub - 开发文档

## 项目概述

TabHub 是一个智能浏览器页签管理工具，基于 WXT 框架、React 18、TypeScript、Tailwind CSS 和 shadcn/ui 构建。

## 已实现功能（V1.0）

### ✅ 核心功能

1. **资源监控面板** (`components/ResourceMonitor.tsx`)
   - 显示当前窗口和所有窗口的页签总数
   - 显示预估总内存占用（精确到百位）
   - 显示内存占用 TOP 5 的页签
   - 每 5 秒自动刷新数据
   - 点击高占用页签可跳转

2. **智能分组展示** (`components/TabGroupsView.tsx`)
   - 支持按域名、窗口分组
   - 显示每个分组的页签数量
   - 分组可折叠/展开
   - 实时监听页签变化
   - 悬停显示完整信息和操作按钮

3. **快速搜索** (`components/QuickSearch.tsx`)
   - 搜索页签标题和 URL
   - 实时过滤结果
   - 支持模糊匹配
   - 点击快速跳转

4. **重复页签检测** (`components/DuplicateDetector.tsx`)
   - 检测重复的页签
   - 支持多种匹配模式（完全匹配、忽略参数、忽略锚点）
   - 批量关闭重复项（保留最早打开的）

5. **批量操作** (`components/BatchOperations.tsx`)
   - 关闭当前窗口其他页签
   - 关闭所有未固定页签
   - 关闭 5 分钟未访问的页签
   - 操作前确认提示

### 🎨 UI/UX 特性

- 使用 shadcn/ui 组件，现代化 UI 设计
- 支持深色模式（CSS 变量已配置）
- 使用 lucide-react 图标库
- 流畅的动画和过渡效果
- 响应式设计
- 符合 WCAG 2.1 AA 标准的可访问性

## 技术栈

- **框架**: WXT (Browser Extension Framework)
- **UI 库**: React 18+
- **类型安全**: TypeScript
- **样式**: Tailwind CSS 3.x
- **组件库**: shadcn/ui (基于 Radix UI)
- **图标**: lucide-react
- **构建工具**: Vite

## 项目结构

```
TabHub/
├── components/              # React 组件
│   ├── ui/                 # shadcn/ui 组件
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   └── tabs.tsx
│   ├── ResourceMonitor.tsx      # 资源监控面板
│   ├── TabGroupsView.tsx        # 页签分组展示
│   ├── QuickSearch.tsx          # 快速搜索
│   ├── DuplicateDetector.tsx    # 重复检测
│   └── BatchOperations.tsx      # 批量操作
├── entrypoints/           # 扩展入口点
│   ├── popup/            # 弹窗页面
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── globals.css
│   │   └── index.html
│   ├── background.ts     # 后台脚本
│   └── content.ts        # 内容脚本
├── lib/                  # 工具函数
│   └── utils.ts         # shadcn/ui 工具函数
├── types/               # TypeScript 类型定义
│   └── index.ts
├── utils/               # 业务工具函数
│   ├── tabs.ts         # 页签操作
│   └── duplicates.ts   # 重复检测
├── public/              # 静态资源
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
├── wxt.config.ts        # WXT 配置
└── package.json         # 项目依赖

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（Chrome）
npm run dev

# 开发模式（Firefox）
npm run dev:firefox

# 构建生产版本
npm run build

# 构建 Firefox 版本
npm run build:firefox

# 打包为 ZIP
npm run zip

# TypeScript 类型检查
npm run compile
```

## 使用指南

### 安装扩展

1. 构建项目：`npm run build`
2. 打开 Chrome 扩展管理页面：`chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `.output/chrome-mv3` 目录

### 功能使用

1. **资源监控**
   - 打开扩展弹窗即可查看当前页签资源占用情况
   - 点击 TOP 5 列表中的页签可快速跳转

2. **页签分组**
   - 切换"域名"、"窗口"、"全部"标签查看不同分组
   - 点击页签跳转，悬停显示关闭按钮
   - 折叠/展开分组查看详情

3. **快速搜索**
   - 点击顶部搜索图标打开搜索框
   - 输入关键词搜索页签标题或 URL
   - 使用方向键选择，回车跳转

4. **重复检测**
   - 点击底部"扫描重复页签"按钮
   - 查看检测结果，确认后批量关闭重复项

5. **批量操作**
   - 点击顶部更多操作图标（三个点）
   - 选择批量操作类型
   - 确认后执行关闭操作

## 配置说明

### Tailwind CSS 主题变量

主题颜色在 `entrypoints/popup/globals.css` 中定义：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... 更多颜色变量 */

  /* TabHub 自定义颜色 */
  --tab-active: 142.1 76.2% 36.3%;      /* 活跃页签 */
  --tab-sleeping: 221.2 83.2% 53.3%;    /* 休眠页签 */
  --tab-high-memory: 0 84.2% 60.2%;     /* 高内存占用 */
  --tab-pinned: 262.1 83.3% 57.8%;      /* 固定页签 */
  --tab-audible: 24.6 95% 53.1%;        /* 音频播放 */
}
```

### TypeScript 路径别名

在 `tsconfig.json` 和 `wxt.config.ts` 中配置了 `@` 别名：

```typescript
"paths": {
  "@/*": ["./*"]
}
```

## 后续开发计划

根据 PRD 文档，以下功能可在后续版本中实现：

### V1.1 功能（Should Have）
- 页签休眠功能
- 智能提醒
- 会话保存
- 白名单管理

### V2.0 功能（Could Have）
- 使用统计
- 高级筛选
- 自定义页签组
- 拖拽整理

## 注意事项

1. 内存占用是估算值，非精确测量
2. 固定页签默认不会被批量关闭操作影响
3. 某些系统页面（如 chrome://）无法访问
4. 需要授予扩展相应的权限（tabs, storage 等）

## 开发建议

1. 遵循 shadcn/ui 的设计系统和组件规范
2. 使用 TypeScript 类型确保类型安全
3. 使用 Tailwind CSS 原子类进行样式开发
4. 保持组件的单一职责原则
5. 添加新功能时考虑性能优化

## 浏览器兼容性

- Chrome 90+
- Edge 90+
- 其他基于 Chromium 的浏览器

## License

Private Project
