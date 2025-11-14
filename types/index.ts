// 页签信息接口
export interface TabInfo {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active: boolean;
  pinned: boolean;
  audible: boolean;
  discarded: boolean;
  groupId: number;
  windowId: number;
  lastAccessed?: number;
}

// 页签分组接口
export interface TabGroup {
  domain: string;
  tabs: TabInfo[];
  favicon?: string;
}

// 资源统计接口
export interface ResourceStats {
  totalTabs: number;
  currentWindowTabs: number;
  estimatedMemory: number;
  topMemoryTabs: TabInfo[];
}

// 分组维度
export type GroupDimension = 'domain' | 'window' | 'none';

// 重复匹配模式
export type DuplicateMatchMode = 'exact' | 'ignoreParams' | 'ignoreHash';
