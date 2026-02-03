/**
 * Main Configuration Panel Component
 * Layout: Sidebar (left) + Content (right)
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ConfigSidebar } from './ConfigSidebar';
import { ConfigContent } from './ConfigContent';
import { useConfig } from '@/config-system/hooks/useConfig';

export interface ConfigTab {
  id: string;
  label: string;
  icon: string;
}

const defaultTabs: ConfigTab[] = [
  { id: 'basic', label: '基础设置', icon: 'Settings' },
  { id: 'interview', label: '访谈配置', icon: 'MessageSquare' },
  { id: 'scoring', label: '评分规则', icon: 'Sliders' },
  { id: 'audience', label: '人群筛选', icon: 'Users' },
  { id: 'report', label: '报告设置', icon: 'FileText' },
];

export interface ConfigPanelProps {
  tabs?: ConfigTab[];
  projectId?: string;
  industryId?: string;
}

export default function ConfigPanel({
  tabs = defaultTabs,
  projectId = 'default',
  industryId = 'pet-food',
}: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const { configs, loading, error } = useConfig();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-72 border-r p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            加载配置失败: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <ConfigSidebar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <ConfigContent activeTab={activeTab} configs={configs} />
      </div>
    </div>
  );
}
