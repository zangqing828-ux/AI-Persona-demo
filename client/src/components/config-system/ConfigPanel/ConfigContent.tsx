/**
 * Config Content Component
 * Main content area that displays config sections
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';
import { InterviewConfig } from '../InterviewConfig';
import { ScoringRules } from '../ScoringRules';
import { AudienceConfig } from '../AudienceConfig';
import { useIndustryConfig } from '@/hooks/useIndustryConfig';

export interface ConfigContentProps {
  activeTab: string;
  configs: Record<string, unknown>;
}

export function ConfigContent({ activeTab }: ConfigContentProps) {
  const { industryId } = useIndustryConfig();

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基础设置</CardTitle>
                <CardDescription>
                  配置项目的基本信息和测试参数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">项目名称</h3>
                      <p className="text-sm text-muted-foreground">AI 消费者模拟测试</p>
                    </div>
                    <Badge variant="secondary">已配置</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">测试参数</h3>
                      <p className="text-sm text-muted-foreground">样本量: 10,000 | 置信度: 95%</p>
                    </div>
                    <Button variant="outline" size="sm">
                      编辑
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">A/B 测试</h3>
                      <p className="text-sm text-muted-foreground">未启用</p>
                    </div>
                    <Button variant="outline" size="sm">
                      配置
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                重置为默认值
              </Button>
            </div>
          </div>
        );

      case 'interview':
        return <InterviewConfig industryId={industryId} />;

      case 'scoring':
        return <ScoringRules industryId={industryId} />;

      case 'audience':
        return <AudienceConfig industryId={industryId} />;

      case 'report':
        return (
          <Card>
            <CardHeader>
              <CardTitle>报告设置</CardTitle>
              <CardDescription>
                配置报告指标、数据屏蔽和导出格式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>报告设置模块正在开发中...</p>
                <p className="text-sm mt-2">将支持指标选择、品牌定制、导出配置等功能</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
}
