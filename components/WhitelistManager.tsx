import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Shield, Plus, Trash2, AlertCircle } from 'lucide-react';
import { getSettings, addToWhitelist, removeFromWhitelist } from '@/utils/settings';

export function WhitelistManager() {
  const [open, setOpen] = useState(false);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newPattern, setNewPattern] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadWhitelist();
    }
  }, [open]);

  const loadWhitelist = async () => {
    const settings = await getSettings();
    setWhitelist(settings.whitelist);
  };

  const handleAdd = async () => {
    if (!newPattern.trim()) {
      setError('请输入网址或模式');
      return;
    }

    try {
      await addToWhitelist(newPattern.trim());
      await loadWhitelist();
      setNewPattern('');
      setError('');
    } catch (err) {
      setError('添加失败');
    }
  };

  const handleRemove = async (pattern: string) => {
    await removeFromWhitelist(pattern);
    await loadWhitelist();
  };

  const handleAddCurrent = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.url) {
      try {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;
        await addToWhitelist(hostname);
        await loadWhitelist();
      } catch (err) {
        setError('无法获取当前页面网址');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Shield className="h-4 w-4 mr-2" />
          白名单管理
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>白名单管理</DialogTitle>
          <DialogDescription>
            白名单中的网站不会被批量关闭或自动休眠
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* 添加区域 */}
          <div className="space-y-2">
            <Label>添加网址或模式</Label>
            <div className="flex gap-2">
              <Input
                placeholder="例如: google.com 或 *.github.com"
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                添加
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddCurrent} className="w-full">
              添加当前页面
            </Button>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          {/* 说明 */}
          <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
            <div className="font-medium">支持的模式：</div>
            <div>• 完整域名：<code className="bg-background px-1 rounded">google.com</code></div>
            <div>• 通配符：<code className="bg-background px-1 rounded">*.google.com</code> 匹配所有子域名</div>
          </div>

          {/* 白名单列表 */}
          <div className="space-y-2 flex-1 flex flex-col min-h-0">
            <Label>已添加的网站（{whitelist.length}）</Label>
            <ScrollArea className="border rounded-lg flex-1">
              {whitelist.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  暂无白名单网站
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {whitelist.map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-md border p-2 hover:bg-accent"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <code className="text-sm truncate">{pattern}</code>
                        {pattern.includes('*') && (
                          <Badge variant="secondary" className="text-xs">
                            通配符
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(pattern)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
