/**
 * Weight Allocation Component
 * Interactive weight allocation with validation
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface WeightItem {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface WeightAllocationProps {
  weights: WeightItem[];
  onChange: (weights: WeightItem[]) => void;
}

export function WeightAllocation({ weights, onChange }: WeightAllocationProps) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = weights.reduce((sum, w) => sum + w.value, 0);
    setTotal(sum);
  }, [weights]);

  const handleWeightChange = (id: string, newValue: number) => {
    const updatedWeights = weights.map(w =>
      w.id === id ? { ...w, value: newValue } : w
    );
    onChange(updatedWeights);
  };

  const normalizeWeights = () => {
    if (total === 0) return;

    const normalized = weights.map(w => ({
      ...w,
      value: Math.round((w.value / total) * 100) / 100,
    }));

    // Ensure sum is exactly 1.0 by adjusting the largest weight
    const currentSum = normalized.reduce((sum, w) => sum + w.value, 0);
    const diff = 1.0 - currentSum;

    if (diff !== 0) {
      const maxWeight = normalized.reduce((max, w) =>
        w.value > max.value ? w : max
      );
      maxWeight.value = Math.round((maxWeight.value + diff) * 100) / 100;
    }

    onChange(normalized);
  };

  const isValid = Math.abs(total - 1.0) < 0.01;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">评分因子权重</CardTitle>
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <Badge variant={isValid ? "default" : "secondary"}>
              总计: {(total * 100).toFixed(0)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {weights.map((weight) => (
          <div key={weight.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: weight.color }}
                />
                {weight.name}
              </Label>
              <Badge variant="outline">{(weight.value * 100).toFixed(0)}%</Badge>
            </div>
            <Slider
              value={[weight.value * 100]}
              onValueChange={([value]) => handleWeightChange(weight.id, value / 100)}
              min={0}
              max={100}
              step={1}
              className="mt-2"
              style={{
                '--slider-background': weight.color,
              } as React.CSSProperties}
            />
            <Progress value={weight.value * 100} className="h-2" />
          </div>
        ))}

        {!isValid && (
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
            <p className="text-sm text-yellow-600">
              权重总和应为 100%，当前为 {(total * 100).toFixed(0)}%
            </p>
            <button
              onClick={normalizeWeights}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              自动归一化
            </button>
          </div>
        )}

        {isValid && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-600">
              ✓ 权重分配正确
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
