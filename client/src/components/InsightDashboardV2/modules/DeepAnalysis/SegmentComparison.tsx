/**
 * Segment Comparison Component
 * Deep dive into user segments with comparative analysis
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, BarChart3, PieChart } from 'lucide-react';

export interface SegmentMetric {
  segmentId: string;
  segmentName: string;
  metricName: string;
  value: number;
  change?: number;
  sampleSize: number;
  benchmark?: number;
}

export interface SegmentInsight {
  segmentId: string;
  segmentName: string;
  insight: string;
  strength: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export interface SegmentComparisonProps {
  metrics: SegmentMetric[];
  insights: SegmentInsight[];
  segments: string[];
  availableMetrics?: string[];
}

export function SegmentComparison({
  metrics,
  insights,
  segments,
  availableMetrics,
}: SegmentComparisonProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detail' | 'insights'>('overview');

  // Get unique metrics
  const metricList = useMemo(() => {
    const uniqueMetrics = Array.from(new Set(metrics.map(m => m.metricName)));
    return availableMetrics || uniqueMetrics;
  }, [metrics, availableMetrics]);

  // Filter metrics by selection
  const filteredMetrics = useMemo(() => {
    if (selectedMetric === 'all') return metrics;
    return metrics.filter(m => m.metricName === selectedMetric);
  }, [metrics, selectedMetric]);

  // Calculate segment comparison data
  const comparisonData = useMemo(() => {
    const data: Record<string, SegmentMetric[]> = {};

    segments.forEach(segment => {
      data[segment] = filteredMetrics.filter(m => m.segmentName === segment);
    });

    return data;
  }, [filteredMetrics, segments]);

  // Get segment insights
  const segmentInsights = useMemo(() => {
    const insightsMap: Record<string, SegmentInsight[]> = {};

    insights.forEach(insight => {
      if (!insightsMap[insight.segmentName]) {
        insightsMap[insight.segmentName] = [];
      }
      insightsMap[insight.segmentName].push(insight);
    });

    return insightsMap;
  }, [insights]);

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-600';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return '—';
    if (change > 0) return `↑ ${change}%`;
    if (change < 0) return `↓ ${Math.abs(change)}%`;
    return '—';
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'positive':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'negative':
        return 'bg-red-50 border-red-300 text-red-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>细分人群对比分析</CardTitle>
              <CardDescription>
                深入分析不同用户群体的指标表现和洞察
              </CardDescription>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择指标" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部指标</SelectItem>
                {metricList.map(metric => (
                  <SelectItem key={metric} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            概览对比
          </TabsTrigger>
          <TabsTrigger value="detail">
            <TrendingUp className="w-4 h-4 mr-2" />
            详细数据
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Users className="w-4 h-4 mr-2" />
            细分洞察
          </TabsTrigger>
        </TabsList>

        {/* Overview Mode */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map(segment => {
              const segmentMetrics = comparisonData[segment] || [];
              const avgValue =
                segmentMetrics.length > 0
                  ? segmentMetrics.reduce((sum, m) => sum + m.value, 0) / segmentMetrics.length
                  : 0;

              return (
                <Card key={segment} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{segment}</CardTitle>
                    <CardDescription>
                      {segmentMetrics.length} 个指标
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Average Value */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">平均得分</p>
                        <p className="text-3xl font-bold">{avgValue.toFixed(1)}</p>
                      </div>

                      {/* Top Metrics */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">主要指标</p>
                        <div className="space-y-2">
                          {segmentMetrics.slice(0, 3).map(metric => (
                            <div
                              key={metric.segmentId + metric.metricName}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-muted-foreground">{metric.metricName}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{metric.value}</span>
                                <span className={getChangeColor(metric.change)}>
                                  {getChangeIcon(metric.change)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sample Size */}
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>样本量</span>
                          <span>
                            {segmentMetrics.reduce((sum, m) => sum + m.sampleSize, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Detail Mode */}
        <TabsContent value="detail" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>详细指标对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-border p-3 text-left bg-muted text-sm font-medium">
                        细分人群
                      </th>
                      {metricList.slice(0, 6).map(metric => (
                        <th
                          key={metric}
                          className="border border-border p-3 text-center bg-muted text-sm font-medium"
                        >
                          {metric}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {segments.map(segment => {
                      const segmentMetrics = comparisonData[segment] || [];

                      return (
                        <tr key={segment}>
                          <td className="border border-border p-3 font-medium text-sm">
                            {segment}
                          </td>
                          {metricList.slice(0, 6).map(metric => {
                            const metricData = segmentMetrics.find(
                              m => m.metricName === metric
                            );

                            return (
                              <td
                                key={metric}
                                className="border border-border p-3 text-center text-sm"
                              >
                                {metricData ? (
                                  <div>
                                    <div className="font-medium">{metricData.value}</div>
                                    {metricData.benchmark && (
                                      <div className="text-xs text-muted-foreground">
                                        vs {metricData.benchmark}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Mode */}
        <TabsContent value="insights" className="mt-6">
          <div className="space-y-4">
            {segments.map(segment => {
              const insights = segmentInsights[segment] || [];

              if (insights.length === 0) {
                return null;
              }

              return (
                <Card key={segment}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{segment}</CardTitle>
                      <Badge variant="outline">{insights.length} 条洞察</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.map(insight => (
                        <div
                          key={insight.segmentId}
                          className={`p-3 rounded-lg border ${getStrengthColor(insight.strength)}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm flex-1">{insight.insight}</p>
                            <Badge variant="outline" className="shrink-0">
                              {insight.confidence}% 置信度
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {Object.keys(segmentInsights).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无细分人群洞察</p>
                <p className="text-sm mt-2">完成数据收集后将自动生成洞察</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
