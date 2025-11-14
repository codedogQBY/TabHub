import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Save, FolderOpen, Trash2, Download, Upload } from 'lucide-react';
import type { Session } from '@/types/storage';
import { getAllTabs } from '@/utils/tabs';
import {
  createSession,
  getAllSessions,
  deleteSession,
  restoreSession,
  exportSessionAsJSON,
  importSessionFromJSON,
} from '@/utils/sessions';

export function SessionManager() {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadSessions = async () => {
    const allSessions = await getAllSessions();
    setSessions(allSessions);
  };

  useEffect(() => {
    if (open) {
      loadSessions();
    }
  }, [open]);

  const handleSaveSession = async () => {
    setSaving(true);
    const tabs = await getAllTabs();
    await createSession(tabs);
    await loadSessions();
    setSaving(false);
  };

  const handleRestoreSession = async (sessionId: string) => {
    await restoreSession(sessionId);
    setOpen(false);
  };

  const handleDeleteSession = async () => {
    if (deleteId) {
      await deleteSession(deleteId);
      await loadSessions();
      setDeleteId(null);
    }
  };

  const handleExportSession = (session: Session) => {
    const json = exportSessionAsJSON(session);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSession = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        await importSessionFromJSON(text);
        await loadSessions();
      }
    };
    input.click();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <FolderOpen className="h-4 w-4 mr-2" />
            会话管理
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>会话管理</DialogTitle>
            <DialogDescription>
              保存和恢复浏览器页签会话
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button onClick={handleSaveSession} disabled={saving} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存当前会话'}
              </Button>
              <Button variant="outline" onClick={handleImportSession}>
                <Upload className="h-4 w-4 mr-2" />
                导入
              </Button>
            </div>

            {/* 会话列表 */}
            <ScrollArea className="h-[350px]">
              {sessions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  暂无保存的会话
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="border rounded-lg p-4 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-1 min-w-0">
                            <h3 className="font-medium">{session.name}</h3>
                            <Badge variant="secondary">{session.tabCount} 个页签</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(session.createdAt).toLocaleString('zh-CN')}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreSession(session.id)}
                          >
                            恢复
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportSession(session)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 页签预览 */}
                      <div className="mt-3 space-y-1">
                        {session.tabs.slice(0, 3).map((tab, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            {tab.favIconUrl && (
                              <img src={tab.favIconUrl} alt="" className="h-3 w-3" />
                            )}
                            <span className="truncate">{tab.title}</span>
                          </div>
                        ))}
                        {session.tabs.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            还有 {session.tabs.length - 3} 个页签...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个会话吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
