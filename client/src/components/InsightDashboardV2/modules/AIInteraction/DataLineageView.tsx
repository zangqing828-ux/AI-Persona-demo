/**
 * Data Lineage View Component
 * Visualizes the flow of data from raw sources to conclusions
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, Database, MessageSquare, BarChart3, Lightbulb, ChevronRight } from 'lucide-react';

export interface DataLineageNode {
  id: string;
  type: 'conclusion' | 'metric' | 'data' | 'response';
  label: string;
  value?: unknown;
  source?: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
  children?: DataLineageNode[];
}

export interface DataLineageViewProps {
  lineage: DataLineageNode;
  onNodeClick?: (node: DataLineageNode) => void;
}

export function DataLineageView({ lineage, onNodeClick }: DataLineageViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([lineage.id]));

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

  const getNodeIcon = (type: DataLineageNode['type']) => {
    switch (type) {
      case 'conclusion':
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      case 'metric':
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'data':
        return <Database className="w-4 h-4 text-purple-600" />;
      case 'response':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
    }
  };

  const getNodeColor = (type: DataLineageNode['type']) => {
    switch (type) {
      case 'conclusion':
        return 'bg-yellow-50 border-yellow-300';
      case 'metric':
        return 'bg-blue-50 border-blue-300';
      case 'data':
        return 'bg-purple-50 border-purple-300';
      case 'response':
        return 'bg-green-50 border-green-300';
    }
  };

  const getTypeLabel = (type: DataLineageNode['type']) => {
    switch (type) {
      case 'conclusion':
        return '结论';
      case 'metric':
        return '指标';
      case 'data':
        return '数据';
      case 'response':
        return '回复';
    }
  };

  const renderNode = (node: DataLineageNode, depth: number = 0): React.JSX.Element => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const marginLeft = depth * 24;

    return (
      <div key={node.id} className="select-none">
        {/* Node Card */}
        <div
          className="flex items-start gap-3 p-3 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
          style={{ marginLeft: `${marginLeft}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(node.id);
            }
            onNodeClick?.(node);
          }}
        >
          {/* Icon */}
          <div className="shrink-0 mt-0.5">{getNodeIcon(node.type)}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={getNodeColor(node.type)}>
                {getTypeLabel(node.type)}
              </Badge>
              <span className="font-medium text-sm">{node.label}</span>
            </div>

            {node.value !== undefined && (
              <p className="text-sm text-muted-foreground">
                {typeof node.value === 'object' ? JSON.stringify(node.value) : String(node.value)}
              </p>
            )}

            {node.source && (
              <p className="text-xs text-muted-foreground mt-1">
                来源: {node.source}
              </p>
            )}

            {node.timestamp && (
              <p className="text-xs text-muted-foreground">
                {new Date(node.timestamp).toLocaleString()}
              </p>
            )}

            {node.metadata && Object.keys(node.metadata).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {Object.entries(node.metadata).slice(0, 3).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </Button>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2 relative">
            {/* Connector Line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px bg-border"
              style={{ marginLeft: `${marginLeft + 12}px` }}
            />

            {node.children!.map(child => (
              <div key={child.id} className="relative">
                {/* Horizontal Connector */}
                <div
                  className="absolute left-0 top-3 w-3 h-px bg-border"
                  style={{ marginLeft: `${marginLeft + 12}px` }}
                />
                {renderNode(child, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Build lineage tree from conclusion
  const buildLineageTree = (root: DataLineageNode): DataLineageNode => {
    // Clone to avoid mutation
    return {
      ...root,
      children: root.children?.map(child => buildLineageTree(child)),
    };
  };

  const tree = buildLineageTree(lineage);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>数据溯源视图</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedNodes(new Set([lineage.id]))}
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
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderNode(tree)}

            {/* Legend */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">图例说明</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span>结论 (最终洞察)</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>指标 (中间数据)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-600" />
                  <span>数据 (原始记录)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span>回复 (用户反馈)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Summary */}
      <Card>
        <CardHeader>
          <CardTitle>数据流向说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span>原始回复</span>
            </div>
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              <span>聚合数据</span>
            </div>
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>分析指标</span>
            </div>
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span>业务结论</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            点击任意节点查看详细信息。该视图展示了从原始用户反馈到最终业务结论的完整数据流转过程。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
