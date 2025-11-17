import type { Settings } from '@/types/storage';

const SETTINGS_KEY = 'tabhub_settings';

const DEFAULT_SETTINGS: Settings = {
  theme: 'auto',
  autoSuspendEnabled: false,
  autoSuspendTime: 30, // 30分钟
  tabCountThreshold: 20,
  notifications: true,
  whitelist: [],
  groupingRules: [],
};

/**
 * 获取设置
 */
export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) };
}

/**
 * 保存设置
 */
export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
}

/**
 * 重置设置为默认值
 */
export async function resetSettings(): Promise<void> {
  await chrome.storage.local.set({ [SETTINGS_KEY]: DEFAULT_SETTINGS });
}

/**
 * 检查 URL 是否在白名单中
 */
export function isInWhitelist(url: string, whitelist: string[]): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    return whitelist.some(pattern => {
      // 支持通配符
      const regex = new RegExp(
        '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
      );
      return regex.test(hostname) || regex.test(url);
    });
  } catch {
    return false;
  }
}

/**
 * 添加到白名单
 */
export async function addToWhitelist(pattern: string): Promise<void> {
  const settings = await getSettings();
  if (!settings.whitelist.includes(pattern)) {
    settings.whitelist.push(pattern);
    await saveSettings({ whitelist: settings.whitelist });
  }
}

/**
 * 从白名单移除
 */
export async function removeFromWhitelist(pattern: string): Promise<void> {
  const settings = await getSettings();
  settings.whitelist = settings.whitelist.filter(p => p !== pattern);
  await saveSettings({ whitelist: settings.whitelist });
}
