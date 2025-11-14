import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { MoreVertical, Trash2, Clock, AlertTriangle } from 'lucide-react';
import type { TabInfo } from '@/types';
import { getAllTabs, getCurrentWindowTabs, closeTabs } from '@/utils/tabs';

interface BatchOperationsProps {
  onComplete?: () => void;
}

export function BatchOperations({ onComplete }: BatchOperationsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [operationType, setOperationType] = useState<string>('');
  const [tabsToClose, setTabsToClose] = useState<number[]>([]);

  const confirmOperation = async (type: string) => {
    let tabs: TabInfo[] = [];
    let toClose: number[] = [];

    switch (type) {
      case 'close-all-unpinned':
        tabs = await getAllTabs();
        toClose = tabs.filter((tab) => !tab.pinned).map((tab) => tab.id);
        break;

      case 'close-inactive':
        tabs = await getAllTabs();
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        toClose = tabs
          .filter((tab) => !tab.pinned && (tab.lastAccessed || 0) < fiveMinutesAgo)
          .map((tab) => tab.id);
        break;

      case 'close-current-window':
        tabs = await getCurrentWindowTabs();
        toClose = tabs.filter((tab) => !tab.active && !tab.pinned).map((tab) => tab.id);
        break;

      default:
        return;
    }

    if (toClose.length > 0) {
      setTabsToClose(toClose);
      setOperationType(type);
      setConfirmOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (tabsToClose.length > 0) {
      await closeTabs(tabsToClose);
      setConfirmOpen(false);
      setTabsToClose([]);
      setOperationType('');
      onComplete?.();
    }
  };

  const getOperationTitle = () => {
    switch (operationType) {
      case 'close-all-unpinned':
        return '关闭所有未固定页签';
      case 'close-inactive':
        return '关闭未访问页签';
      case 'close-current-window':
        return '关闭当前窗口其他页签';
      default:
        return '确认操作';
    }
  };

  const getOperationDescription = () => {
    return `即将关闭 ${tabsToClose.length} 个页签，此操作无法撤销。`;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => confirmOperation('close-current-window')}>
            <Trash2 className="mr-2 h-4 w-4" />
            关闭当前窗口其他页签
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => confirmOperation('close-all-unpinned')}>
            <Trash2 className="mr-2 h-4 w-4" />
            关闭所有未固定页签
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => confirmOperation('close-inactive')}>
            <Clock className="mr-2 h-4 w-4" />
            关闭 5 分钟未访问的页签
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              {getOperationTitle()}
            </AlertDialogTitle>
            <AlertDialogDescription>{getOperationDescription()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>确认关闭</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
