export default defineBackground(() => {
  console.log('TabHub background service started', { id: browser.runtime.id });

  // 监听页签关闭事件，记录到最近关闭列表
  chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    try {
      // 在页签关闭前获取信息（无法在onRemoved中获取，所以使用storage临时存储）
      const result = await chrome.storage.session.get(`tab_${tabId}`);
      if (result[`tab_${tabId}`]) {
        const tabInfo = result[`tab_${tabId}`];

        // 只记录有效的页签
        if (tabInfo.url && !tabInfo.url.startsWith('chrome://') && !tabInfo.url.startsWith('chrome-extension://')) {
          // 获取当前记录
          const closedTabsResult = await chrome.storage.local.get('tabhub_closed_tabs');
          const closedTabs = closedTabsResult.tabhub_closed_tabs || [];

          // 添加新记录
          closedTabs.unshift({
            id: `closed_${Date.now()}`,
            url: tabInfo.url,
            title: tabInfo.title || '无标题',
            favIconUrl: tabInfo.favIconUrl,
            closedAt: Date.now(),
            windowId: removeInfo.windowId,
          });

          // 只保留最近50条
          if (closedTabs.length > 50) {
            closedTabs.splice(50);
          }

          await chrome.storage.local.set({ tabhub_closed_tabs: closedTabs });
        }

        // 清理临时存储
        await chrome.storage.session.remove(`tab_${tabId}`);
      }
    } catch (error) {
      console.error('Error recording closed tab:', error);
    }
  });

  // 监听页签更新，保存到临时存储
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      try {
        await chrome.storage.session.set({
          [`tab_${tabId}`]: {
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl,
          },
        });
      } catch (error) {
        console.error('Error storing tab info:', error);
      }
    }
  });

  // 监听页签创建，保存到临时存储
  chrome.tabs.onCreated.addListener(async (tab) => {
    if (tab.id && tab.url) {
      try {
        await chrome.storage.session.set({
          [`tab_${tab.id}`]: {
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl,
          },
        });
      } catch (error) {
        console.error('Error storing tab info:', error);
      }
    }
  });

  // 注册快捷键命令
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-search') {
      // 打开搜索功能（通过向popup发送消息）
      chrome.runtime.sendMessage({ action: 'open-search' });
    }
  });
});
