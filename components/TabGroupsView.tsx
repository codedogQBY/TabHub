import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Layout, Layers, X, Volume2, Pin } from 'lucide-react';
import type { TabInfo, TabGroup, GroupDimension } from '@/types';
import { getAllTabs, getCurrentWindowTabs, groupTabsByDomain, groupTabsByWindow, switchToTab, closeTab } from '@/utils/tabs';

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

  const handleCloseTab = async (tabId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await closeTab(tabId);
    loadTabs();
  };

  const renderTab = (tab: TabInfo) => (
    <div
      key={tab.id}
      className="flex items-center gap-2 rounded-md border p-2 hover:bg-accent cursor-pointer transition-colors group"
      onClick={() => switchToTab(tab.id)}
    >
      {tab.favIconUrl && (
        <img src={tab.favIconUrl} alt="" className="h-4 w-4 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate font-medium">{tab.title || '无标题'}</div>
        <div className="text-xs text-muted-foreground truncate">{tab.url}</div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {tab.audible && (
          <Volume2 className="h-3 w-3 text-orange-500" />
        )}
        {tab.pinned && (
          <Pin className="h-3 w-3 text-purple-500" />
        )}
        {tab.active && (
          <Badge variant="outline" className="text-xs">活跃</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => handleCloseTab(tab.id, e)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs value={groupDimension} onValueChange={(value) => setGroupDimension(value as GroupDimension)}>
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

        <TabsContent value="domain" className="mt-4">
          <ScrollArea className="h-[400px]">
            <Accordion type="multiple" defaultValue={groups.slice(0, 3).map((_, i) => `item-${i}`)} className="w-full">
              {groups.map((group, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      {group.favicon && (
                        <img src={group.favicon} alt="" className="h-4 w-4" />
                      )}
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
          </ScrollArea>
        </TabsContent>

        <TabsContent value="window" className="mt-4">
          <ScrollArea className="h-[400px]">
            <Accordion type="multiple" defaultValue={groups.slice(0, 2).map((_, i) => `item-${i}`)} className="w-full">
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
          </ScrollArea>
        </TabsContent>

        <TabsContent value="none" className="mt-4">
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {allTabs.map(renderTab)}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
