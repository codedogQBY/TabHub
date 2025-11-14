import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import type { Settings } from '@/types/storage';
import { getSettings, saveSettings, resetSettings } from '@/utils/settings';

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    theme: 'auto',
    autoSuspendEnabled: false,
    autoSuspendTime: 30,
    tabCountThreshold: 20,
    memoryThreshold: 2000,
    notifications: true,
    whitelist: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      loadSettings();
      setSaved(false); // Reset saved state when opening
    }
  }, [open]);

  const loadSettings = async () => {
    const loaded = await getSettings();
    setSettings(loaded);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await saveSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const handleReset = async () => {
    await resetSettings();
    await loadSettings();
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="设置">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <DialogDescription>
            自定义 TabHub 的行为和外观
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[380px] pr-4">
          <div className="space-y-6">
          {/* 外观设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">外观</h3>

            <div className="space-y-2">
              <Label>主题</Label>
              <div className="flex gap-2">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                  <Button
                    key={theme}
                    variant={settings.theme === theme ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('theme', theme)}
                  >
                    {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '跟随系统'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* 休眠设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">页签休眠</h3>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label>启用自动休眠</Label>
                <p className="text-sm text-muted-foreground">
                  长时间未访问的页签将自动休眠以节省内存
                </p>
              </div>
              <Switch
                checked={settings.autoSuspendEnabled}
                onCheckedChange={(checked) => updateSetting('autoSuspendEnabled', checked)}
              />
            </div>

            {settings.autoSuspendEnabled && (
              <div className="space-y-2">
                <Label>自动休眠时间（分钟）</Label>
                <div className="flex gap-2">
                  {[5, 10, 30, 60].map((time) => (
                    <Button
                      key={time}
                      variant={settings.autoSuspendTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('autoSuspendTime', time)}
                    >
                      {time} 分钟
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 提醒设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">智能提醒</h3>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label>启用通知</Label>
                <p className="text-sm text-muted-foreground">
                  在页签数量或内存占用过高时提醒
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>

            {settings.notifications && (
              <>
                <div className="space-y-2">
                  <Label>页签数量阈值</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {[10, 20].map((count) => (
                        <Button
                          key={count}
                          variant={settings.tabCountThreshold === count ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('tabCountThreshold', count)}
                          className="flex-1"
                        >
                          {count} 个
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {[30, 50].map((count) => (
                        <Button
                          key={count}
                          variant={settings.tabCountThreshold === count ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('tabCountThreshold', count)}
                          className="flex-1"
                        >
                          {count} 个
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>内存阈值 (MB)</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {[1000, 2000].map((mem) => (
                        <Button
                          key={mem}
                          variant={settings.memoryThreshold === mem ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('memoryThreshold', mem)}
                          className="flex-1"
                        >
                          {mem} MB
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {[3000, 4000].map((mem) => (
                        <Button
                          key={mem}
                          variant={settings.memoryThreshold === mem ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('memoryThreshold', mem)}
                          className="flex-1"
                        >
                          {mem} MB
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        </ScrollArea>

        {/* 操作按钮 - 固定在底部 */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            恢复默认
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? '保存中...' : saved ? '已保存' : '保存设置'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
