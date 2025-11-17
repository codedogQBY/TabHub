// 会话接口
export interface Session {
  id: string;
  name: string;
  tabs: {
    url: string;
    title: string;
    favIconUrl?: string;
    pinned: boolean;
  }[];
  createdAt: number;
  tabCount: number;
}

// 设置接口
export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  autoSuspendEnabled: boolean;
  autoSuspendTime: number; // 分钟
  tabCountThreshold: number;
  notifications: boolean;
  whitelist: string[];
  groupingRules: GroupingRule[];
}

// 规则化分组
export type GroupingRuleType = 'url' | 'title';
export type GroupingRulePattern = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex';

export interface GroupingRule {
  id: string;
  name: string;
  type: GroupingRuleType;
  pattern: GroupingRulePattern;
  value: string;
  groupName: string;
  enabled: boolean;
}

// 最近关闭的页签
export interface ClosedTab {
  id: string;
  url: string;
  title: string;
  favIconUrl?: string;
  closedAt: number;
  windowId: number;
}
