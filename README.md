浏览器页签管理插件 - 产品需求文档（PRD）
📋 文档信息

产品名称: TabHub
版本: V1.0
文档日期: 2024
文档状态: Draft
目标平台: Chrome / Edge / Firefox


1️⃣ 产品概述
1.1 产品定位
一款智能浏览器页签管理工具，帮助用户监控、整理和优化大量打开的浏览器页签，降低内存占用，提升浏览效率。
1.2 核心价值

💡 可视化: 让用户清楚看到页签资源占用
🧹 自动化: 智能识别和清理无用页签
🎯 高效化: 快速定位和管理目标页签


2️⃣ 用户研究
2.1 目标用户

开发者/程序员: 经常查文档，开大量技术页签
产品/运营: 多项目并行，页签混乱
研究人员/学生: 查资料时开很多参考页面
重度浏览器用户: 习惯性不关页签

2.2 用户痛点



痛点
影响
频率



页签太多找不到目标页面
效率低
每天多次


浏览器卡顿、内存占用高
体验差
持续性


不知道哪些页签在消耗资源
无从下手
经常


重复打开相同页面
资源浪费
每天数次


关闭页签时担心后面还需要
决策困难
每次清理


想按项目/任务组织页签
混乱无序
持续性



3️⃣ 技术栈选型
3.1 前端框架

React 18+: 组件化开发，生态成熟
TypeScript: 类型安全，提升代码质量
Vite: 快速构建，开发体验好

3.2 UI 组件库

shadcn/ui: 
基于 Radix UI 构建
可访问性优秀（WCAG 2.1 AA 标准）
组件源码可控，无黑盒依赖
原生支持深色模式
适合浏览器插件的轻量化需求



3.3 样式方案

Tailwind CSS: 
原子化 CSS，样式可复用
与 shadcn/ui 完美配合
支持响应式设计
打包后体积小



3.4 图标系统

lucide-react: 
1000+ 简洁图标
一致的设计风格
体积小，按需加载
支持自定义尺寸和颜色
与 shadcn/ui 官方推荐搭配



3.5 状态管理

Zustand 或 Jotai: 
轻量级（< 3KB）
API 简洁
适合插件场景



3.6 动画库（可选）

Framer Motion: 流畅的过渡动画
或使用 Tailwind CSS 内置动画

3.7 浏览器 API

Chrome Extensions Manifest V3
Tabs API
Storage API
Notifications API
Alarms API


4️⃣ 功能架构
TabMaster 浏览器插件
│
├── 📊 监控模块
│   ├── 资源概览面板
│   ├── 页签列表展示
│   └── 实时数据更新
│
├── 🔍 查找模块
│   ├── 快速搜索
│   ├── 智能分组
│   └── 筛选排序
│
├── 🧹 清理模块
│   ├── 重复页签检测
│   ├── 页签休眠
│   └── 批量关闭
│
├── 💾 保存模块
│   ├── 会话保存
│   ├── 页签组管理
│   └── 历史恢复
│
└── ⚙️ 设置模块
    ├── 规则配置
    ├── 白名单管理
    └── 偏好设置


5️⃣ 功能优先级（MoSCoW）
✅ Must Have (V1.0 必须有)
1. 资源监控面板
功能描述: 在插件弹窗或侧边栏显示当前浏览器的页签资源概况
功能点:

显示当前窗口页签总数
显示所有窗口页签总数
显示预估总内存占用（精确到百位）
显示内存占用 TOP5 的页签
数据每 5 秒自动刷新
点击高占用页签可跳转

使用组件:

shadcn/ui: Card, Progress, Badge
lucide: Activity, Zap, TrendingUp, Cpu


2. 智能分组展示
功能描述: 自动将页签按域名、窗口等维度分组，便于用户快速定位
功能点:

默认按域名分组（相同主域名归为一组）
显示每个分组的页签数量
支持切换分组维度（域名/窗口/无分组）
分组可折叠/展开，默认展开
分组按页签数量倒序排列
每个分组显示代表性 favicon

使用组件:

shadcn/ui: Accordion, Tabs, ScrollArea
lucide: Globe, Layers, Layout, ChevronDown

性能要求:

500 个页签时分组计算不超过 100ms
分组切换动画流畅（60fps）


3. 重复页签检测
功能描述: 自动检测用户打开的重复页签，提供合并或关闭选项
功能点:

新打开页签时，如果已存在相同 URL，弹出提示
支持 3 种匹配模式：
完全匹配（URL 完全相同）
忽略参数（域名+路径相同）
忽略锚点（忽略 # 后内容）


手动触发"扫描重复页签"功能
扫描结果页显示所有重复组
提供多种保留策略选择

保留策略:

保留最早打开的
保留最新打开的
保留当前激活的
保留固定的
保留有音频播放的

配置项:

匹配模式（默认：忽略参数）
自动处理方式（提示/自动关闭/自动跳转）
白名单网站（允许重复）

使用组件:

shadcn/ui: AlertDialog, Badge, Button, Separator
lucide: Copy, Clock, Circle, ExternalLink, Trash2, XCircle


4. 快速搜索
功能描述: 通过快捷键或搜索框快速查找目标页签
功能点:

快捷键 Ctrl+Shift+K (Mac: Cmd+Shift+K) 呼出搜索
搜索框支持实时过滤
搜索范围：页签标题 + URL
支持模糊匹配
显示搜索结果列表（标题+favicon+URL）
方向键上下选择，回车跳转
ESC 关闭搜索框
高亮匹配关键词

使用组件:

shadcn/ui: Command, Input, ScrollArea
lucide: Search, Filter, FileQuestion

性能要求:

搜索响应时间 < 50ms
支持 1000+ 页签流畅搜索


5. 批量操作
功能描述: 提供多种批量关闭页签的快捷方式
功能点:

关闭当前分组所有页签
关闭所有未固定页签
关闭 X 分钟未访问的页签
关闭除当前页签外的其他页签
关闭所有重复页签
关闭左侧/右侧所有页签
操作前弹出确认提示
支持撤销操作（30 秒内）

安全机制:

固定页签默认不关闭
白名单网站不关闭
正在播放音频的页签二次确认
有未保存表单的页签警告

使用组件:

shadcn/ui: DropdownMenu, Button, AlertDialog
lucide: MoreVertical, Trash2, X, AlertTriangle


🟢 Should Have (V1.1 应该有)
6. 页签休眠功能
功能描述: 将长时间未访问的页签休眠，释放内存，需要时一键恢复
功能点:

手动休眠：右键菜单"休眠此页签"
批量休眠：选中多个页签批量休眠
自动休眠：根据规则自动休眠
休眠后页签显示特殊图标（💤）
休眠页签不消耗原页面内存
点击休眠页签自动恢复
休眠前保存页面滚动位置

自动休眠规则:

超过 X 分钟未访问（默认 30 分钟）
非当前窗口的页签
不休眠：固定页签/正在播放音频/有表单输入/白名单网站

配置项:

启用/禁用自动休眠
休眠时间阈值（5/10/30/60 分钟）
白名单管理
是否保留表单数据

使用组件:

shadcn/ui: Switch, Slider, Checkbox, Badge
lucide: Moon, Sun, Pin, Volume2


7. 智能提醒
功能描述: 根据页签数量和内存占用情况，智能提醒用户清理
功能点:

页签数量超过阈值提醒
内存占用过高提醒
重复页签提醒
可自定义提醒规则
提醒可一键关闭或执行清理

配置项:

页签数量阈值（默认 20）
内存占用阈值（默认 2GB）
提醒频率（每小时/每天）

使用组件:

shadcn/ui: Toast, Alert
lucide: Bell, AlertTriangle, Info


8. 会话保存
功能描述: 保存当前页签状态，支持随时恢复
功能点:

保存当前所有页签为会话
会话包含：URL、标题、分组信息
会话命名（默认：日期+时间）
会话列表展示（名称、页签数、保存时间）
一键恢复会话（新窗口打开）
删除会话
导出会话为 JSON/书签文件

自动保存:

关闭浏览器前自动保存
定时自动备份（可选）
保留最近 10 次会话

使用组件:

shadcn/ui: Table, Popover, Dialog
lucide: Save, FolderOpen, Clock, Download


9. 白名单管理
功能描述: 设置特殊规则的网站列表
功能点:

设置永不关闭的网站
设置允许重复的网站
设置不自动休眠的网站
快速添加当前页面到白名单
支持通配符匹配（*.google.com）
白名单导入导出

使用组件:

shadcn/ui: Table, Input, Button, Badge
lucide: Shield, Plus, Trash2


🟡 Could Have (V2.0 可以有)
10. 使用统计
功能点:

页签数量趋势图
最常访问网站统计
资源节省报告
每日/每周清理报告

使用组件:

shadcn/ui: Card, Separator
lucide: BarChart3, PieChart, TrendingUp


11. 高级筛选
功能点:

按访问时间筛选
按资源占用排序
按域名/标签筛选
组合筛选条件

使用组件:

shadcn/ui: Select, Checkbox, RadioGroup
lucide: Filter, SortAsc, SortDesc


12. 自定义页签组
功能点:

手动创建页签组
拖拽整理页签
页签组标签/颜色
跨窗口管理

使用组件:

shadcn/ui: Dialog, Input, ColorPicker
lucide: FolderPlus, Tag, Palette


⚪ Won't Have (暂不考虑)

跨设备同步
AI 智能推荐
浏览行为分析


6️⃣ UI 组件清单
6.1 需要安装的 shadcn/ui 组件
核心组件:

accordion - 分组折叠
alert - 提示信息
alert-dialog - 确认对话框
avatar - 页签图标
badge - 标签/徽章
button - 按钮
card - 卡片容器

输入组件:

checkbox - 复选框
input - 输入框
label - 标签
radio-group - 单选组
select - 下拉选择
slider - 滑块
switch - 开关

布局组件:

scroll-area - 滚动区域
separator - 分隔线
tabs - 标签页切换
sheet - 侧边抽屉
dialog - 对话框

交互组件:

command - 快捷搜索
dropdown-menu - 下拉菜单
popover - 弹出框
toast - 通知提示
toggle-group - 切换组

数据展示:

progress - 进度条
table - 表格

6.2 使用的 lucide 图标
状态图标:

Circle - 激活状态
Moon - 休眠状态
Loader2 - 加载中
Volume2 - 音频播放
Pin - 固定页签

操作图标:

X - 关闭
RefreshCw - 刷新
Sun - 唤醒
Copy - 复制/重复
ExternalLink - 外部链接
Trash2 - 删除
Save - 保存
MoreVertical - 更多操作

分类图标:

Globe - 域名
Layout - 窗口
Layers - 分组
Clock - 时间
Cpu - 内存/资源

提示图标:

AlertTriangle - 警告
XCircle - 错误
CheckCircle2 - 成功
Info - 信息
Bell - 提醒

功能图标:

Search - 搜索
Filter - 筛选
Settings - 设置
Activity - 活动/统计
Zap - 性能
TrendingUp - 趋势
BarChart3 - 柱状图
PieChart - 饼图
FolderOpen - 会话
Download - 下载
ChevronDown - 展开
Shield - 白名单
Palette - 主题


7️⃣ UI 设计规范
7.1 界面布局
弹窗模式:

宽度: 400px
高度: 600px
最大高度: 90vh

侧边栏模式:

默认宽度: 350px
最小宽度: 300px
最大宽度: 500px
支持拖拽调整大小

7.2 主界面结构
顶部区域 (固定):

搜索框
设置按钮

资源概览 (固定):

页签总数
内存占用进度条
快速清理按钮

分组切换 (固定):

全部/当前窗口/域名/窗口
Tab 组件切换

页签列表 (可滚动):

Accordion 折叠分组
每个分组显示页签数量和内存占用
单个页签显示：图标、标题、URL、状态、操作按钮

底部操作栏 (固定):

批量操作菜单
扫描重复按钮
保存会话按钮

7.3 颜色系统
主题支持:

浅色主题（默认）
深色主题
跟随系统

状态颜色（使用 shadcn/ui CSS 变量）:

活跃页签: 绿色 (--tab-active)
休眠页签: 蓝色 (--tab-sleeping)
高内存占用: 红色 (--tab-high-memory)
固定页签: 紫色 (--tab-pinned)
音频播放: 橙色 (--tab-audible)

7.4 间距规范
组件间距:

卡片内边距: 16px (p-4)
列表项间距: 12px (gap-3)
区块间距: 24px (gap-6)

图标尺寸:

小图标: 12px (h-3 w-3) - 徽章内
中等图标: 16px (h-4 w-4) - 按钮内
大图标: 20px (h-5 w-5) - 卡片标题

按钮尺寸:

小按钮: 24px (h-6 w-6)
中等按钮: 32px (h-8 w-8)
大按钮: 40px (h-10 w-10)

7.5 动画效果
使用场景:

悬停效果: 背景色过渡 (transition-colors)
按下效果: 缩放动画 (active:scale-95)
进入动画: 淡入 (fade-in)
侧边栏: 滑入 (slide-in)
加载状态: 旋转 (animate-spin)

性能要求:

所有动画保持 60fps
使用 CSS transform 和 opacity
避免触发重排（reflow）


8️⃣ 交互规范
8.1 键盘快捷键



快捷键
功能



Ctrl+Shift+K
打开快速搜索


Ctrl+Shift+D
一键去重


Ctrl+Shift+S
保存会话


Tab
焦点切换


Enter
确认/跳转


Esc
关闭对话框


↑↓
列表导航


8.2 鼠标交互
页签列表项:

单击：跳转到该页签
悬停：显示完整标题和操作按钮
右键：显示上下文菜单（休眠/关闭/固定）

分组标题:

单击：折叠/展开
悬停：显示快速操作（关闭全部/休眠全部）

按钮:

悬停：背景色变化
按下：轻微缩放动画
禁用：降低不透明度 + 禁止点击

8.3 反馈机制
即时反馈:

操作后显示 Toast 通知
危险操作显示确认对话框
加载状态显示 Loader 动画

撤销机制:

批量关闭后 30 秒内可撤销
Toast 通知中显示撤销按钮


9️⃣ 非功能性需求
9.1 性能要求

页签列表渲染 < 200ms（100 个页签）
搜索响应 < 50ms
插件自身内存占用 < 50MB
CPU 占用 < 1%（空闲时）
支持 1000+ 页签流畅运行

9.2 兼容性

Chrome 90+
Edge 90+
Firefox 88+（如需支持）

9.3 安全性

不收集用户浏览数据
所有数据本地存储（localStorage / chrome.storage.local）
不发送网络请求（除更新检查）
符合浏览器插件隐私政策

9.4 可访问性（基于 shadcn/ui）

支持键盘完整导航
支持屏幕阅读器（ARIA 标签）
对比度符合 WCAG 2.1 AA 标准
支持高对比度模式
所有图标配有文字说明

9.5 用户体验

界面响应流畅（60fps）
操作可撤销
错误提示友好
支持深色模式
响应式设计（适配不同尺寸）


🔟 成功指标（KPI）
用户增长

安装量 > 1000（30 天）
留存率 > 40%（7 日）
日活用户 > 500（30 天后）

使用频率

人均日使用次数 > 5
功能使用率：
搜索功能 > 60%
重复检测 > 40%
休眠功能 > 30%



用户反馈

应用商店评分 > 4.0
有效反馈回复率 > 80%

性能提升

人均节省内存 > 500MB
人均减少页签数 > 15%


1️⃣1️⃣ 里程碑规划
Phase 1: MVP (4 周)
目标: 可用的 V1.0 版本
Week 1-2: 基础架构

搭建项目（React + Vite + TypeScript）
配置 shadcn/ui + Tailwind CSS
集成 lucide-react
实现基础页签数据获取
开发资源监控面板

Week 3: 核心功能

智能分组展示（Accordion + Tabs）
快速搜索（Command 组件）
页签列表渲染优化

Week 4: 清理功能

重复页签检测（AlertDialog）
批量操作（DropdownMenu）
Toast 通知集成
内测和 Bug 修复

Phase 2: 优化 (2 周)
目标: V1.1 版本
Week 5: 高级功能

页签休眠功能
智能提醒（Toast + Alert）
设置面板（Sheet）

Week 6: 数据管理

会话保存功能（Dialog + Table）
白名单管理
配置导入导出

Phase 3: 增强 (4 周)
目标: V2.0 版本
Week 7-8: 统计分析

使用统计面板（Card + Chart）
高级筛选功能（Select + Filter）
数据可视化

Week 9-10: 用户体验优化

自定义页签组
动画效果优化
性能调优
多语言支持（可选）


1️⃣2️⃣ 风险与依赖
技术风险



风险
影响
缓解措施



浏览器 API 限制
高
提前验证 API 可用性


内存数据获取不准确
中
使用预估算法


大量页签性能问题
高
虚拟滚动 + 懒加载


shadcn/ui 组件定制复杂
低
源码可控，灵活调整


依赖项
浏览器权限:

tabs - 访问页签信息
storage - 本地数据存储
notifications - 显示系统通知
alarms（可选）- 定时任务

技术依赖:

Node.js 18+
npm / pnpm / yarn
Chrome Extensions Manifest V3


1️⃣3️⃣ 未来规划（V3.0+）

🤖 AI 智能推荐（推荐关闭的页签）
☁️ 跨设备同步（云端保存会话）
📊 高级数据分析（浏览习惯报告）
🎨 自定义主题（更多配色方案）
🔗 浏览器书签集成
👥 团队协作（分享页签组）
📱 移动端支持
🌐 多语言支持


1️⃣4️⃣ 交付清单
开发交付物

 完整的浏览器插件代码
 shadcn/ui 组件已正确配置
 lucide-react 图标库已集成
 深色模式正常工作
 所有必需功能已实现
 性能测试通过
 兼容性测试通过

文档交付物

 用户使用手册
 开发者文档
 API 文档
 组件使用说明
 版本更新日志

设计交付物

 UI 设计规范文档
 图标使用指南
 颜色系统文档
 交互原型（可选）


附录
A. 竞品分析

OneTab: 简洁但功能单一，只能全部保存
The Great Suspender: 休眠功能强但已停更
Tab Wrangler: 自动关闭但不够智能
差异化: 整合监控+清理+管理全流程，UI 更现代化

B. 参考资源

shadcn/ui 官方文档: https://ui.shadcn.com
lucide 图标库: https://lucide.dev
Chrome Extensions 文档: https://developer.chrome.com/docs/extensions
Radix UI 可访问性指南: https://www.radix-ui.com

C. 用户反馈渠道

GitHub Issues
Chrome 应用商店评论
邮件反馈: feedback@tabmaster.com
用户调研问卷


PRD 版本历史

V1.0 - 2024.01.XX - 初始版本（纯功能需求）
V1.1 - 待定 - 根据用户反馈迭代

