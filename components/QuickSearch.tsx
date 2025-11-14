import { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search } from 'lucide-react';
import type { TabInfo } from '@/types';
import { getAllTabs, switchToTab } from '@/utils/tabs';

interface QuickSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickSearch({ open, onOpenChange }: QuickSearchProps) {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      getAllTabs().then(setTabs);
      setSearchQuery('');
    }
  }, [open]);

  const filteredTabs = tabs.filter((tab) => {
    const query = searchQuery.toLowerCase();
    return (
      tab.title.toLowerCase().includes(query) ||
      tab.url.toLowerCase().includes(query)
    );
  });

  const handleSelectTab = async (tabId: number) => {
    await switchToTab(tabId);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="搜索页签标题或 URL..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>未找到页签</CommandEmpty>
        <CommandGroup heading="页签">
          {filteredTabs.slice(0, 50).map((tab) => (
            <CommandItem
              key={tab.id}
              value={`${tab.title} ${tab.url}`}
              onSelect={() => handleSelectTab(tab.id)}
              className="flex items-center gap-2"
            >
              {tab.favIconUrl && (
                <img src={tab.favIconUrl} alt="" className="h-4 w-4" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{tab.title || '无标题'}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {tab.url}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
