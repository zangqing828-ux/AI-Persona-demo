/**
 * Key Insights Generator Component
 * AI-powered key insights generation from metrics and data
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Sparkles, Download } from 'lucide-react';
import { MetricHierarchy } from './MetricHierarchy';

// Helper function to convert trend to Chinese (avoids type narrowing issues)
function getTrendLabel(trend?: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up': return '上升';
    case 'down': return '下降';
    case 'stable': return '稳定';
    default: return '未知';
  }
}

export interface GeneratedInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'strength' | 'trend';
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations?: string[];
}

export interface KeyInsightsGeneratorProps {
  metrics: MetricHierarchy[];
  onInsightSelect?: (insight: GeneratedInsight) => void;
}

export function KeyInsightsGenerator({ metrics, onInsightSelect }: KeyInsightsGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'opportunities' | 'risks' | 'strengths' | 'trends'>('all');
  const [selectedInsight, setSelectedInsight] = useState<GeneratedInsight | null>(null);

  // Generate insights from metrics
  const generatedInsights = useMemo(() => {
    const insights: GeneratedInsight[] = [];

    metrics.forEach(metric => {
      // Analyze metric value and trend
      if (metric.value >= 80 && metric.trend === 'up') {
        insights.push({
          id: `insight-${metric.id}-strength`,
          type: 'strength',
          title: `${metric.name}表现优异`,
          description: `${metric.name}达到${metric.value}${metric.unit || ''}，且呈上升趋势，这表明我们在该领域表现出色。`,
          evidence: [
            `当前值: ${metric.value}${metric.unit || ''}`,
            `趋势: ${getTrendLabel(metric.trend)}`,
            `置信度: ${metric.argumentation.confidence}%`,
            `数据点: ${metric.dataPoints.length} 个`,
          ],
          confidence: metric.argumentation.confidence,
          impact: metric.value >= 90 ? 'high' : 'medium',
          actionable: false,
          recommendations: [
            '保持当前策略',
            '考虑将成功经验复制到其他领域',
            '持续监控该指标变化',
          ],
        });
      }

      if (metric.value <= 40 && metric.trend === 'down') {
        insights.push({
          id: `insight-${metric.id}-risk`,
          type: 'risk',
          title: `${metric.name}需要关注`,
          description: `${metric.name}仅为${metric.value}${metric.unit || ''}，且呈下降趋势，需要立即采取措施改善。`,
          evidence: [
            `当前值: ${metric.value}${metric.unit || ''}`,
            `趋势: ${getTrendLabel(metric.trend)}`,
            `置信度: ${metric.argumentation.confidence}%`,
            `数据点: ${metric.dataPoints.length} 个`,
          ],
          confidence: metric.argumentation.confidence,
          impact: metric.value <= 30 ? 'high' : 'medium',
          actionable: true,
          recommendations: [
            '深入分析下降原因',
            '制定针对性改进计划',
            '增加该领域的投入',
            '考虑用户反馈意见',
          ],
        });
      }

      if (metric.value >= 60 && metric.value <= 80 && metric.trend === 'up') {
        insights.push({
          id: `insight-${metric.id}-opportunity`,
          type: 'opportunity',
          title: `${metric.name}有提升空间`,
          description: `${metric.name}为${metric.value}${metric.unit || ''}，呈上升趋势，通过优化有可能达到更高水平。`,
          evidence: [
            `当前值: ${metric.value}${metric.unit || ''}`,
            `趋势: ${metric.trend === 'up' ? '上升' : metric.trend === 'down' ? '下降' : '稳定'}`,
            `潜力空间: ${100 - metric.value}${metric.unit || ''}`,
            `置信度: ${metric.argumentation.confidence}%`,
          ],
          confidence: metric.argumentation.confidence,
          impact: 'medium',
          actionable: true,
          recommendations: [
            '分析同类优秀案例',
            '识别改进关键点',
            '制定渐进式优化计划',
          ],
        });
      }

      if (metric.trend === 'up' || metric.trend === 'down') {
        insights.push({
          id: `insight-${metric.id}-trend`,
          type: 'trend',
          title: `${metric.name}呈现${metric.trend === 'up' ? '上升' : '下降'}趋势`,
          description: `数据显示${metric.name}在过去一段时间内持续${metric.trend === 'up' ? '上升' : '下降'}，值得关注。`,
          evidence: [
            `趋势方向: ${metric.trend === 'up' ? '上升' : '下降'}`,
            `当前值: ${metric.value}${metric.unit || ''}`,
            `数据点: ${metric.dataPoints.length} 个`,
            `变化率: 基于时间序列分析`,
          ],
          confidence: metric.argumentation.confidence,
          impact: 'medium',
          actionable: metric.trend === 'down',
          recommendations: metric.trend === 'down' ? [
            '分析下降原因',
            '评估影响范围',
            '制定应对措施',
          ] : [
            '确认上升驱动因素',
            '保持当前策略',
            '监测持续性',
          ],
        });
      }

      // Generate insights from children
      if (metric.children) {
        metric.children.forEach(child => {
          const childInsights = generateChildInsights(child, metric);
          insights.push(...childInsights);
        });
      }
    });

    // Remove duplicates and sort by confidence
    const uniqueInsights = Array.from(
      new Map(insights.map(i => [i.id, i])).values()
    );

    return uniqueInsights.sort((a, b) => b.confidence - a.confidence);
  }, [metrics]);

  const generateChildInsights = (child: MetricHierarchy, parent: MetricHierarchy): GeneratedInsight[] => {
    const insights: GeneratedInsight[] = [];

    if (child.argumentation.strength === 'strong' && child.value >= 75) {
      insights.push({
        id: `insight-${child.id}-child-strong`,
        type: 'strength',
        title: `${parent.name} - ${child.name}表现突出`,
        description: `在${parent.name}的细分维度中，${child.name}达到${child.value}${child.unit || ''}，论证强度高。`,
        evidence: [
          `所属维度: ${parent.name}`,
          `指标: ${child.name}`,
          `当前值: ${child.value}${child.unit || ''}`,
          `论证强度: 强 (${child.argumentation.confidence}%)`,
        ],
        confidence: child.argumentation.confidence,
        impact: 'high',
        actionable: false,
        recommendations: [
          '保持该细分维度的优势',
          '可作为成功经验参考',
        ],
      });
    }

    return insights;
  };

  // Filter insights by tab
  const filteredInsights = useMemo(() => {
    if (activeTab === 'all') return generatedInsights;

    return generatedInsights.filter(insight => {
      switch (activeTab) {
        case 'opportunities':
          return insight.type === 'opportunity';
        case 'risks':
          return insight.type === 'risk';
        case 'strengths':
          return insight.type === 'strength';
        case 'trends':
          return insight.type === 'trend';
        default:
          return true;
      }
    });
  }, [generatedInsights, activeTab]);

  const getInsightIcon = (type: GeneratedInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'strength':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type: GeneratedInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'bg-yellow-50 border-yellow-300';
      case 'risk':
        return 'bg-red-50 border-red-300';
      case 'strength':
        return 'bg-green-50 border-green-300';
      case 'trend':
        return 'bg-blue-50 border-blue-300';
    }
  };

  const getInsightTypeLabel = (type: GeneratedInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return '机会';
      case 'risk':
        return '风险';
      case 'strength':
        return '优势';
      case 'trend':
        return '趋势';
    }
  };

  const getImpactColor = (impact: GeneratedInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getImpactLabel = (impact: GeneratedInsight['impact']) => {
    switch (impact) {
      case 'high':
        return '高影响';
      case 'medium':
        return '中等影响';
      case 'low':
        return '低影响';
    }
  };

  const handleExport = () => {
    const data = filteredInsights.map(insight => ({
      类型: getInsightTypeLabel(insight.type),
      标题: insight.title,
      描述: insight.description,
      证据: insight.evidence.join('; '),
      置信度: `${insight.confidence}%`,
      影响程度: getImpactLabel(insight.impact),
      可执行: insight.actionable ? '是' : '否',
      建议: insight.recommendations?.join('; ') || '',
    }));

    // Export to CSV
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `key-insights-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <CardTitle>关键洞察生成</CardTitle>
              </div>
              <CardDescription className="mt-2">
                AI 驱动的智能洞察，从数据中发现机会、风险和趋势
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出洞察
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总洞察数</p>
                <p className="text-2xl font-bold">{generatedInsights.length}</p>
              </div>
              <Lightbulb className="w-8 h-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">机会</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {generatedInsights.filter(i => i.type === 'opportunity').length}
                </p>
              </div>
              <Lightbulb className="w-8 h-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">风险</p>
                <p className="text-2xl font-bold text-red-600">
                  {generatedInsights.filter(i => i.type === 'risk').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">优势</p>
                <p className="text-2xl font-bold text-green-600">
                  {generatedInsights.filter(i => i.type === 'strength').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">全部 ({generatedInsights.length})</TabsTrigger>
          <TabsTrigger value="opportunities">
            机会 ({generatedInsights.filter(i => i.type === 'opportunity').length})
          </TabsTrigger>
          <TabsTrigger value="risks">
            风险 ({generatedInsights.filter(i => i.type === 'risk').length})
          </TabsTrigger>
          <TabsTrigger value="strengths">
            优势 ({generatedInsights.filter(i => i.type === 'strength').length})
          </TabsTrigger>
          <TabsTrigger value="trends">
            趋势 ({generatedInsights.filter(i => i.type === 'trend').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredInsights.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无相关洞察</p>
                  <p className="text-sm mt-2">添加更多数据后将自动生成洞察</p>
                </CardContent>
              </Card>
            ) : (
              filteredInsights.map(insight => (
                <Card
                  key={insight.id}
                  className={`border-2 ${getInsightColor(insight.type)} hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => {
                    setSelectedInsight(insight);
                    onInsightSelect?.(insight);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">{getInsightIcon(insight.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getInsightColor(insight.type)}>
                              {getInsightTypeLabel(insight.type)}
                            </Badge>
                            <Badge variant="outline" className={getImpactColor(insight.impact)}>
                              {getImpactLabel(insight.impact)}
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="outline">可执行</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="outline">置信度: {insight.confidence}%</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Description */}
                      <p className="text-sm leading-relaxed">{insight.description}</p>

                      {/* Evidence */}
                      {insight.evidence.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">支撑证据</p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {insight.evidence.map((evidence, index) => (
                              <li key={index} className="text-muted-foreground ml-2">
                                {evidence}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {insight.recommendations && insight.recommendations.length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-sm font-medium text-muted-foreground mb-2">建议措施</p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {insight.recommendations.map((rec, index) => (
                              <li key={index} className="ml-2">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
