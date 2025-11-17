import type { TabInfo, TabGroup, ResourceStats, GroupDimension } from '@/types';

/**
 * 获取所有页签信息
 */
export async function getAllTabs(): Promise<TabInfo[]> {
  try {
    const tabs = await chrome.tabs.query({});
    return tabs.map(tab => ({
      id: tab.id!,
      title: tab.title || '',
      url: tab.url || '',
      favIconUrl: tab.favIconUrl,
      active: tab.active,
      pinned: tab.pinned,
      audible: tab.audible || false,
      discarded: tab.discarded || false,
      groupId: tab.groupId || -1,
      windowId: tab.windowId,
      lastAccessed: tab.lastAccessed,
    }));
  } catch (error) {
    console.error('Failed to get tabs:', error);
    return [];
  }
}

/**
 * 获取当前窗口的页签
 */
export async function getCurrentWindowTabs(): Promise<TabInfo[]> {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    return tabs.map(tab => ({
      id: tab.id!,
      title: tab.title || '',
      url: tab.url || '',
      favIconUrl: tab.favIconUrl,
      active: tab.active,
      pinned: tab.pinned,
      audible: tab.audible || false,
      discarded: tab.discarded || false,
      groupId: tab.groupId || -1,
      windowId: tab.windowId,
      lastAccessed: tab.lastAccessed,
    }));
  } catch (error) {
    console.error('Failed to get current window tabs:', error);
    return [];
  }
}

/**
 * 从 URL 提取域名
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'unknown';
  }
}



/**
 * 按域名分组页签
 */
export function groupTabsByDomain(tabs: TabInfo[]): TabGroup[] {
  const groups = new Map<string, TabInfo[]>();

  tabs.forEach(tab => {
    const domain = extractDomain(tab.url);
    if (!groups.has(domain)) {
      groups.set(domain, []);
    }
    groups.get(domain)!.push(tab);
  });

  return Array.from(groups.entries())
    .map(([domain, tabs]) => ({
      domain,
      tabs,
      favicon: tabs[0].favIconUrl,
    }))
    .sort((a, b) => b.tabs.length - a.tabs.length);
}

/**
 * 按窗口分组页签
 */
export function groupTabsByWindow(tabs: TabInfo[]): TabGroup[] {
  const groups = new Map<number, TabInfo[]>();

  tabs.forEach(tab => {
    if (!groups.has(tab.windowId)) {
      groups.set(tab.windowId, []);
    }
    groups.get(tab.windowId)!.push(tab);
  });

  return Array.from(groups.entries())
    .map(([windowId, tabs]) => ({
      domain: `窗口 ${windowId}`,
      tabs,
      favicon: tabs[0].favIconUrl,
    }))
    .sort((a, b) => b.tabs.length - a.tabs.length);
}

/**
 * 跳转到指定页签
 */
export async function switchToTab(tabId: number): Promise<void> {
  try {
    await chrome.tabs.update(tabId, { active: true });
    const tab = await chrome.tabs.get(tabId);
    if (tab.windowId) {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
  } catch (error) {
    console.error('Failed to switch to tab:', error);
  }
}

/**
 * 关闭指定页签
 */
export async function closeTab(tabId: number): Promise<void> {
  try {
    await chrome.tabs.remove(tabId);
  } catch (error) {
    console.error('Failed to close tab:', error);
  }
}

/**
 * 关闭多个页签
 */
export async function closeTabs(tabIds: number[]): Promise<void> {
  try {
    await chrome.tabs.remove(tabIds);
  } catch (error) {
    console.error('Failed to close tabs:', error);
  }
}

/**
 * 固定或取消固定页签
 */
export async function pinTab(tabId: number, pinned: boolean): Promise<void> {
  try {
    await chrome.tabs.update(tabId, { pinned });
  } catch (error) {
    console.error('Failed to pin tab:', error);
  }
}

/**
 * 静音或取消静音页签
 */
export async function muteTab(tabId: number, muted: boolean): Promise<void> {
  try {
    await chrome.tabs.update(tabId, { muted });
  } catch (error) {
    console.error('Failed to mute tab:', error);
  }
}

/**
 * 重新加载页签
 */
export async function reloadTab(tabId: number): Promise<void> {
  try {
    await chrome.tabs.reload(tabId);
  } catch (error) {
    console.error('Failed to reload tab:', error);
  }
}
