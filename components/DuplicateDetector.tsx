import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Copy, X } from 'lucide-react';
import type { TabInfo, DuplicateMatchMode } from '@/types';
import { getAllTabs, closeTabs } from '@/utils/tabs';
import { findDuplicateTabs, selectTabToKeep } from '@/utils/duplicates';

interface DuplicateDetectorProps {
  onComplete?: () => void;
}

export function DuplicateDetector({ onComplete }: DuplicateDetectorProps) {
  const [open, setOpen] = useState(false);
  const [duplicates, setDuplicates] = useState<Map<string, TabInfo[]>>(new Map());
  const [scanning, setScanning] = useState(false);

  const scanDuplicates = async () => {
    setScanning(true);
    const tabs = await getAllTabs();
    const duplicateGroups = findDuplicateTabs(tabs, 'ignoreParams');
    setDuplicates(duplicateGroups);
    setScanning(false);

    if (duplicateGroups.size > 0) {
      setOpen(true);
    }
  };

  const handleCloseDuplicates = async () => {
    const tabsToClose: number[] = [];

    duplicates.forEach((tabs) => {
      // 保留最早打开的，关闭其他
      const tabToKeep = selectTabToKeep(tabs, 'oldest');
      tabs.forEach((tab) => {
        if (tab.id !== tabToKeep.id) {
          tabsToClose.push(tab.id);
        }
      });
    });

    if (tabsToClose.length > 0) {
      await closeTabs(tabsToClose);
      setOpen(false);
      onComplete?.();
    }
  };

  const totalDuplicates = Array.from(duplicates.values()).reduce(
    (sum, tabs) => sum + tabs.length - 1,
    0
  );

  return (
    <>
      <Button
        variant="outline"
        onClick={scanDuplicates}
        disabled={scanning}
        className="w-full"
      >
        <Copy className="h-4 w-4 mr-2" />
        {scanning ? '扫描中...' : '扫描重复页签'}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>发现重复页签</AlertDialogTitle>
            <AlertDialogDescription>
              找到 {duplicates.size} 组重复页签，共 {totalDuplicates} 个重复项。
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="max-h-[300px] overflow-y-auto space-y-3">
            {Array.from(duplicates.entries()).map(([url, tabs], index) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">
                    {tabs[0].title || '无标题'}
                  </span>
                  <Badge variant="secondary">{tabs.length} 个</Badge>
                </div>
                <div className="text-xs text-muted-foreground truncate pl-6">
                  {url}
                </div>
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseDuplicates}>
              关闭重复项
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
