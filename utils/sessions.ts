import type { Session } from '@/types/storage';
import type { TabInfo } from '@/types';

const SESSIONS_KEY = 'tabhub_sessions';
const MAX_SESSIONS = 20;

/**
 * 保存会话到存储
 */
async function saveSessions(sessions: Session[]): Promise<void> {
  await chrome.storage.local.set({ [SESSIONS_KEY]: sessions });
}

/**
 * 获取所有会话
 */
export async function getAllSessions(): Promise<Session[]> {
  const result = await chrome.storage.local.get(SESSIONS_KEY);
  return result[SESSIONS_KEY] || [];
}

/**
 * 创建新会话
 */
export async function createSession(tabs: TabInfo[], name?: string): Promise<Session> {
  const sessions = await getAllSessions();

  const session: Session = {
    id: `session_${Date.now()}`,
    name: name || `会话 ${new Date().toLocaleString('zh-CN')}`,
    tabs: tabs.map(tab => ({
      url: tab.url,
      title: tab.title,
      favIconUrl: tab.favIconUrl,
      pinned: tab.pinned,
    })),
    createdAt: Date.now(),
    tabCount: tabs.length,
  };

  // 添加到列表开头
  sessions.unshift(session);

  // 只保留最近的会话
  if (sessions.length > MAX_SESSIONS) {
    sessions.splice(MAX_SESSIONS);
  }

  await saveSessions(sessions);
  return session;
}

/**
 * 删除会话
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getAllSessions();
  const filtered = sessions.filter(s => s.id !== sessionId);
  await saveSessions(filtered);
}

/**
 * 恢复会话（在新窗口中打开所有页签）
 */
export async function restoreSession(sessionId: string): Promise<void> {
  const sessions = await getAllSessions();
  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    throw new Error('会话不存在');
  }

  // 创建新窗口
  const window = await chrome.windows.create({
    focused: true,
  });

  // 打开所有页签
  for (let i = 0; i < session.tabs.length; i++) {
    const tab = session.tabs[i];

    if (i === 0 && window.tabs && window.tabs[0]) {
      // 更新第一个默认页签
      await chrome.tabs.update(window.tabs[0].id!, {
        url: tab.url,
        pinned: tab.pinned,
      });
    } else {
      // 创建新页签
      await chrome.tabs.create({
        windowId: window.id,
        url: tab.url,
        pinned: tab.pinned,
        active: false,
      });
    }
  }
}

/**
 * 重命名会话
 */
export async function renameSession(sessionId: string, newName: string): Promise<void> {
  const sessions = await getAllSessions();
  const session = sessions.find(s => s.id === sessionId);

  if (session) {
    session.name = newName;
    await saveSessions(sessions);
  }
}

/**
 * 导出会话为 JSON
 */
export function exportSessionAsJSON(session: Session): string {
  return JSON.stringify(session, null, 2);
}

/**
 * 从 JSON 导入会话
 */
export async function importSessionFromJSON(json: string): Promise<Session> {
  const session = JSON.parse(json) as Session;

  // 生成新 ID 和时间
  session.id = `session_${Date.now()}`;
  session.createdAt = Date.now();

  const sessions = await getAllSessions();
  sessions.unshift(session);

  if (sessions.length > MAX_SESSIONS) {
    sessions.splice(MAX_SESSIONS);
  }

  await saveSessions(sessions);
  return session;
}
