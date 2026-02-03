/**
 * Deep Analysis Module
 * Displays hierarchical metrics with argumentation strength
 */

import { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreePine, Users, Sparkles } from 'lucide-react';
import { MetricHierarchy, MetricHierarchyProps } from './MetricHierarchy';
import { SegmentComparison, SegmentComparisonProps } from './SegmentComparison';
import { KeyInsightsGenerator } from './KeyInsightsGenerator';

export interface DeepAnalysisProps {
  onConclusionSelect?: (conclusionId: string) => void;
  selectedConclusion?: string | null;
  metrics?: MetricHierarchyProps['metrics'];
  segmentMetrics?: SegmentComparisonProps['metrics'];
  segmentInsights?: SegmentComparisonProps['insights'];
  segments?: SegmentComparisonProps['segments'];
}

export function DeepAnalysis({
  metrics = [],
  segmentMetrics = [],
  segmentInsights = [],
  segments = [],
}: DeepAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'segments' | 'insights'>('hierarchy');

  // Mock data for demo (remove in production)
  const mockMetrics: MetricHierarchyProps['metrics'] = metrics.length > 0 ? metrics : [
    {
      id: 'm1',
      level: 1,
      name: '购买意向',
      value: 78,
      unit: '%',
      trend: 'up',
      dataPoints: [
        { id: 'dp1', value: 78, timestamp: new Date('2025-01-15') },
        { id: 'dp2', value: 75, timestamp: new Date('2025-01-10') },
      ],
      argumentation: {
        strength: 'strong',
        evidence: [
          {
            id: 'e1',
            type: 'survey',
            description: '基于1,000份问卷调查数据',
            sampleSize: 1000,
            timestamp: new Date('2025-01-15'),
          },
          {
            id: 'e2',
            type: 'interview',
            description: '深度访谈50位用户，证实高购买意向',
            sampleSize: 50,
            timestamp: new Date('2025-01-14'),
          },
        ],
        logic: {
          premise: ['用户对产品表现出浓厚兴趣', '价格在可接受范围内'],
          reasoning: '综合问卷调查和深度访谈结果，大部分用户表示愿意购买该产品',
          conclusion: '78%的用户表现出明确的购买意向',
        },
        confidence: 85,
        sources: [
          { id: 's1', type: 'questionnaire', description: '用户满意度调查', timestamp: new Date('2025-01-15') },
        ],
      },
      insight: '购买意向处于高位，表明产品市场潜力巨大',
      children: [
        {
          id: 'm1-1',
          level: 2,
          name: '品牌信任度',
          value: 82,
          unit: '%',
          trend: 'up',
          dataPoints: [{ id: 'dp3', value: 82, timestamp: new Date('2025-01-15') }],
          argumentation: {
            strength: 'strong',
            evidence: [],
            logic: { premise: [], reasoning: '', conclusion: '' },
            confidence: 90,
            sources: [],
          },
          insight: '品牌信任度持续提升，是购买意向的主要驱动力',
        },
        {
          id: 'm1-2',
          level: 2,
          name: '价格接受度',
          value: 70,
          unit: '%',
          trend: 'stable',
          dataPoints: [{ id: 'dp4', value: 70, timestamp: new Date('2025-01-15') }],
          argumentation: {
            strength: 'moderate',
            evidence: [],
            logic: { premise: [], reasoning: '', conclusion: '' },
            confidence: 70,
            sources: [],
          },
          insight: '价格接受度稳定，但仍有提升空间',
        },
      ],
    },
  ];

  const mockSegmentMetrics: SegmentComparisonProps['metrics'] = segmentMetrics.length > 0 ? segmentMetrics : [
    {
      segmentId: 's1',
      segmentName: '高价值客户',
      metricName: '购买意向',
      value: 85,
      change: 5,
      sampleSize: 50,
      benchmark: 80,
    },
    {
      segmentId: 's2',
      segmentName: '价格敏感型',
      metricName: '购买意向',
      value: 65,
      change: -3,
      sampleSize: 45,
      benchmark: 70,
    },
    {
      segmentId: 's3',
      segmentName: '品质追求者',
      metricName: '购买意向',
      value: 78,
      change: 2,
      sampleSize: 55,
      benchmark: 75,
    },
  ];

  const mockSegmentInsights: SegmentComparisonProps['insights'] = segmentInsights.length > 0 ? segmentInsights : [
    {
      segmentId: 's1',
      segmentName: '高价值客户',
      insight: '高价值客户购买意向最高，且呈上升趋势，应重点维护',
      strength: 'positive',
      confidence: 90,
    },
    {
      segmentId: 's2',
      segmentName: '价格敏感型',
      insight: '价格敏感型客户购买意向下降，需要调整价格策略',
      strength: 'negative',
      confidence: 75,
    },
  ];

  const mockSegments = segments.length > 0 ? segments : ['高价值客户', '价格敏感型', '品质追求者'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>深度分析</CardTitle>
          <CardDescription>
            三级指标体系、论证强度分析与人群细分洞察
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hierarchy">
            <TreePine className="w-4 h-4 mr-2" />
            指标层级
          </TabsTrigger>
          <TabsTrigger value="segments">
            <Users className="w-4 h-4 mr-2" />
            人群对比
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="w-4 h-4 mr-2" />
            关键洞察
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="mt-6">
          <MetricHierarchy metrics={mockMetrics} />
        </TabsContent>

        <TabsContent value="segments" className="mt-6">
          <SegmentComparison
            metrics={mockSegmentMetrics}
            insights={mockSegmentInsights}
            segments={mockSegments}
          />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <KeyInsightsGenerator metrics={mockMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DeepAnalysis;
