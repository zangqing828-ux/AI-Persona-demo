/**
 * Cross Analysis Component
 * Multi-dimensional analysis across different segments and dimensions
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Grid3x3, TrendingUp, BarChart3 } from 'lucide-react';

export interface AnalysisDataPoint {
  id: string;
  dimension1: string; // e.g., persona type
  dimension2: string; // e.g., segment
  metric: string; // e.g., purchase intent
  value: number;
  count: number;
  timestamp?: Date;
}

export interface CrossAnalysisProps {
  data: AnalysisDataPoint[];
  dimensions: {
    dimension1: string;
    dimension2: string;
    metric: string;
  };
}

type AnalysisType = 'matrix' | 'trend' | 'comparison';

export function CrossAnalysis({ data, dimensions }: CrossAnalysisProps) {
  const [dimension1, setDimension1] = useState<string>('all');
  const [dimension2, setDimension2] = useState<string>('all');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('matrix');

  // Get unique values
  const dimension1Values = useMemo(() => {
    return Array.from(new Set(data.map(d => d.dimension1)));
  }, [data]);

  const dimension2Values = useMemo(() => {
    return Array.from(new Set(data.map(d => d.dimension2)));
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(d => {
      if (dimension1 !== 'all' && d.dimension1 !== dimension1) return false;
      if (dimension2 !== 'all' && d.dimension2 !== dimension2) return false;
      return true;
    });
  }, [data, dimension1, dimension2]);

  // Calculate matrix data
  const matrixData = useMemo(() => {
    const matrix: Record<string, Record<string, { value: number; count: number }>> = {};

    dimension1Values.forEach(d1 => {
      matrix[d1] = {};
      dimension2Values.forEach(d2 => {
        matrix[d1][d2] = { value: 0, count: 0 };
      });
    });

    filteredData.forEach(d => {
      if (matrix[d.dimension1] && matrix[d.dimension1][d.dimension2] !== undefined) {
        matrix[d.dimension1][d.dimension2].value += d.value;
        matrix[d.dimension1][d.dimension2].count += d.count;
      }
    });

    // Calculate averages
    Object.keys(matrix).forEach(d1 => {
      Object.keys(matrix[d1]).forEach(d2 => {
        if (matrix[d1][d2].count > 0) {
          matrix[d1][d2].value = matrix[d1][d2].value / matrix[d1][d2].count;
        }
      });
    });

    return matrix;
  }, [filteredData, dimension1Values, dimension2Values]);

  // Calculate comparison data
  const comparisonData = useMemo(() => {
    const comparison: Record<string, { total: number; count: number; avg: number }> = {};

    dimension1Values.forEach(d1 => {
      comparison[d1] = { total: 0, count: 0, avg: 0 };
    });

    filteredData.forEach(d => {
      if (comparison[d.dimension1]) {
        comparison[d.dimension1].total += d.value;
        comparison[d.dimension1].count += d.count;
      }
    });

    Object.keys(comparison).forEach(key => {
      comparison[key].avg = comparison[key].count > 0
        ? comparison[key].total / comparison[key].count
        : 0;
    });

    return comparison;
  }, [filteredData, dimension1Values]);

  // Get color based on value
  const getColorForValue = (value: number, min: number, max: number) => {
    const ratio = (value - min) / (max - min);
    if (ratio < 0.33) return 'bg-red-100 border-red-300';
    if (ratio < 0.66) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  const allValues = filteredData.map(d => d.value);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>交叉分析</CardTitle>
          <CardDescription>
            多维度数据透视分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={analysisType} onValueChange={(v) => setAnalysisType(v as AnalysisType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matrix">
                <Grid3x3 className="w-4 h-4 mr-2" />
                矩阵视图
              </TabsTrigger>
              <TabsTrigger value="comparison">
                <BarChart3 className="w-4 h-4 mr-2" />
                对比分析
              </TabsTrigger>
              <TabsTrigger value="trend">
                <TrendingUp className="w-4 h-4 mr-2" />
                趋势分析
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{dimensions.dimension1}</Label>
                <Select value={dimension1} onValueChange={setDimension1}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {dimension1Values.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{dimensions.dimension2}</Label>
                <Select value={dimension2} onValueChange={setDimension2}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {dimension2Values.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Matrix View */}
            <TabsContent value="matrix" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">矩阵热力图</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">指标:</span>
                    <Badge variant="outline">{dimensions.metric}</Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-border p-2 bg-muted text-sm font-medium">
                          {dimensions.dimension1} \ {dimensions.dimension2}
                        </th>
                        {dimension2Values.map(d2 => (
                          <th
                            key={d2}
                            className="border border-border p-2 bg-muted text-sm font-medium"
                          >
                            {d2}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dimension1Values.map(d1 => (
                        <tr key={d1}>
                          <td className="border border-border p-2 bg-muted/50 font-medium text-sm">
                            {d1}
                          </td>
                          {dimension2Values.map(d2 => {
                            const cell = matrixData[d1]?.[d2];
                            const value = cell?.value || 0;
                            const count = cell?.count || 0;
                            const displayValue = count > 0 ? value.toFixed(1) : '-';

                            return (
                              <td
                                key={d2}
                                className={`border border-border p-2 text-center text-sm font-medium ${count > 0 ? getColorForValue(value, minValue, maxValue) : 'bg-gray-50'}`}
                              >
                                <div>{displayValue}</div>
                                {count > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    n={count}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">热力图说明:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                    <span>低</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
                    <span>中</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                    <span>高</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Comparison View */}
            <TabsContent value="comparison" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{dimensions.dimension1} 对比分析</h3>

                <div className="space-y-3">
                  {Object.entries(comparisonData)
                    .sort(([, a], [, b]) => b.avg - a.avg)
                    .map(([key, data]) => {
                      const percentage = maxValue > 0 ? (data.avg / maxValue) * 100 : 0;

                      return (
                        <Card key={key}>
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{key}</span>
                                <Badge variant="outline">
                                  {data.avg.toFixed(2)}
                                </Badge>
                              </div>

                              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>样本数: {data.count}</span>
                                <span>占比: {percentage.toFixed(1)}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            </TabsContent>

            {/* Trend View */}
            <TabsContent value="trend" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>趋势分析功能开发中...</p>
                <p className="text-sm mt-2">将支持时间序列分析和趋势预测</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>统计摘要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">数据点总数</p>
              <p className="text-2xl font-bold">{filteredData.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">平均值</p>
              <p className="text-2xl font-bold">
                {(filteredData.reduce((sum, d) => sum + d.value, 0) / filteredData.length).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">最大值</p>
              <p className="text-2xl font-bold">{maxValue.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
