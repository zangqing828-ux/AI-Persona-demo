/**
 * Scoring Rules Component
 * Main interface for configuring scoring models
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RotateCcw } from 'lucide-react';
import { ThresholdEditor } from './ThresholdEditor';
import { WeightAllocation } from './WeightAllocation';
import { useConfig } from '@/config-system/hooks/useConfig';

export interface ScoringRulesProps {
  industryId?: string;
}

export function ScoringRules({ }: ScoringRulesProps) {
  const { configs, saveScoringConfig, resetToDefaults } = useConfig();
  const [purchaseIntentHigh, setPurchaseIntentHigh] = useState(80);
  const [purchaseIntentMedium, setPurchaseIntentMedium] = useState(50);
  const [purchaseIntentLow, setPurchaseIntentLow] = useState(20);

  const [weights, setWeights] = useState([
    { id: 'trust', name: '信任度', value: 0.3, color: '#3b82f6' },
    { id: 'price', name: '价格感知', value: 0.25, color: '#10b981' },
    { id: 'ingredients', name: '成分关注', value: 0.25, color: '#f59e0b' },
    { id: 'social', name: '社交证明', value: 0.2, color: '#8b5cf6' },
  ]);

  const handleSave = async () => {
    if (!configs.scoring) return;

    const updatedConfig = {
      ...configs.scoring,
      purchaseIntent: {
        ...configs.scoring.purchaseIntent,
        thresholds: {
          high: purchaseIntentHigh,
          medium: purchaseIntentMedium,
          low: purchaseIntentLow,
        },
        weights: {
          trustLevel: weights.find(w => w.id === 'trust')!.value,
          pricePerception: weights.find(w => w.id === 'price')!.value,
          ingredientConcerns: weights.find(w => w.id === 'ingredients')!.value,
          socialProof: weights.find(w => w.id === 'social')!.value,
        },
      },
    };

    await saveScoringConfig(updatedConfig);
  };

  const handleReset = async () => {
    await resetToDefaults();
    // Reset local state
    if (configs.scoring) {
      const { thresholds, weights: w } = configs.scoring.purchaseIntent;
      setPurchaseIntentHigh(thresholds.high);
      setPurchaseIntentMedium(thresholds.medium);
      setPurchaseIntentLow(thresholds.low);
      setWeights([
        { id: 'trust', name: '信任度', value: w.trustLevel, color: '#3b82f6' },
        { id: 'price', name: '价格感知', value: w.pricePerception, color: '#10b981' },
        { id: 'ingredients', name: '成分关注', value: w.ingredientConcerns, color: '#f59e0b' },
        { id: 'social', name: '社交证明', value: w.socialProof, color: '#8b5cf6' },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle>评分规则配置</CardTitle>
          <CardDescription>
            配置购买意向、NPS、价格敏感度等评分模型
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            保存配置
          </Button>
        </div>
      </div>

      <Tabs defaultValue="purchase-intent">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="purchase-intent">购买意向</TabsTrigger>
          <TabsTrigger value="nps">NPS</TabsTrigger>
          <TabsTrigger value="price-sensitivity">价格敏感度</TabsTrigger>
          <TabsTrigger value="risk">风险评估</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase-intent" className="space-y-6">
          <ThresholdEditor
            high={purchaseIntentHigh}
            medium={purchaseIntentMedium}
            low={purchaseIntentLow}
            onChange={(high, medium, low) => {
              setPurchaseIntentHigh(high);
              setPurchaseIntentMedium(medium);
              setPurchaseIntentLow(low);
            }}
          />

          <WeightAllocation
            weights={weights}
            onChange={setWeights}
          />
        </TabsContent>

        <TabsContent value="nps">
          <Card>
            <CardHeader>
              <CardTitle>NPS 评分配置</CardTitle>
              <CardDescription>
                净推荐值 (Net Promoter Score) 评分设置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>NPS 配置正在开发中...</p>
                <p className="text-sm mt-2">将支持推荐者、中立者、贬损者阈值配置</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="price-sensitivity">
          <Card>
            <CardHeader>
              <CardTitle>价格敏感度配置</CardTitle>
              <CardDescription>
                价格区间和弹性系数设置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>价格敏感度配置正在开发中...</p>
                <p className="text-sm mt-2">将支持价格区间和弹性系数配置</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>风险评估配置</CardTitle>
              <CardDescription>
                配置风险因子和聚合方法
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>风险评估配置正在开发中...</p>
                <p className="text-sm mt-2">将支持风险因子定义和聚合方法选择</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
