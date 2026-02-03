/**
 * Config Sidebar Component
 * Left navigation sidebar for config panel
 */

import { cn } from '@/lib/utils';
import type { ConfigTab } from './index';

export interface ConfigSidebarProps {
  tabs: ConfigTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ConfigSidebar({ tabs, activeTab, onTabChange }: ConfigSidebarProps) {
  return (
    <div className="w-72 border-r bg-card p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-sm font-medium text-foreground mb-1">
          配置管理
        </h2>
        <p className="text-xs text-muted-foreground">
          管理项目的各项配置
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span className="text-lg">{getTabIcon(tab.icon)}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t mt-4">
        <p className="text-xs text-muted-foreground">
          版本: v1.0.0
        </p>
      </div>
    </div>
  );
}

function getTabIcon(iconName: string): string {
  const iconMap: Record<string, string> = {
    Settings: '⚙️',
    MessageSquare: '💬',
    Sliders: '🎚️',
    Users: '👥',
    FileText: '📄',
  };

  return iconMap[iconName] || '📋';
}
