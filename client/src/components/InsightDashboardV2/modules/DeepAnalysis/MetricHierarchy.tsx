/**
 * Metric Hierarchy Component
 * Displays 3-level indicator system with tree structure
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ArgumentationCard } from './ArgumentationCard';

export interface DataPoint {
  id: string;
  value: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface Argumentation {
  strength: 'strong' | 'moderate' | 'weak';
  evidence: Evidence[];
  logic: LogicChain;
  confidence: number;
  sources: DataSource[];
}

export interface Evidence {
  id: string;
  type: 'survey' | 'interview' | 'behavioral' | 'experimental';
  description: string;
  sampleSize: number;
  timestamp: Date;
  sourceUrl?: string;
}

export interface LogicChain {
  premise: string[];
  reasoning: string;
  conclusion: string;
}

export interface DataSource {
  id: string;
  type: 'questionnaire' | 'interview' | 'observation' | 'experiment';
  description: string;
  timestamp: Date;
  responseIds?: string[];
}

export interface MetricHierarchy {
  id: string;
  level: 1 | 2 | 3;
  name: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  dataPoints: DataPoint[];
  children?: MetricHierarchy[];
  argumentation: Argumentation;
  insight: string;
}

export interface MetricHierarchyProps {
  metrics: MetricHierarchy[];
  onMetricSelect?: (metric: MetricHierarchy) => void;
}

export function MetricHierarchy({ metrics, onMetricSelect }: MetricHierarchyProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 2:
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 3:
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return '一级指标';
      case 2:
        return '二级指标';
      case 3:
        return '三级指标';
      default:
        return '指标';
    }
  };

  const renderMetric = (metric: MetricHierarchy, depth: number = 0) => {
    const isExpanded = expandedNodes.has(metric.id);
    const hasChildren = metric.children && metric.children.length > 0;
    const paddingLeft = depth * 24;

    return (
      <div key={metric.id} className="select-none">
        {/* Metric Node */}
        <div
          className="flex items-start gap-2 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(metric.id);
            }
            onMetricSelect?.(metric);
          }}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(metric.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <div className="w-6 h-6 shrink-0" />
          )}

          {/* Metric Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={getLevelColor(metric.level)} variant="outline">
                {getLevelLabel(metric.level)}
              </Badge>
              <span className="font-medium text-sm">{metric.name}</span>
              {getTrendIcon(metric.trend)}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-lg font-bold">
                {metric.value}{metric.unit || ''}
              </span>
              <span className="text-xs text-muted-foreground">
                {metric.dataPoints.length} 个数据点
              </span>
            </div>

            {/* Argumentation Strength Badge */}
            <div className="mt-2">
              <Badge
                variant="outline"
                className={
                  metric.argumentation.strength === 'strong'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : metric.argumentation.strength === 'moderate'
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                      : 'bg-red-50 border-red-300 text-red-700'
                }
              >
                {metric.argumentation.strength === 'strong' ? '强论证' : metric.argumentation.strength === 'moderate' ? '中等论证' : '弱论证'}
                ({metric.argumentation.confidence}%)
              </Badge>
            </div>
          </div>
        </div>

        {/* Insight Preview */}
        {isExpanded && !hasChildren && (
          <div
            className="ml-12 mt-2 p-3 bg-muted/30 rounded-lg text-sm"
            style={{ marginLeft: `${paddingLeft + 48}px` }}
          >
            <p className="text-muted-foreground mb-1">洞察:</p>
            <p>{metric.insight}</p>
          </div>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {metric.children!.map(child => renderMetric(child, depth + 1))}
          </div>
        )}

        {/* Argumentation Card (expanded view) */}
        {isExpanded && !hasChildren && (
          <div className="mt-2" style={{ marginLeft: `${paddingLeft + 12}px` }}>
            <ArgumentationCard argumentation={metric.argumentation} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">指标层级体系</h3>
          <p className="text-sm text-muted-foreground">
            三级指标树形视图，点击展开查看详细论证
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedNodes(new Set(metrics.map(m => m.id)))}
          >
            全部展开
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedNodes(new Set())}
          >
            全部折叠
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-1">
            {metrics.map(metric => renderMetric(metric))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>指标层级:</span>
        <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">
          一级指标
        </Badge>
        <Badge variant="outline" className="bg-purple-100 border-purple-300 text-purple-800">
          二级指标
        </Badge>
        <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">
          三级指标
        </Badge>
      </div>
    </div>
  );
}
