import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { TabGroupsView } from '@/components/TabGroupsView';
import { QuickSearch } from '@/components/QuickSearch';
import { DuplicateDetector } from '@/components/DuplicateDetector';
import { BatchOperations } from '@/components/BatchOperations';
import { SessionManager } from '@/components/SessionManager';
import { RecentlyClosedTabs } from '@/components/RecentlyClosedTabs';
import { SettingsPanel } from '@/components/SettingsPanel';
import { WhitelistManager } from '@/components/WhitelistManager';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOperationComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="w-[400px] h-[600px] bg-background text-foreground">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">TabHub</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            title="快速搜索 (Ctrl+Shift+K)"
          >
            <Search className="h-4 w-4" />
          </Button>
          <RecentlyClosedTabs />
          <BatchOperations onComplete={handleOperationComplete} />
          <SettingsPanel />
        </div>
      </div>

      {/* 主内容区 */}
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(600px-200px)]">
        {/* 页签分组展示 */}
        <TabGroupsView key={`tabs-${refreshKey}`} />
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 border-t space-y-2">
        <DuplicateDetector onComplete={handleOperationComplete} />
        <div className="grid grid-cols-2 gap-2">
          <SessionManager />
          <WhitelistManager />
        </div>
      </div>

      {/* 快速搜索对话框 */}
      <QuickSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

export default App;
