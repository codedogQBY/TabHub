import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Layout, Layers, X, Volume2, Pin, Copy, XCircle, RefreshCw, VolumeX } from 'lucide-react';
import type { TabInfo, TabGroup, GroupDimension } from '@/types';
import {
  getAllTabs,
  getCurrentWindowTabs,
  groupTabsByDomain,
  groupTabsByWindow,
  switchToTab,
  closeTab,
  closeTabs,
  pinTab,
  muteTab,
  reloadTab,
} from '@/utils/tabs';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function TabGroupsView() {
  const [allTabs, setAllTabs] = useState<TabInfo[]>([]);
  const [currentWindowTabsList, setCurrentWindowTabsList] = useState<TabInfo[]>([]);
  const [groupDimension, setGroupDimension] = useState<GroupDimension>('domain');
  const [groups, setGroups] = useState<TabGroup[]>([]);

  const loadTabs = async () => {
    const all = await getAllTabs();
    const current = await getCurrentWindowTabs();
    setAllTabs(all);
    setCurrentWindowTabsList(current);
  };

  useEffect(() => {
    loadTabs();

    // 监听页签变化
    const handleTabChange = () => {
      loadTabs();
    };

    chrome.tabs.onCreated.addListener(handleTabChange);
    chrome.tabs.onRemoved.addListener(handleTabChange);
    chrome.tabs.onUpdated.addListener(handleTabChange);

    return () => {
      chrome.tabs.onCreated.removeListener(handleTabChange);
      chrome.tabs.onRemoved.removeListener(handleTabChange);
      chrome.tabs.onUpdated.removeListener(handleTabChange);
    };
  }, []);

  useEffect(() => {
    if (groupDimension === 'domain') {
      setGroups(groupTabsByDomain(allTabs));
    } else if (groupDimension === 'window') {
      setGroups(groupTabsByWindow(allTabs));
    }
  }, [allTabs, groupDimension]);

  const handleCloseTab = async (tabId: number) => {
    await closeTab(tabId);
    loadTabs();
  };

  const handleCloseGroup = async (group: TabGroup) => {
    const tabIds = group.tabs.map((t) => t.id);
    await closeTabs(tabIds);
    loadTabs();
  };

  const handlePinTab = async (tabId: number, pinned: boolean) => {
    await pinTab(tabId, pinned);
    loadTabs();
  };

  const handleMuteTab = async (tabId: number, muted: boolean) => {
    await muteTab(tabId, muted);
    loadTabs();
  };

  const handleReloadTab = async (tabId: number) => {
    await reloadTab(tabId);
  };

  const renderTab = (tab: TabInfo) => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          key={tab.id}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border p-2 hover:bg-accent cursor-pointer transition-colors group mb-2 w-full"
          onClick={() => switchToTab(tab.id)}
        >
          {tab.favIconUrl ? (
            <img src={tab.favIconUrl} alt="" className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4" />
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {tab.title || '无标题'}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {tab.url}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {tab.audible && <Volume2 className="h-3 w-3 text-orange-500" />}
            {tab.pinned && <Pin className="h-3 w-3 text-purple-500" />}
            {tab.active && (
              <Badge variant="outline" className="text-xs">
                活跃
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={e => {
                e.stopPropagation();
                handleCloseTab(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => handleCloseTab(tab.id)}>
          <XCircle className="mr-2 h-4 w-4" />
          关闭标签页
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => navigator.clipboard.writeText(tab.url || '')}>
          <Copy className="mr-2 h-4 w-4" />
          复制链接
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => handlePinTab(tab.id, !tab.pinned)}>
          <Pin className="mr-2 h-4 w-4" />
          {tab.pinned ? '取消固定' : '固定标签页'}
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => handleMuteTab(tab.id, !tab.audible)}>
          {tab.audible ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
          {tab.audible ? '静音标签页' : '取消静音'}
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => handleReloadTab(tab.id)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          重新加载
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );

  return (
    <div className="flex flex-col h-full">
      <Tabs value={groupDimension} onValueChange={(value) => setGroupDimension(value as GroupDimension)} className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="domain" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            域名
          </TabsTrigger>
          <TabsTrigger value="window" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            窗口
          </TabsTrigger>
          <TabsTrigger value="none" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            全部
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto mt-4">
          <TabsContent value="domain">
            <Accordion type="multiple" defaultValue={groups.slice(0, 3).map((_, i) => `item-${i}`)} className="w-full pr-4">
              {groups.map((group, index) => (
                <ContextMenu key={index}>
                  <ContextMenuTrigger>
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2 w-full overflow-hidden">
                          {group.favicon && (
                            <img src={group.favicon} alt="" className="h-4 w-4" />
                          )}
                          <span className="font-medium truncate">{group.domain}</span>
                          <Badge variant="secondary">{group.tabs.length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2">
                          {group.tabs.map(renderTab)}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onSelect={() => handleCloseGroup(group)}>
                      <XCircle className="mr-2 h-4 w-4" />
                      关闭全部分组
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="window">
            <Accordion type="multiple" defaultValue={groups.slice(0, 2).map((_, i) => `item-${i}`)} className="w-full pr-4">
              {groups.map((group, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      <span className="font-medium">{group.domain}</span>
                      <Badge variant="secondary">{group.tabs.length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {group.tabs.map(renderTab)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="none">
            <div className="space-y-2 pr-4">
              {allTabs.map(renderTab)}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
