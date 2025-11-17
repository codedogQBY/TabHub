# TabHub - 一种更智能的浏览器标签页管理方式

<p align="center">
  <img src="public/icon/128.png" alt="TabHub Logo" width="128">
</p>

TabHub 是一款浏览器扩展，旨在帮助您掌控浏览器标签页。它提供了一系列工具来监控、组织和清理您的标签页，从而减少内存占用，提高您的浏览效率。

## ✨ 功能特性

- **标签页分组:** 按域名、窗口自动分组标签页，或在平铺列表中查看所有标签页。
- **快速搜索:** 通过标题或 URL 即时查找任何标签页。
- **主题支持:** 在浅色和深色模式之间切换。
- **简洁的用户界面:** 使用 shadcn/ui 和 Tailwind CSS 构建的现代化、直观的界面。
- **快捷操作按钮:** 直接从扩展弹出窗口中快速关闭标签页。

## 🛠️ 技术栈

- **前端:** [React](https://react.dev/) 18+ & [TypeScript](https://www.typescriptlang.org/)
- **构建工具:** [Vite](https://vitejs.dev/)
- **UI 库:** [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **样式:** [Tailwind CSS](https://tailwindcss.com/)
- **图标:** [Lucide React](https://lucide.dev/)

## 🚀 开始使用

请按照以下说明在本地设置和运行项目，以进行开发和测试。

### 环境要求

- [Node.js](https://nodejs.org/) (v18 或更高版本)
- [pnpm](https://pnpm.io/) (或 npm/yarn)

### 安装步骤

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/your-username/TabHub.git
    cd TabHub
    ```

2.  **安装依赖:**
    ```bash
    pnpm install
    ```

3.  **构建扩展:**
    ```bash
    pnpm build
    ```
    这将在项目根目录下创建一个 `.output` 文件夹，其中包含打包后的扩展文件。

### 在浏览器中加载扩展

**Chrome/Edge 浏览器:**

1.  打开浏览器并访问 `chrome://extensions`。
2.  启用“开发者模式”（通常在右上角有一个开关）。
3.  点击“加载已解压的扩展程序”。
4.  选择项目中的 `.output/chrome-mv3` 文件夹。
5.  也可以直接选择 `output/chrome-mv3` 文件夹，这是我打包好的版本。

**Firefox 浏览器:**

1.  打开 Firefox 并访问 `about:debugging`。
2.  点击“此 Firefox”。
3.  点击“加载临时附加组件...”。
4.  选择 `.output` 文件夹内的任何一个文件。

## 🤝 如何贡献

我们欢迎各种形式的贡献！如果您对新功能、改进有任何想法，或者发现了错误，请先创建一个 issue 进行讨论。

1.  Fork 本项目
2.  创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m '''Add some AmazingFeature'''`)
4.  将分支推送到远程仓库 (`git push origin feature/AmazingFeature`)
5.  创建一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证授权。

