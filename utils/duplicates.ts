import type { TabInfo, DuplicateMatchMode } from '@/types';

/**
 * 标准化 URL（用于比较）
 */
export function normalizeUrl(url: string, mode: DuplicateMatchMode): string {
  try {
    const urlObj = new URL(url);

    if (mode === 'exact') {
      return url;
    } else if (mode === 'ignoreParams') {
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } else if (mode === 'ignoreHash') {
      return url.split('#')[0];
    }

    return url;
  } catch {
    return url;
  }
}

/**
 * 查找重复的页签
 */
export function findDuplicateTabs(
  tabs: TabInfo[],
  mode: DuplicateMatchMode = 'ignoreParams'
): Map<string, TabInfo[]> {
  const groups = new Map<string, TabInfo[]>();

  tabs.forEach((tab) => {
    const normalizedUrl = normalizeUrl(tab.url, mode);
    if (!groups.has(normalizedUrl)) {
      groups.set(normalizedUrl, []);
    }
    groups.get(normalizedUrl)!.push(tab);
  });

  // 只保留有重复的组
  const duplicates = new Map<string, TabInfo[]>();
  groups.forEach((tabs, url) => {
    if (tabs.length > 1) {
      duplicates.set(url, tabs);
    }
  });

  return duplicates;
}

/**
 * 根据策略选择要保留的页签
 */
export function selectTabToKeep(
  tabs: TabInfo[],
  strategy: 'oldest' | 'newest' | 'active' | 'pinned' | 'audible'
): TabInfo {
  if (strategy === 'oldest') {
    return tabs.reduce((oldest, tab) =>
      (tab.lastAccessed || 0) < (oldest.lastAccessed || 0) ? tab : oldest
    );
  } else if (strategy === 'newest') {
    return tabs.reduce((newest, tab) =>
      (tab.lastAccessed || 0) > (newest.lastAccessed || 0) ? tab : newest
    );
  } else if (strategy === 'active') {
    const activeTab = tabs.find((tab) => tab.active);
    return activeTab || tabs[0];
  } else if (strategy === 'pinned') {
    const pinnedTab = tabs.find((tab) => tab.pinned);
    return pinnedTab || tabs[0];
  } else if (strategy === 'audible') {
    const audibleTab = tabs.find((tab) => tab.audible);
    return audibleTab || tabs[0];
  }

  return tabs[0];
}
