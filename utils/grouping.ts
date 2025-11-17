import type { TabInfo } from '@/types';
import type { GroupingRule, GroupingRulePattern, GroupingRuleType } from '@/types/storage';
import type { TabGroup } from '@/types';

/**
 * 检查单个规则是否匹配
 */
function checkRuleMatch(tab: TabInfo, rule: GroupingRule): boolean {
  if (!rule.enabled) {
    return false;
  }

  const target = rule.type === 'url' ? tab.url : tab.title;
  if (!target) {
    return false;
  }

  const value = rule.value.toLowerCase();
  const lowerTarget = target.toLowerCase();

  switch (rule.pattern) {
    case 'contains':
      return lowerTarget.includes(value);
    case 'equals':
      return lowerTarget === value;
    case 'startsWith':
      return lowerTarget.startsWith(value);
    case 'endsWith':
      return lowerTarget.endsWith(value);
    case 'regex':
      try {
        return new RegExp(rule.value, 'i').test(target);
      } catch (e) {
        console.error('Invalid regex in rule:', rule.name, e);
        return false;
      }
    default:
      return false;
  }
}

/**
 * 将规则应用于所有标签页，返回分组结果
 */
export function applyGroupingRules(
  tabs: TabInfo[],
  rules: GroupingRule[]
): TabGroup[] {
  const groups = new Map<string, TabInfo[]>();
  const ungrouped: TabInfo[] = [];

  tabs.forEach((tab) => {
    let matched = false;
    for (const rule of rules) {
      if (checkRuleMatch(tab, rule)) {
        if (!groups.has(rule.groupName)) {
          groups.set(rule.groupName, []);
        }
        groups.get(rule.groupName)!.push(tab);
        matched = true;
        break; // 每个标签页只匹配第一个符合的规则
      }
    }

    if (!matched) {
      ungrouped.push(tab);
    }
  });

  if (ungrouped.length > 0) {
    groups.set('未分组', ungrouped);
  }

  return Array.from(groups.entries()).map(([domain, tabs]) => ({
    domain,
    tabs,
    favicon: tabs[0]?.favIconUrl,
  }));
}