/**
 * Threshold Editor Component
 * Editor for purchase intent thresholds using sliders
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface ThresholdEditorProps {
  high: number;
  medium: number;
  low: number;
  onChange: (high: number, medium: number, low: number) => void;
}

export function ThresholdEditor({ high, medium, low, onChange }: ThresholdEditorProps) {
  const handleHighChange = (value: number) => {
    onChange(value, Math.min(medium, value - 1), Math.min(low, value - 2));
  };

  const handleMediumChange = (value: number) => {
    onChange(Math.max(high, value + 1), value, Math.min(low, value - 1));
  };

  const handleLowChange = (value: number) => {
    onChange(Math.max(high, value + 2), Math.max(medium, value + 1), value);
  };

  const getLabel = (value: number, type: 'high' | 'medium' | 'low') => {
    if (type === 'high') return `高意向: ≥ ${value}%`;
    if (type === 'medium') return `中意向: ${value}-${high - 1}%`;
    return `低意向: < ${value}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">购买意向阈值</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High Intent */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              高意向阈值
            </Label>
            <Badge variant="outline" className="text-green-500">
              {getLabel(high, 'high')}
            </Badge>
          </div>
          <Slider
            value={[high]}
            onValueChange={([value]) => handleHighChange(value)}
            min={low + 2}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-green-500"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={high}
              onChange={(e) => handleHighChange(Number(e.target.value))}
              min={low + 2}
              max={100}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {/* Medium Intent */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-yellow-500" />
              中意向阈值
            </Label>
            <Badge variant="outline" className="text-yellow-500">
              {getLabel(medium, 'medium')}
            </Badge>
          </div>
          <Slider
            value={[medium]}
            onValueChange={([value]) => handleMediumChange(value)}
            min={low + 1}
            max={high - 1}
            step={1}
            className="[&_[role=slider]]:bg-yellow-500"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={medium}
              onChange={(e) => handleMediumChange(Number(e.target.value))}
              min={low + 1}
              max={high - 1}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {/* Low Intent */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              低意向阈值
            </Label>
            <Badge variant="outline" className="text-red-500">
              {getLabel(low, 'low')}
            </Badge>
          </div>
          <Slider
            value={[low]}
            onValueChange={([value]) => handleLowChange(value)}
            min={0}
            max={medium - 1}
            step={1}
            className="[&_[role=slider]]:bg-red-500"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={low}
              onChange={(e) => handleLowChange(Number(e.target.value))}
              min={0}
              max={medium - 1}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {/* Validation */}
        {high <= medium || medium <= low ? (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">
              ⚠️ 阈值必须满足: 高意向 &gt; 中意向 &gt; 低意向
            </p>
          </div>
        ) : (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-600">
              ✓ 阈值配置正确
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
