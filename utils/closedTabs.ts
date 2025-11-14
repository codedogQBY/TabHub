import type { ClosedTab } from '@/types/storage';

const CLOSED_TABS_KEY = 'tabhub_closed_tabs';
const MAX_CLOSED_TABS = 50;

/**
 * 获取最近关闭的页签
 */
export async function getClosedTabs(): Promise<ClosedTab[]> {
  const result = await chrome.storage.local.get(CLOSED_TABS_KEY);
  return result[CLOSED_TABS_KEY] || [];
}

/**
 * 保存关闭的页签
 */
async function saveClosedTabs(tabs: ClosedTab[]): Promise<void> {
  await chrome.storage.local.set({ [CLOSED_TABS_KEY]: tabs });
}

/**
 * 记录关闭的页签
 */
export async function recordClosedTab(
  url: string,
  title: string,
  favIconUrl?: string,
  windowId?: number
): Promise<void> {
  // 忽略特殊页面
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    return;
  }

  const closedTabs = await getClosedTabs();

  const closedTab: ClosedTab = {
    id: `closed_${Date.now()}`,
    url,
    title,
    favIconUrl,
    closedAt: Date.now(),
    windowId: windowId || 0,
  };

  closedTabs.unshift(closedTab);

  // 只保留最近的记录
  if (closedTabs.length > MAX_CLOSED_TABS) {
    closedTabs.splice(MAX_CLOSED_TABS);
  }

  await saveClosedTabs(closedTabs);
}

/**
 * 恢复关闭的页签
 */
export async function restoreClosedTab(closedTabId: string): Promise<void> {
  const closedTabs = await getClosedTabs();
  const closedTab = closedTabs.find(t => t.id === closedTabId);

  if (!closedTab) {
    throw new Error('页签不存在');
  }

  // 在当前窗口打开
  await chrome.tabs.create({
    url: closedTab.url,
    active: true,
  });

  // 从列表中移除
  const filtered = closedTabs.filter(t => t.id !== closedTabId);
  await saveClosedTabs(filtered);
}

/**
 * 清空关闭记录
 */
export async function clearClosedTabs(): Promise<void> {
  await saveClosedTabs([]);
}
