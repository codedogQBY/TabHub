import { defineConfig } from 'wxt';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  alias: {
    '@': path.resolve(__dirname, './'),
  },
  manifest: {
    name: 'TabHub',
    description: '智能浏览器页签管理工具',
    version: '1.0.0',
    permissions: [
      'tabs',
      'storage',
      'notifications',
    ],
    host_permissions: [
      '<all_urls>',
    ],
    commands: {
      'open-search': {
        suggested_key: {
          default: 'Ctrl+Shift+K',
          mac: 'Command+Shift+K',
        },
        description: '打开快速搜索',
      },
    },
  },
});
