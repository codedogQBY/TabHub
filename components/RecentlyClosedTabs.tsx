import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { History, RotateCcw, Trash2 } from 'lucide-react';
import type { ClosedTab } from '@/types/storage';
import { getClosedTabs, restoreClosedTab, clearClosedTabs } from '@/utils/closedTabs';

export function RecentlyClosedTabs() {
  const [open, setOpen] = useState(false);
  const [closedTabs, setClosedTabs] = useState<ClosedTab[]>([]);

  const loadClosedTabs = async () => {
    const tabs = await getClosedTabs();
    setClosedTabs(tabs);
  };

  useEffect(() => {
    if (open) {
      loadClosedTabs();
    }
  }, [open]);

  const handleRestore = async (tabId: string) => {
    await restoreClosedTab(tabId);
    await loadClosedTabs();
  };

  const handleClearAll = async () => {
    await clearClosedTabs();
    setClosedTabs([]);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    return `${days} 天前`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          最近关闭
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>最近关闭的页签</DialogTitle>
          <DialogDescription>
            恢复最近关闭的页签
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {closedTabs.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                清空记录
              </Button>
            </div>
          )}

          <ScrollArea className="h-[350px]">
            {closedTabs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                暂无最近关闭的页签
              </div>
            ) : (
              <div className="space-y-2">
                {closedTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className="border rounded-lg p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {tab.favIconUrl && (
                        <img src={tab.favIconUrl} alt="" className="h-4 w-4 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium break-all">{tab.title || '无标题'}</div>
                        <div className="text-xs text-muted-foreground break-all">
                          {tab.url}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTime(tab.closedAt)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(tab.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        恢复
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
