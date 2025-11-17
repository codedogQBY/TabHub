import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Settings, FolderCog } from 'lucide-react';
import type { GroupingRule } from '@/types/storage';
import { getSettings, saveSettings } from '@/utils/settings';

export function RuleManager() {
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<GroupingRule[]>([]);

  useEffect(() => {
    if (open) {
      loadRules();
    }
  }, [open]);

  const loadRules = async () => {
    const settings = await getSettings();
    setRules(settings.groupingRules || []);
  };

  const handleSaveRules = async (newRules: GroupingRule[]) => {
    const settings = await getSettings();
    await saveSettings({ ...settings, groupingRules: newRules });
    setRules(newRules);
  };

  const handleAddRule = () => {
    const newRule: GroupingRule = {
      id: `rule_${Date.now()}`,
      name: '新规则',
      type: 'url',
      pattern: 'contains',
      value: '',
      groupName: '未命名分组',
      enabled: true,
    };
    handleSaveRules([...rules, newRule]);
  };

  const handleUpdateRule = (id: string, updatedRule: Partial<GroupingRule>) => {
    const newRules = rules.map((rule) =>
      rule.id === id ? { ...rule, ...updatedRule } : rule
    );
    handleSaveRules(newRules);
  };

  const handleDeleteRule = (id: string) => {
    const newRules = rules.filter((rule) => rule.id !== id);
    handleSaveRules(newRules);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderCog className="h-4 w-4 mr-2" />
          规则管理
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>自动分组规则管理</DialogTitle>
          <DialogDescription>
            创建和管理规则，以自动将标签页分组。
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={rule.name}
                    onChange={(e) => handleUpdateRule(rule.id, { name: e.target.value })}
                    className="text-lg font-semibold"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => handleUpdateRule(rule.id, { enabled: checked })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>匹配类型</Label>
                    <select
                      value={rule.type}
                      onChange={(e) => handleUpdateRule(rule.id, { type: e.target.value as any })}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      <option value="url">URL</option>
                      <option value="title">标题</option>
                    </select>
                  </div>
                  <div>
                    <Label>匹配模式</Label>
                    <select
                      value={rule.pattern}
                      onChange={(e) => handleUpdateRule(rule.id, { pattern: e.target.value as any })}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      <option value="contains">包含</option>
                      <option value="equals">等于</option>
                      <option value="startsWith">开头是</option>
                      <option value="endsWith">结尾是</option>
                      <option value="regex">正则匹配</option>
                    </select>
                  </div>
                  <div>
                    <Label>分组名称</Label>
                    <Input
                      value={rule.groupName}
                      onChange={(e) => handleUpdateRule(rule.id, { groupName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>匹配内容</Label>
                  <Input
                    value={rule.value}
                    onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                    placeholder="例如: github.com"
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={handleAddRule}>
            <Plus className="h-4 w-4 mr-2" />
            添加新规则
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}